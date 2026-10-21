import { createSupabaseServerClient } from '@/lib/supabaseServer';

/**
 * Staff authentication for the trade desk.
 *
 * A user is "staff" when their Supabase `app_metadata` carries
 * `staff: true`. That flag is set by an admin in `auth.users.raw_app_meta_data`
 * and is copied verbatim into every access token the Auth server issues, so it
 * is signed by Supabase and cannot be forged by the client.
 *
 * The same flag is what the `rfq_inquiries` RLS policy reads
 * (`auth.jwt() -> 'app_metadata' ->> 'staff'`), so the app check and the
 * database check are driven by one source of truth.
 *
 * IMPORTANT: the check reads the **verified** JWT via `getClaims()`, never
 * `getSession().session.user.app_metadata`. A session read out of a cookie is
 * exactly the kind of untrusted input `getClaims()` exists to verify — the
 * auth-js source itself wraps the server-side session user in an
 * "insecure user warning proxy" for exactly this reason.
 */

export interface StaffIdentity {
  /** The user's id (the `sub` claim). */
  id: string;
  /** The user's email, when the token carries one. */
  email: string | null;
}

/**
 * Resolve the signed-in staff member, or `null` when the request is anonymous
 * or the account is not flagged as staff.
 *
 * Returns `null` rather than throwing on a bad token: an expired or tampered
 * session is an ordinary "not signed in" case for a guard, not a server error.
 */
export async function getStaffIdentity(): Promise<StaffIdentity | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) return null;

  const claims = data.claims;
  const appMetadata = (claims as { app_metadata?: { staff?: unknown } })
    .app_metadata;

  if (appMetadata?.staff !== true) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
  };
}

/** True when the request carries a valid staff session. */
export async function isStaff(): Promise<boolean> {
  return (await getStaffIdentity()) !== null;
}
