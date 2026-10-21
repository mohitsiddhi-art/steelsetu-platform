'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

/**
 * The staff sign-in form.
 *
 * `signInWithPassword` posts the credentials to the Supabase Auth server and,
 * on success, the browser client persists the session into the shared session
 * cookie. The server-side guard and the page guard both read that cookie, so
 * a successful sign-in here is what makes `/trade-desk` reachable.
 *
 * The staff check after sign-in uses `getClaims()`, which verifies the access
 * token's signature and returns the signed claims — the same check the server
 * makes. It is used here only to give a clear message; the server remains the
 * authority, and an account without the flag gets bounced straight back out.
 */
export default function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    setError(null);
    setBusy(true);

    try {
      const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message === 'Invalid login credentials'
            ? 'Invalid email or password.'
            : signInError.message
        );
        setBusy(false);
        return;
      }

      // Confirm the account actually carries the staff flag before sending
      // the user on. If the token cannot be verified we let the server decide
      // rather than blocking a legitimate sign-in.
      const { data, error: claimsError } = await supabaseBrowser.auth.getClaims();

      if (!claimsError && data?.claims) {
        const appMetadata = (
          data.claims as { app_metadata?: { staff?: unknown } }
        ).app_metadata;

        if (appMetadata?.staff !== true) {
          await supabaseBrowser.auth.signOut();
          setError(
            'This account is not authorised for the trade desk. Please contact the administrator.'
          );
          setBusy(false);
          return;
        }
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError('Something went wrong while signing in. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-900/70 bg-red-950/40 px-3.5 py-3 text-sm text-red-300"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
        >
          Work Email
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="staff@steelsetu.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? 'Signing in…' : 'Sign in to Trade Desk'}
      </button>
    </form>
  );
}
