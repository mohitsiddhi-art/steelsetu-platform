'use client';

import Link from 'next/link';
import { ArrowLeft, Globe, LogOut, UserRound, Building2 } from 'lucide-react';
import { portalSignOutAction } from '@/app/actions/portalAuth';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { DASHBOARD_COPY, OVERVIEW_COPY } from '@/lib/portalCopy';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';

/**
 * The portal's top bar.
 *
 * This is Layer 2 (the clean product layer), so the treatment is white and
 * flat — no glass, no aurora, no 3D. The brand mark is rendered un-animated
 * because a rotating emblem in a work surface is noise.
 *
 * The greeting is the spec's "Hello, [First Name]" — it is the single most
 * prominent element on the page, sitting next to the Logout button so the
 * two ends of the session are in the same line of sight.
 */
export default function PortalHeader({
  firstName,
  role,
}: {
  firstName: string;
  role: 'buyer' | 'seller';
}) {
  const { lang, setLang, t } = usePortalLang();

  return (
    <header className="sticky top-0 z-40 border-b border-ss-line bg-white/90 backdrop-blur-md">
      <div className="ss-container">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
          {/* Brand + back link */}
          <div className="flex min-w-0 items-center gap-3">
            {/* The logo renders its own link to the home page, so it must not
                be wrapped in another one — nesting anchors is invalid HTML
                and breaks hydration. */}
            <SteelsetuLogo tone="light" animated={false} compact size={34} className="shrink-0" />
            <span className="hidden h-6 w-px bg-ss-line sm:block" aria-hidden="true" />
            <Link
              href="/"
              className="ss-tap hidden items-center gap-1.5 text-[0.78rem] font-semibold text-ss-muted transition-colors hover:text-ss-blue sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t(DASHBOARD_COPY.backToSite.en, DASHBOARD_COPY.backToSite.hi)}
            </Link>
            <Link
              href="/trade-desk"
              className="ss-tap inline-flex items-center gap-1.5 rounded-lg border border-ss-orange/50 bg-ss-orange/10 px-3 py-1.5 text-[0.78rem] font-bold text-ss-orange transition-colors hover:bg-ss-orange/20"
            >
              <Building2 className="h-3.5 w-3.5" />
              Merchant Trade Desk &rarr;
            </Link>
          </div>

          {/* Greeting + role chip + actions */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-[0.92rem] font-bold leading-tight text-ss-text sm:text-[1.05rem]">
                {t(DASHBOARD_COPY.greeting.en, DASHBOARD_COPY.greeting.hi)}{' '}
                {firstName}
              </p>
              <p className="mt-0.5 hidden items-center justify-end gap-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ss-muted sm:flex">
                <UserRound className="h-3 w-3" aria-hidden="true" />
                {role === 'seller'
                  ? t(DASHBOARD_COPY.sellerRole.en, DASHBOARD_COPY.sellerRole.hi)
                  : t(DASHBOARD_COPY.buyerRole.en, DASHBOARD_COPY.buyerRole.hi)}
              </p>
            </div>

            {/* Language toggle — the portal's own, so it stays in the light layer. */}
            <div
              className="inline-flex items-center rounded-full border border-ss-line bg-ss-light p-0.5 text-[0.7rem] font-semibold"
              role="group"
              aria-label="Language / भाषा"
            >
              <Globe className="mx-1.5 h-3.5 w-3.5 text-ss-muted" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  lang === 'en'
                    ? 'bg-ss-blue text-white'
                    : 'text-ss-muted hover:text-ss-text'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                aria-pressed={lang === 'hi'}
                style={{ fontFamily: 'var(--ss-deva)' }}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  lang === 'hi'
                    ? 'bg-ss-blue text-white'
                    : 'text-ss-muted hover:text-ss-text'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Logout — a real form so the server action runs with the session. */}
            <form action={portalSignOutAction}>
              <button
                type="submit"
                className="ss-tap inline-flex items-center gap-1.5 rounded-full border border-ss-line bg-white px-3 py-2 text-[0.78rem] font-semibold text-ss-text transition-colors hover:border-ss-orange hover:text-ss-orange-2 sm:px-4"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {t(DASHBOARD_COPY.logout.en, DASHBOARD_COPY.logout.hi)}
                </span>
                <span className="sm:hidden">
                  {t(DASHBOARD_COPY.logout.en, DASHBOARD_COPY.logout.hi)}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* The role tagline sits under the bar on wide screens, where there is room. */}
      <p className="sr-only">
        {role === 'seller'
          ? OVERVIEW_COPY.sellerTitle.en
          : OVERVIEW_COPY.buyerTitle.en}
      </p>
    </header>
  );
}
