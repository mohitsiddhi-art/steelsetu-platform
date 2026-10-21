/**
 * Provision a SteelSetu staff account.
 *
 * A staff member is an ordinary Supabase email/password user whose
 * `app_metadata` carries `staff: true`. That flag is copied by the Auth
 * server into every access token it issues, so it is signed by Supabase and
 * cannot be forged by the client. The trade desk guard and the
 * `rfq_inquiries` RLS policy both read it from the verified token:
 *
 *     auth.jwt() -> 'app_metadata' ->> 'staff' = 'true'
 *
 * so the app check and the database check share one source of truth.
 *
 * Usage:
 *   node provision-staff.js <email> <password>
 *   node provision-staff.js <email> <password> --revoke
 *
 * The script is idempotent: it creates the account if it is missing and
 * otherwise resets the password and (re)asserts the staff flag. It refuses to
 * silently leave a half-configured account behind, and it verifies the result
 * by actually signing in through the Auth server and decoding the returned
 * token.
 *
 * NOTE: this writes to `auth.users` directly, which is a Postgres-internal
 * table of the Auth server. It is the standard way to seed a staff account
 * from a trusted admin context; the alternative is to flip the flag by hand in
 * the Supabase dashboard.
 */
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uhxdnvuagwxwedlbwavm.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const STAFF_APP_METADATA = {
  provider: 'email',
  providers: ['email'],
  staff: true,
};

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  const password = process.argv[3] || '';
  const revoke = process.argv.includes('--revoke');

  if (!email) {
    console.error('Usage: node provision-staff.js <email> <password> [--revoke]');
    process.exit(1);
  }

  if (!revoke && password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  await client.connect();

  const existing = await client.query(
    'SELECT id, email, raw_app_meta_data FROM auth.users WHERE lower(email) = $1',
    [email]
  );

  if (revoke) {
    if (existing.rows.length === 0) {
      console.log(`No account for ${email} — nothing to revoke.`);
      await client.end();
      return;
    }
    // Drop the staff flag but keep the account, so the person can still sign
    // in to the customer-facing parts of the site.
    await client.query(
      `UPDATE auth.users
         SET raw_app_meta_data = raw_app_meta_data - 'staff',
             updated_at = now()
       WHERE id = $1`,
      [existing.rows[0].id]
    );
    console.log(`✓ Staff flag revoked for ${email}.`);
    await client.end();
    return;
  }

  const hash = await client.query('SELECT crypt($1, gen_salt(\'bf\', 10)) AS hash', [
    password,
  ]);

  // GoTrue scans these `auth.users` columns into non-nullable Go strings. A NULL
  // in any of them makes the row unreadable to the Auth server, and the
  // password grant fails with a 500 "Database error querying schema" rather
  // than an obvious error. The server itself always writes empty strings here,
  // so we match that exactly — every string column below is coerced to ''.
  const NULLABLE_TOKEN_COLUMNS = [
    'confirmation_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'email_change',
    'phone_change',
    'phone_change_token',
    'reauthentication_token',
  ];

  const tokenCoalesce = NULLABLE_TOKEN_COLUMNS.map(
    (column) => `${column} = coalesce(${column}, '')`
  ).join(', ');

  // The Auth server scopes its user lookup by `instance_id`. This project has
  // exactly one instance, and it uses the zero UUID. Leaving the column NULL
  // creates a user the Auth server cannot find on sign-in — the row looks
  // correct in the table but every password grant fails with
  // "invalid_credentials". So resolve the instance id rather than hard-coding
  // it, and fall back to the zero UUID if the table is momentarily empty.
  const instance = await client.query('SELECT id FROM auth.instances LIMIT 1');
  const instanceId = instance.rows[0]?.id ?? '00000000-0000-0000-0000-000000000000';

  let userId;

  if (existing.rows.length === 0) {
    await client.query('BEGIN');
    try {
      const created = await client.query(
        `INSERT INTO auth.users
           (instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
            confirmation_token, recovery_token, email_change_token_new,
            email_change_token_current, email_change, phone_change,
            phone_change_token, reauthentication_token,
            created_at, updated_at)
         VALUES ($4, gen_random_uuid(), 'authenticated', 'authenticated', $1, $2,
                 now(), $3::jsonb, '{"email_verified":true}'::jsonb,
                 '', '', '', '', '', '', '', '',
                 now(), now())
         RETURNING id`,
        [email, hash.rows[0].hash, JSON.stringify(STAFF_APP_METADATA), instanceId]
      );
      userId = created.rows[0].id;

      await client.query(
        `INSERT INTO auth.identities
           (provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at)
         VALUES ($1, $2, $3::jsonb, 'email', now(), now(), now())`,
        [
          userId,
          userId,
          JSON.stringify({
            sub: userId,
            email,
            email_verified: true,
            phone_verified: false,
          }),
        ]
      );

      await client.query('COMMIT');
      console.log(`✓ Created staff account ${email}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Could not create the account:', error.message);
      await client.end();
      process.exit(1);
    }
  } else {
    userId = existing.rows[0].id;

    await client.query(
      `UPDATE auth.users
         SET encrypted_password = $2,
             email_confirmed_at = now(),
             raw_app_meta_data = $3::jsonb,
             instance_id = $4,
             ${tokenCoalesce},
             updated_at = now()
       WHERE id = $1`,
      [userId, hash.rows[0].hash, JSON.stringify(STAFF_APP_METADATA), instanceId]
    );

    // Make sure the email identity row exists — without it the Auth server
    // refuses the password grant even though the user row is present.
    const identity = await client.query(
      'SELECT id FROM auth.identities WHERE user_id = $1 AND provider = $2',
      [userId, 'email']
    );

    if (identity.rows.length === 0) {
      await client.query(
        `INSERT INTO auth.identities
           (provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at)
         VALUES ($1, $2, $3::jsonb, 'email', now(), now(), now())`,
        [
          userId,
          userId,
          JSON.stringify({
            sub: userId,
            email,
            email_verified: true,
            phone_verified: false,
          }),
        ]
      );
    }

    console.log(`✓ Updated staff account ${email}`);
  }

  // Verify end to end: sign in through the Auth server and decode the token.
  if (!ANON_KEY) {
    console.warn(
      '⚠ No anon key available for the verification sign-in. ' +
        'Add SUPABASE_ANON_KEY to packages/database/.env to enable it.'
    );
    await client.end();
    return;
  }

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const body = await response.text();

  if (!response.ok) {
    console.error('✗ Sign-in verification FAILED:', response.status, body.slice(0, 300));
    await client.end();
    process.exit(1);
  }

  const session = JSON.parse(body);
  const claims = JSON.parse(
    Buffer.from(session.access_token.split('.')[1], 'base64url').toString()
  );

  console.log('\n✓ Sign-in verified.');
  console.log(`  user id : ${claims.sub}`);
  console.log(`  email   : ${claims.email}`);
  console.log(`  role    : ${claims.role}`);
  console.log(`  staff   : ${JSON.stringify(claims.app_metadata?.staff)}`);

  if (claims.app_metadata?.staff !== true) {
    console.error('✗ The issued token does not carry the staff flag.');
    await client.end();
    process.exit(1);
  }

  await client.end();
}

main().catch((error) => {
  console.error('Provisioning failed:', error);
  process.exit(1);
});
