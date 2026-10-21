/**
 * Migration runner for the SteelSetu Supabase database.
 *
 * Applies every `migrations/*.sql` file in filename order that has not been
 * recorded in the `schema_migrations` table, inside a transaction each.
 *
 * Usage:
 *   node migrate.js            # apply pending migrations
 *   node migrate.js --status   # list applied / pending migrations
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id          text PRIMARY KEY,
      applied_at  timestamptz NOT NULL DEFAULT now()
    )
  `);
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql') && !f.endsWith('.down.sql'))
    .sort();
}

async function main() {
  const statusOnly = process.argv.includes('--status');

  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  await client.connect();

  await ensureMigrationTable(client);
  const { rows } = await client.query('SELECT id FROM schema_migrations');
  const applied = new Set(rows.map((r) => r.id));

  const files = listMigrationFiles();
  const pending = files.filter((f) => !applied.has(f));

  if (statusOnly) {
    console.log('\nSteelsetu migration status\n');
    for (const f of files) {
      console.log(`  ${applied.has(f) ? '[applied]' : '[pending]'} ${f}`);
    }
    console.log('');
    await client.end();
    return;
  }

  if (pending.length === 0) {
    console.log('✓ Database is up to date. No pending migrations.');
    await client.end();
    return;
  }

  console.log(`\nApplying ${pending.length} migration(s)...\n`);

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`  ✓ ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  ✗ ${file}\n    ${err.message}`);
      await client.end();
      process.exit(1);
    }
  }

  console.log('\n✓ All migrations applied.\n');
  await client.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
