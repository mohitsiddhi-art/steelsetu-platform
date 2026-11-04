import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';

/**
 * The role-scoped shell for the dashboard tree.
 *
 * The `[role]` segment is part of the URL, which means it can be edited by
 * anyone. This layout checks it against the signed-in account's real role
 * and bounces a mismatch back to the account's own tree — a buyer cannot
 * reach a seller's workspace by typing the URL, and vice versa.
 *
 * The check lives in a layout rather than in each of the eight pages so
 * that a new section cannot forget it.
 */
export const instant = false;

export default async function DashboardRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = await params;

  // The role segment is compared against a session-bound profile, so this
  // subtree is request-time by definition. `connection()` also moves the
  // render into Next.js's dynamic stage, where the synchronous clock reads
  // inside the Supabase auth client (JWT expiry checks) are legal rather
  // than a "unstable value" prerender error.
  await connection();

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/user-login?next=/dashboard');
  }

  const role = profile.role === 'seller' ? 'seller' : 'buyer';

  if (roleParam !== role) {
    redirect(`/dashboard/${role}`);
  }

  return <>{children}</>;
}
