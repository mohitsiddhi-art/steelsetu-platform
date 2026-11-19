'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert, Loader2 } from 'lucide-react';

/**
 * Admin/staff ERP sign-in.
 *
 * Credentials are checked on the server against environment variables — this
 * page carries no demo logins and no passwords. A successful POST sets a
 * signed HttpOnly session cookie, and we send the browser back to where they
 * were headed (the `next` query param the guard remembers), defaulting to
 * the portal for the role.
 */

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const next = new URLSearchParams(window.location.search).get('next');

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => null)) as {
          role?: 'admin' | 'staff';
        } | null;

        // If they were redirected from a specific portal page, go back there;
        // otherwise land on the top of that role's portal.
        const destination =
          next && next.startsWith('/')
            ? next
            : data?.role === 'staff'
              ? '/staff'
              : '/admin';

        window.location.assign(destination);
        return;
      }

      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(body?.error ?? 'Sign-in failed. Please try again.');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldAlert className="text-ss-orange" /> Admin/ERP Login
        </h1>

        {error && (
          <div className="bg-red-950 border border-red-800 p-4 rounded-xl mb-6 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-500 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
