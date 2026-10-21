import Link from 'next/link';
import { LogOut, ShieldCheck } from 'lucide-react';
import { signOutAction } from '@/app/actions/auth';
import { getStaffIdentity } from '@/services/authService';

/**
 * The site header.
 *
 * The staff block on the right is only rendered when a valid staff session is
 * present. The check is server-side and reads the *verified* claims, so the
 * link is not merely cosmetic: an anonymous visitor never sees a logout button
 * because there is no session to log out of.
 */
export default async function Navbar() {
  const staff = await getStaffIdentity();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Steelsetu</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/trade-desk" className="hover:text-white transition-colors flex items-center gap-1.5">
            Trade Desk
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {staff ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 border border-emerald-900/70 bg-emerald-950/40 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {staff.email ?? 'Staff'}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-md">
                B2B Trade Portal
              </span>
              <Link
                href="/login"
                className="text-xs px-2.5 py-1 bg-blue-600/90 text-white border border-blue-500 rounded-md hover:bg-blue-500 transition-colors"
              >
                Staff Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
