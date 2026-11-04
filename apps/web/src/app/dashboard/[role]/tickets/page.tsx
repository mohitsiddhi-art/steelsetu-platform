import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile, getSupportTickets } from '@/services/userService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalTicketList from '@/components/portal/PortalTicketList';
import PortalTicketForm from '@/components/portal/PortalTicketForm';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { DASHBOARD_COPY, FORM_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]/tickets` — Support Tickets.
 *
 * Same shape as the inquiries section: the raise form first, the raised
 * tickets underneath.
 */
export const instant = false;

export default async function TicketsPage() {
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

  const tickets = await getSupportTickets();

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="tickets" />

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="ss-h2 text-lg text-ss-text">
            {FORM_COPY.raiseTicket.en}
          </h2>
          <p className="mt-1.5 text-[0.85rem] text-ss-muted">
            {FORM_COPY.raiseTicketHint.en}
          </p>
        </div>

        <PortalTicketForm />
      </section>

      <section className="mt-8">
        <h2 className="ss-h2 mb-4 text-lg text-ss-text">
          {DASHBOARD_COPY.recentActivity.en}
        </h2>

        {tickets.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.emptyTickets}
            hint={FORM_COPY.raiseTicketHint}
          />
        ) : (
          <PortalTicketList tickets={tickets} />
        )}
      </section>
    </div>
  );
}
