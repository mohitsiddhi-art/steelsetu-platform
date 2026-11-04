import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';
import { getMyRfqs } from '@/services/rfqService';
import { getProducts } from '@/services/catalogService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalRfqForm from '@/components/portal/PortalRfqForm';
import PortalRfqList from '@/components/portal/PortalRfqList';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { DASHBOARD_COPY, RFQ_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]/rfqs` — My RFQs.
 *
 * A trade-desk RFQ is a different animal from a portal inquiry: it carries
 * a GSTIN and a delivery PIN code, it is validated against the product's
 * minimum order quantity and live stock, and it lands in the same
 * `rfq_inquiries` ledger the trade desk works from.
 */
export const instant = false;

export default async function RfqsPage() {
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

  const [rfqs, products] = await Promise.all([
    getMyRfqs(),
    getProducts(),
  ]);

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="rfqs" />

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="ss-h2 text-lg text-ss-text">{RFQ_COPY.submit.en}</h2>
          <p className="mt-1.5 text-[0.85rem] text-ss-muted">
            {RFQ_COPY.emptyHint.en}
          </p>
        </div>

        <PortalRfqForm products={products} defaultGstin={profile.gstin} />
      </section>

      <section className="mt-8">
        <h2 className="ss-h2 mb-4 text-lg text-ss-text">
          {DASHBOARD_COPY.recentActivity.en}
        </h2>

        {rfqs.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.emptyRfqs}
            hint={RFQ_COPY.emptyHint}
            actionHref="/products"
            actionLabel={DASHBOARD_COPY.browseCatalogue}
          />
        ) : (
          <PortalRfqList rfqs={rfqs} />
        )}
      </section>
    </div>
  );
}
