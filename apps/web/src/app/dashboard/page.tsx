import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';

/**
 * `/dashboard` — the role router.
 *
 * The spec sends a signed-in user to `/dashboard/buyer` or `/dashboard/seller`
 * depending on the role on their profile. The role is read from
 * `user_profiles`, not from the Auth metadata, because the profile is the
 * authoritative record the RLS policies key off.
 */
export const instant = false;

export default async function DashboardIndexPage() {
  // The router reads the session cookie to learn the account's role, so it
  // is request-time by definition. `connection()` also moves the render into
  // Next.js's dynamic stage, where the synchronous clock reads inside the
  // Supabase auth client (JWT expiry checks) are legal rather than a
  // "unstable value" prerender error.
  await connection();

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/user-login?next=/dashboard');
  }

  redirect(`/dashboard/${profile.role === 'seller' ? 'seller' : 'buyer'}`);
}
