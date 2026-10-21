import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import LoginForm from './LoginForm';
import { getStaffIdentity } from '@/services/authService';

/**
 * Staff sign-in.
 *
 * The page reads the session cookie, so it must not be prerendered at build
 * time.
 */
export const instant = false;

/**
 * Work out where to send the user after a successful sign-in.
 *
 * Only same-origin absolute paths are accepted. An attacker who can get a
 * staff member to click a crafted `/login?next=https://evil.example` link
 * would otherwise turn the login page into an open redirect that carries the
 * freshly minted session to a host of their choosing.
 */
function safeNextPath(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const path = typeof raw === 'string' ? raw : '';

  if (!path.startsWith('/')) return '/trade-desk';
  // `//evil.example` is protocol-relative, not a local path.
  if (path.startsWith('//')) return '/trade-desk';
  // A backslash is normalised to a forward slash by browsers.
  if (path.includes('\\')) return '/trade-desk';

  return path;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params?.next);

  // An already-signed-in staff member has no business on the login page.
  const staff = await getStaffIdentity();
  if (staff) {
    redirect(nextPath);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider text-lg">
              S
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">Steelsetu</h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Staff access to the trade desk
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl">
            <LoginForm nextPath={nextPath} />
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Access is restricted to authorised SteelSetu staff.{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Back to catalogue
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
