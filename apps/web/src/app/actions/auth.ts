'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

/**
 * Sign the current staff member out.
 *
 * `scope: 'local'` revokes this session's refresh token on the Auth server
 * and clears the session cookie. It deliberately does *not* use the `global`
 * scope, which would sign the user out of every other device as well — that
 * is a surprising side effect for an ordinary "log out" button.
 *
 * The redirect happens inside the action so the browser lands on a fresh page
 * with the cookie already gone. Redirecting to a server-rendered page without
 * doing that would briefly render the ledger, because the client-side router
 * would still be holding the previous page.
 */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    console.error('[auth] sign out failed:', error.message);
  }

  redirect('/login');
}
