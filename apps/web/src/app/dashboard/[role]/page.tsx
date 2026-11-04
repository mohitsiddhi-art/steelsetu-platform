import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  getCurrentProfile,
  getInquiries,
  getSavedSearches,
  getSupportTickets,
  getWishlist,
} from '@/services/userService';
import { getMyRfqs } from '@/services/rfqService';
import PortalTileGrid from '@/components/portal/PortalTileGrid';
import PortalOverviewActivity from '@/components/portal/PortalOverviewActivity';
import { DASHBOARD_COPY, OVERVIEW_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]` — the overview.
 *
 * The role segment is the account's role, so a buyer cannot reach a
 * seller's overview by editing the URL: the segment is checked against the
 * profile and a mismatch redirects to the account's own tree.
 *
 * The eight tiles are the spec's post-login dashboard cards, and each one
 * carries its live count so the page is a status board rather than a menu.
 */
export const instant = false;

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = await params;

  // This page reads the session cookie (the profile, and the rows RLS scopes
  // to it), so it is request-time by definition. `connection()` also moves the
  // render into Next.js's dynamic stage, where the synchronous clock reads
  // inside the Supabase auth client (JWT expiry checks) are legal rather
  // than an "unstable value" prerender error.
  await connection();

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/user-login?next=/dashboard');
  }

  const role = profile.role === 'seller' ? 'seller' : 'buyer';

  if (roleParam !== role) {
    redirect(`/dashboard/${role}`);
  }

  // Calculate Display Name dynamically
  const displayName = profile.firstName || profile.company || 'Steel Trader';

  // The four counted sections are read in parallel — they are independent
  // queries and each is a single small row set scoped by RLS.
  const [wishlist, inquiries, tickets, searches, rfqs] = await Promise.all([
    getWishlist(),
    getInquiries(),
    getSupportTickets(),
    getSavedSearches(),
    getMyRfqs(),
  ]);

  const counts = {
    wishlist: wishlist.length,
    inquiries: inquiries.length,
    rfqs: rfqs.length,
    tickets: tickets.length,
    searches: searches.length,
  };

  return (
    <div className="ss-container py-8 sm:py-10">
      {/* Greeting block — the spec's "Hello, [First Name]" headline. */}
      <section className="relative overflow-hidden rounded-3xl border border-ss-line bg-white p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, var(--ss-orange) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full opacity-[0.06]"
          style={{
            background:
              'radial-gradient(circle, var(--ss-blue) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="ss-eyebrow text-ss-orange">{OVERVIEW_COPY.eyebrow.en}</p>
            <h1 className="ss-h2 mt-2 text-[1.75rem] text-ss-text sm:text-[2.1rem]">
              {DASHBOARD_COPY.greeting.en} {displayName}
            </h1>
            <p className="mt-2.5 max-w-xl text-[0.9rem] leading-relaxed text-ss-muted">
              {role === 'seller'
                ? DASHBOARD_COPY.subtitleSeller.en
                : DASHBOARD_COPY.subtitleBuyer.en}
            </p>
          </div>

          {/* Live counts, in a row of four. */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                { label: OVERVIEW_COPY.savedCount.en, value: counts.wishlist },
                { label: OVERVIEW_COPY.inquiryCount.en, value: counts.inquiries },
                { label: OVERVIEW_COPY.rfqCount.en, value: counts.rfqs },
                { label: OVERVIEW_COPY.ticketCount.en, value: counts.tickets },
              ] as const
            ).map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-ss-line bg-ss-light px-4 py-3"
              >
                <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-ss-muted">
                  {stat.label}
                </dt>
                <dd className="ss-tabular mt-1 text-2xl font-extrabold leading-none text-ss-text">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The eight post-login cards. */}
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="ss-h2 text-xl text-ss-text">
              {OVERVIEW_COPY.sections.en}
            </h2>
            <p className="mt-1.5 text-[0.85rem] text-ss-muted">
              {OVERVIEW_COPY.sectionsHint.en}
            </p>
          </div>
          <Link
            href="/products"
            className="ss-tap inline-flex items-center gap-1.5 rounded-full border border-ss-line bg-white px-4 py-2 text-[0.8rem] font-bold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
          >
            {DASHBOARD_COPY.browseCatalogue.en}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5">
          <PortalTileGrid role={role} counts={counts} />
        </div>
      </section>

      {/* The recent-activity feed. */}
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="ss-h2 text-xl text-ss-text">
              {OVERVIEW_COPY.activity.en}
            </h2>
            <p className="mt-1.5 text-[0.85rem] text-ss-muted">
              {OVERVIEW_COPY.activityHint.en}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ss-blue/10 px-3 py-1.5 text-[0.72rem] font-bold text-ss-blue-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {DASHBOARD_COPY.lastUpdated.en}
          </span>
        </div>

        <div className="mt-5">
          <PortalOverviewActivity
            role={role}
            inquiries={inquiries}
            rfqs={rfqs}
            tickets={tickets}
            searches={searches}
          />
        </div>
      </section>
    </div>
  );
}
