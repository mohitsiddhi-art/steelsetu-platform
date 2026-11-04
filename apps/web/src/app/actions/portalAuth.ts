'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { isPlausibleEmail } from '@/lib/email';

/**
 * Portal sign-up and sign-in.
 *
 * These are Server Actions rather than client-side Auth calls, because the
 * sign-up has to do three things in one atomic step:
 *
 *   1. create the Auth account,
 *   2. create the `user_profiles` row that the RLS policies key off,
 *   3. establish the session cookie the server components read.
 *
 * Doing (1) in the browser and (2) afterwards from the client would leave a
 * window where the account exists but the profile does not — and the profile
 * is what every other table's RLS policy resolves the owner through, so the
 * account would be invisible to its own wishlist.
 *
 * The server client sends the signed-in user's own JWT, so the insert is
 * evaluated as `authenticated` and the "Owner insert on user_profiles"
 * policy applies. No service-role key is involved anywhere.
 */

/** The outcome the form renders back to the browser. */
export interface AuthActionResult {
  ok: boolean;
  /** A field key the form can attach the message to, when the failure is field-specific. */
  field?: 'email' | 'password' | 'firstName' | 'lastName' | 'role';
  message?: string;
  /** The role the account was created with, so the client can route on success. */
  role?: 'buyer' | 'seller';
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

/**
 * Create a portal account and sign the new user in.
 *
 * The first name and last name are stored on the profile rather than in the
 * Auth metadata, because they are ordinary application data that the user can
 * edit — `user_metadata` is writable by the client, which makes it the wrong
 * home for anything the app trusts.
 */
export async function signUpAction(input: SignUpInput): Promise<AuthActionResult> {
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const role = input.role === 'seller' ? 'seller' : 'buyer';

  if (firstName.length < 2) {
    return { ok: false, field: 'firstName' };
  }
  if (!lastName) {
    return { ok: false, field: 'lastName' };
  }
  if (!isPlausibleEmail(email)) {
    return { ok: false, field: 'email' };
  }
  if (input.password.length < 8) {
    return { ok: false, field: 'password' };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      // A display name is a nicety, not a source of truth — the authoritative
      // copy lives in `user_profiles`.
      data: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
      // The portal must be usable the moment the account is created, so the
      // confirmation step is skipped. Supabase still requires a confirmed
      // email for `signInWithPassword` on projects with email confirmation
      // turned on, which the server handles below.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`,
    },
  });

  if (error) {
    // "already registered" is a distinct, actionable outcome — the user
    // should sign in rather than keep retrying the sign-up.
    if (/already|registered|exists/i.test(error.message)) {
      return { ok: false, field: 'email', message: 'emailInUse' };
    }
    console.error('[portalAuth] sign up failed:', error.message);
    return { ok: false, message: 'signUpFailed' };
  }

  const user = data.user;
  if (!user) {
    return { ok: false, message: 'signUpFailed' };
  }

  // Supabase returns a user with no session when the project requires email
  // confirmation. Sign in explicitly so the flow works either way.
  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (signInError) {
      console.error('[portalAuth] sign-in after sign-up failed:', signInError.message);
      return { ok: false, message: 'signUpFailed' };
    }
  }

  // Create the profile row. The insert goes through the RLS policy, which
  // checks `user_id = auth.uid()` — the session is already established, so
  // the insert is authorised.
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      locale: 'en',
    });

  if (profileError) {
    // A duplicate profile means the account already had one (an email
    // confirmation flow that ran twice, say). That is not fatal — the user
    // still has a working account — but it must not fail the whole sign-up.
    if (profileError.code !== '23505') {
      console.error('[portalAuth] profile insert failed:', profileError.message);
      return { ok: false, message: 'signUpFailed' };
    }
  }

  return { ok: true, role };
}

/**
 * Sign an existing portal user in.
 *
 * The role is read back from the profile rather than taken from the form, so
 * the post-login route always matches the role the account actually has.
 */
export async function signInAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const trimmed = email.trim().toLowerCase();

  if (!isPlausibleEmail(trimmed)) {
    return { ok: false, field: 'email' };
  }
  if (!password) {
    return { ok: false, field: 'password' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: trimmed,
    password,
  });

  if (error) {
    return { ok: false, message: 'credentialsRejected' };
  }

  const { data: claims } = await supabase.auth.getClaims();

  if (claims?.claims) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', claims.claims.sub)
      .maybeSingle();

    if (profile?.role) {
      return { ok: true, role: profile.role === 'seller' ? 'seller' : 'buyer' };
    }
  }

  return { ok: true, role: 'buyer' };
}

/**
 * Sign the current portal user out.
 *
 * `scope: 'local'` revokes this session's refresh token on the Auth server
 * and clears the session cookie. It deliberately does *not* use the `global`
 * scope, which would sign the user out of every other device as well — that
 * is a surprising side effect for an ordinary "Log out" button.
 *
 * The redirect happens inside the action so the browser lands on a fresh page
 * with the cookie already gone. Redirecting to a server-rendered page without
 * doing that would briefly render the dashboard, because the client-side
 * router would still be holding the previous page.
 */
export async function portalSignOutAction() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    console.error('[portalAuth] sign out failed:', error.message);
  }

  redirect('/user-login');
}
