'use client';

import { FileText } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import PortalStatusBadge from '@/components/portal/PortalStatusBadge';
import { DASHBOARD_COPY, RFQ_COPY } from '@/lib/portalCopy';
import { formatDateTime, formatTons } from '@/lib/format';
import type { StoredRFQ } from '@/services/rfqService';

/**
 * The "My RFQs" list.
 *
 * These are the requests that reached the Burrabazar trade desk, so the
 * reference is the id the desk quotes back — it is the anchor of the row.
 */
export default function PortalRfqList({ rfqs }: { rfqs: StoredRFQ[] }) {
  const { t } = usePortalLang();

  return (
    <ul className="grid gap-3">
      {rfqs.map((rfq) => (
        <li
          key={rfq.referenceId}
          className="rounded-2xl border border-ss-line bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ss-graphite text-white"
                aria-hidden="true"
              >
                <FileText className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0">
                <p className="text-[0.92rem] font-bold leading-snug text-ss-text">
                  {rfq.productName ||
                    t(RFQ_COPY.productName.en, RFQ_COPY.productName.hi)}
                </p>

                <p className="ss-tabular mt-1 text-[0.78rem] text-ss-muted">
                  {t(RFQ_COPY.reference.en, RFQ_COPY.reference.hi)}:{' '}
                  <strong className="text-ss-text">{rfq.referenceId}</strong>
                </p>
              </div>
            </div>

            <PortalStatusBadge status={rfq.status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ss-line pt-3.5 sm:grid-cols-4">
            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(RFQ_COPY.tons.en, RFQ_COPY.tons.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {formatTons(rfq.tons)} MT
              </dd>
            </div>

            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(RFQ_COPY.pincodeLabel.en, RFQ_COPY.pincodeLabel.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {rfq.pincode || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(RFQ_COPY.gstin.en, RFQ_COPY.gstin.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {rfq.gstNumber || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-[0.66rem] font-bold uppercase tracking-wider text-ss-muted">
                {t(RFQ_COPY.raisedOn.en, RFQ_COPY.raisedOn.hi)}
              </dt>
              <dd className="ss-tabular mt-0.5 text-[0.84rem] font-semibold text-ss-text">
                {formatDateTime(rfq.timestamp)}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
