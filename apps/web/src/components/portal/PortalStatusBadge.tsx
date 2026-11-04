'use client';

import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { STATUS_COPY, StatusKey } from '@/lib/portalCopy';

/**
 * A status pill.
 *
 * The colour is derived from the status key rather than passed in, so the
 * same status always looks the same across the portal — a buyer should not
 * have to learn a second colour code on the RFQ page.
 */

const TONES: Record<StatusKey, string> = {
  // Inquiries
  submitted: 'bg-ss-blue/10 text-ss-blue-deep border-ss-blue/25',
  quoted: 'bg-ss-orange/10 text-ss-orange-2 border-ss-orange/30',
  closed: 'bg-ss-muted/10 text-ss-muted border-ss-muted/25',
  // Tickets
  open: 'bg-ss-blue/10 text-ss-blue-deep border-ss-blue/25',
  in_progress: 'bg-ss-orange/10 text-ss-orange-2 border-ss-orange/30',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  // RFQs
  PENDING: 'bg-ss-orange/10 text-ss-orange-2 border-ss-orange/30',
  ALLOCATED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  // Priority
  low: 'bg-ss-muted/10 text-ss-muted border-ss-muted/25',
  normal: 'bg-ss-blue/10 text-ss-blue-deep border-ss-blue/25',
  high: 'bg-ss-orange/10 text-ss-orange-2 border-ss-orange/30',
  urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  // Ticket categories
  general: 'bg-ss-muted/10 text-ss-muted border-ss-muted/25',
  order: 'bg-ss-blue/10 text-ss-blue-deep border-ss-blue/25',
  logistics: 'bg-ss-muted/10 text-ss-muted border-ss-muted/25',
  quality: 'bg-ss-orange/10 text-ss-orange-2 border-ss-orange/30',
  billing: 'bg-ss-muted/10 text-ss-muted border-ss-muted/25',
  technical: 'bg-ss-blue/10 text-ss-blue-deep border-ss-blue/25',
};

export default function PortalStatusBadge({ status }: { status: string }) {
  const { t } = usePortalLang();

  const key = (status in STATUS_COPY ? status : 'submitted') as StatusKey;
  const copy = STATUS_COPY[key];

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide ${
        TONES[key] ?? TONES.submitted
      }`}
    >
      {t(copy.en, copy.hi)}
    </span>
  );
}
