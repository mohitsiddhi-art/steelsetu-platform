'use client';

import { LifeBuoy } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import PortalStatusBadge from '@/components/portal/PortalStatusBadge';
import { DASHBOARD_COPY } from '@/lib/portalCopy';
import { formatDateTime } from '@/lib/format';
import type { SupportTicket } from '@/types/platform';

/**
 * The "Support Tickets" list.
 *
 * The subject is the heading and the ticket reference sits underneath it —
 * the reference is what support asks for first, so it is present but not
 * competing with the subject for attention.
 */
export default function PortalTicketList({
  tickets,
}: {
  tickets: SupportTicket[];
}) {
  const { t } = usePortalLang();

  return (
    <ul className="grid gap-3">
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          className="rounded-2xl border border-ss-line bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ss-orange/10 text-ss-orange-2"
                aria-hidden="true"
              >
                <LifeBuoy className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0">
                <p className="text-[0.92rem] font-bold leading-snug text-ss-text">
                  {ticket.subject}
                </p>

                <p className="ss-tabular mt-1 text-[0.78rem] text-ss-muted">
                  {t(DASHBOARD_COPY.reference.en, DASHBOARD_COPY.reference.hi)}:{' '}
                  <strong className="text-ss-text">{ticket.ticketRef}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PortalStatusBadge status={ticket.priority} />
              <PortalStatusBadge status={ticket.status} />
            </div>
          </div>

          {ticket.message && (
            <p className="mt-3.5 line-clamp-3 border-t border-ss-line pt-3.5 text-[0.82rem] leading-relaxed text-ss-muted">
              {ticket.message}
            </p>
          )}

          <p className="ss-tabular mt-3 text-[0.72rem] text-ss-muted">
            {t(DASHBOARD_COPY.raisedOn.en, DASHBOARD_COPY.raisedOn.hi)}:{' '}
            {formatDateTime(ticket.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
