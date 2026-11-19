import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/adminSession';

export type AdminRole = 'admin' | 'staff';

/**
 * Server-side second lock for the ERP portals.
 *
 * The proxy is the first gate; this re-verifies the signed session cookie on
 * the server and fails closed by redirecting to the login page. The
 * duplication is deliberate: a proxy matcher typo or a later edit to
 * `proxy.ts` would otherwise be enough to bypass the guard, so the page itself
 * refuses to render to an unauthenticated visitor.
 *
 * Call it at the top of the page component (a server component). It returns
 * the verified role, or throws a redirect.
 */
export async function requireAdminRole(roles: AdminRole[]): Promise<AdminRole> {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;
  const role = verifyAdminSession(value);

  if (role && roles.includes(role)) return role;

  redirect('/admin/login');
}
