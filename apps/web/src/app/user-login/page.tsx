import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';
import PortalAuthForm from '@/components/portal/PortalAuthForm';
import { getCurrentProfile } from '@/services/userService';
import { AUTH_COPY, DASHBOARD_COPY } from '@/lib/portalCopy';

/**
 * `/user-login` — the portal sign-in / sign-up page.
 *
 * This is Layer 1 (the cinematic marketing layer): the page is where a
 * contractor first meets the product, so it gets the aurora background and
 * the glass panel rather than the plain white treatment of the product layer.
 *
 * A visitor who is already signed in has no business here — they are sent
 * straight to their dashboard rather than shown a login form.
 */
export const instant = false;

export const metadata: Metadata = {
  title: 'Sign In or Create Your Account | Steelsetu',
  description:
    'Sign in to track steel inquiries, save products, get verified mill quotes and manage your procurement — in English or हिन्दी.',
  alternates: { canonical: '/user-login' },
  openGraph: {
    title: 'Your Steel Procurement Portal | Steelsetu',
    description:
      'Track inquiries, save products and get quotes from verified Indian mills.',
  },
};

export default async function UserLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; intent?: string }>;
}) {
  const params = await searchParams;

  // The page reads the session cookie to decide whether to bounce an
  // already-signed-in visitor to their dashboard, so it is request-time by
  // definition. `connection()` also moves the render into Next.js's dynamic
  // stage, where the synchronous clock reads inside the Supabase auth client
  // (JWT expiry checks) are legal rather than a "unstable value" prerender
  // error.
  await connection();

  // Already signed in? Go straight to the dashboard.
  const profile = await getCurrentProfile();
  if (profile) {
    redirect(`/dashboard/${profile.role === 'seller' ? 'seller' : 'buyer'}`);
  }

  // Only same-site relative paths are honoured, so `?next=` cannot be used
  // to bounce a visitor off to another origin.
  const next =
    params.next && params.next.startsWith('/') && !params.next.startsWith('//')
      ? params.next
      : '/dashboard';

  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink">
      {/* Aurora field — the marketing layer's signature backdrop. */}
      <div className="ss-aurora pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* A second, warmer wash low on the page so the form sits in light. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(48rem 20rem at 50% 100%, rgba(249,115,22,0.28), transparent 70%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            {/* The logo renders its own link to the home page, so it must not
                be wrapped in another one — nesting anchors is invalid HTML
                and breaks hydration. */}
            <SteelsetuLogo tone="dark" />

            <Link
              href="/"
              className="ss-tap inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.82rem] font-semibold text-slate-200 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {DASHBOARD_COPY.backToSite.en}
            </Link>
          </div>
        </header>

        {/* The form */}
        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <p className="ss-eyebrow text-ss-orange">{AUTH_COPY.tagline.en}</p>
              <h1 className="ss-h1 mt-3 text-3xl leading-tight text-white sm:text-4xl">
                {AUTH_COPY.signUpTab.en} &amp; {AUTH_COPY.signInTab.en}
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-[0.92rem] leading-relaxed text-slate-400">
                {AUTH_COPY.subtitle.en}
              </p>
            </div>

            <PortalAuthForm nextPath={next} />

            {/* Staff entry — a different door for a different audience. */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ss-blue">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.85rem] font-semibold text-white">
                    {AUTH_COPY.staffEntry.en}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed text-slate-400">
                    {AUTH_COPY.staffEntryHint.en}
                  </p>
                  <Link
                    href="/login"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-ss-orange transition-colors hover:text-ss-orange-2"
                  >
                    {AUTH_COPY.tradeDesk.en}
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-[0.78rem] text-slate-500">
              {AUTH_COPY.securityNote.en}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
