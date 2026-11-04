import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { ShieldCheck } from 'lucide-react';
import LoginForm from './LoginForm';
import { getStaffIdentity } from '@/services/authService';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';

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

  // The page reads the session cookie to check whether the visitor is already
  // signed in, so it is request-time by definition. `connection()` also moves
  // the render into Next.js's dynamic stage, where the synchronous clock
  // reads inside the Supabase auth client (JWT expiry checks) are legal
  // rather than a "unstable value" prerender error.
  await connection();

  // An already-signed-in staff member has no business on the login page.
  const staff = await getStaffIdentity();
  if (staff) {
    redirect(nextPath);
  }

  return (
    <div className="relative min-h-screen bg-ss-ink text-slate-100 flex flex-col">
      <div className="ss-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(48rem 20rem at 50% 100%, rgba(249,115,22,0.22), transparent 70%)',
        }}
      />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <SteelsetuLogo tone="dark" size={56} />
            <h1 className="text-2xl font-bold text-white mt-4 font-display">Steelsetu Trade Desk</h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authorized Staff &amp; Administrator Login
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <LoginForm nextPath={nextPath} />
          </div>

          <p className="text-center text-xs text-slate-500 mt-6 font-mono">
            Access is restricted to authorized Singhi Enterprises personnel.{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors underline">
              Back to catalogue
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
