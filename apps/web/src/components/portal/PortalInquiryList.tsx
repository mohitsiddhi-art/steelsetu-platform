'use client';

import { ClipboardList } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import PortalStatusBadge from '@/components/portal/PortalStatusBadge';
import { DASHBOARD_COPY } from '@/lib/portalCopy';
import { formatDateTime, formatTons } from '@/lib/format';
import type { PortalInquiry } from '@/types/platform';

/**
 * The "My Inquiries" list.
 *
 * Each row carries the reference id, because that is the code a buyer reads
 * out over the phone to the desk — it is the one identifier in the row that
 * means something to a human, so it is the most prominent element.
 */
export default function PortalInquiryList({
  inquiries,
}: {
  inquiries: PortalInquiry[];
}) {
  const { t } = usePortalLang();

  return (
    <ul className="grid gap-3">
      {inquiries.map((inquiry) => (
        <li
          key={inquiry.id}
          className="rounded-2xl border border-ss-line bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ss-blue/10 text-ss-blue-deep"
                aria-hidden="true"
              >
                <ClipboardList className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0">
                <p className="text-[0.92rem] font-bold leading-snug text-ss-text">
                  {inquiry.productName ||
                    t(DASHBOARD_COPY.product.en, DASHBOARD_COPY.product.hi)}
                </p>

                <p className="ss-tabular mt-1 text-[0.78rem] text-ss-muted">
                  {t(DASHBOARD_COPY.reference.en, DASHBOARD_COPY.reference.hi)}:{' '}
                  <strong className="text-ss-text">{inquiry.referenceId}</strong>
                </p>
              </div>
            </div>

            <PortalStatusBadge status={inquiry.status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ss-line pt-3.5 sm:grid-cols-4">
            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(DASHBOARD_COPY.quantity.en, DASHBOARD_COPY.quantity.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {inquiry.quantityTons !== undefined
                  ? `${formatTons(inquiry.quantityTons)} MT`
                  : '—'}
              </dd>
            </div>

            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(DASHBOARD_COPY.raisedOn.en, DASHBOARD_COPY.raisedOn.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {formatDateTime(inquiry.createdAt)}
              </dd>
            </div>

            <div className="col-span-2">
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(DASHBOARD_COPY.subject.en, DASHBOARD_COPY.subject.hi)}
              </dt>
              <dd className="mt-0.5 truncate text-[0.84rem] font-semibold text-ss-text">
                {inquiry.message || inquiry.companyName || '—'}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
