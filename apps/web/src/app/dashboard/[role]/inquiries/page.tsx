import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile, getInquiries } from '@/services/userService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalInquiryList from '@/components/portal/PortalInquiryList';
import PortalInquiryForm from '@/components/portal/PortalInquiryForm';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { DASHBOARD_COPY, FORM_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]/inquiries` — My Inquiries.
 *
 * The form stays on the page above the list, because the whole point of
 * this section is to raise a quote request and then watch it move. The
 * list is empty on a first visit, and an empty list next to a form reads
 * as "start here" rather than as a dead end.
 */
export const instant = false;

export default async function InquiriesPage() {
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

  const inquiries = await getInquiries();

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="inquiries" />

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="ss-h2 text-lg text-ss-text">
            {FORM_COPY.raiseInquiry.en}
          </h2>
          <p className="mt-1.5 text-[0.85rem] text-ss-muted">
            {FORM_COPY.raiseInquiryHint.en}
          </p>
        </div>

        <PortalInquiryForm
          defaultName={profile.firstName}
          defaultCompany={profile.company}
          defaultPhone={profile.phone}
          defaultEmail={profile.email}
        />
      </section>

      <section className="mt-8">
        <h2 className="ss-h2 mb-4 text-lg text-ss-text">
          {DASHBOARD_COPY.recentActivity.en}
        </h2>

        {inquiries.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.emptyInquiries}
            hint={FORM_COPY.raiseInquiryHint}
            actionHref="/products"
            actionLabel={DASHBOARD_COPY.browseCatalogue}
          />
        ) : (
          <PortalInquiryList inquiries={inquiries} />
        )}
      </section>
    </div>
  );
}
