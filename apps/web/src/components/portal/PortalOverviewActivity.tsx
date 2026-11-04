'use client';

import Link from 'next/link';
import {
  Bookmark,
  ClipboardList,
  FileText,
  LifeBuoy,
  Search,
} from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import PortalStatusBadge from '@/components/portal/PortalStatusBadge';
import { DASHBOARD_COPY, OVERVIEW_COPY, dashboardHref } from '@/lib/portalCopy';
import { formatTons } from '@/lib/format';
import type { PortalInquiry, SavedSearch, SupportTicket } from '@/types/platform';
import type { StoredRFQ } from '@/services/rfqService';
import type { DashboardSection } from '@/types/platform';

/**
 * The recent-activity feed on the overview.
 *
 * Everything the buyer has raised — inquiries, RFQs, tickets and saved
 * searches — is merged into one timeline, newest first, so the overview
 * answers "what has the desk done for me lately?" in a single glance rather
 * than making the user open four sections to find out.
 *
 * The dates are rendered with the browser's locale formatter, so a Hindi
 * reader gets Devanagari month names without a second date library.
 */

interface ActivityEntry {
  id: string;
  at: string;
  section: DashboardSection;
  icon: typeof Bookmark;
  title: string;
  meta: string;
  status?: string;
  href: string;
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function PortalOverviewActivity({
  role,
  inquiries,
  rfqs,
  tickets,
  searches,
}: {
  role: 'buyer' | 'seller';
  inquiries: PortalInquiry[];
  rfqs: StoredRFQ[];
  tickets: SupportTicket[];
  searches: SavedSearch[];
}) {
  const { t } = usePortalLang();

  const entries: ActivityEntry[] = [
    ...inquiries.map((inquiry) => ({
      id: inquiry.id,
      at: inquiry.createdAt,
      section: 'inquiries' as const,
      icon: ClipboardList,
      title:
        inquiry.productName ||
        inquiry.companyName ||
        DASHBOARD_COPY.product.en,
      meta: `${inquiry.referenceId}${
        inquiry.quantityTons
          ? ` · ${formatTons(inquiry.quantityTons)} MT`
          : ''
      }`,
      status: inquiry.status,
      href: dashboardHref(role, 'inquiries'),
    })),
    ...rfqs.map((rfq) => ({
      id: rfq.referenceId,
      at: rfq.timestamp,
      section: 'rfqs' as const,
      icon: FileText,
      title: rfq.productName || RFQ_TITLE_FALLBACK,
      meta: `${rfq.referenceId} · ${formatTons(rfq.tons)} MT`,
      status: rfq.status,
      href: dashboardHref(role, 'rfqs'),
    })),
    ...tickets.map((ticket) => ({
      id: ticket.id,
      at: ticket.createdAt,
      section: 'tickets' as const,
      icon: LifeBuoy,
      title: ticket.subject,
      meta: ticket.ticketRef,
      status: ticket.status,
      href: dashboardHref(role, 'tickets'),
    })),
    ...searches.map((search) => ({
      id: search.id,
      at: search.createdAt,
      section: 'searches' as const,
      icon: Search,
      title: search.name,
      meta: search.alertFrequency,
      href: dashboardHref(role, 'searches'),
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ss-line bg-white px-6 py-12 text-center">
        <p className="text-[0.9rem] font-bold text-ss-text">
          {DASHBOARD_COPY.noResults.en}
        </p>
        <p className="mx-auto mt-1.5 max-w-md text-[0.84rem] leading-relaxed text-ss-muted">
          {OVERVIEW_COPY.noActivity.en}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href={dashboardHref(role, 'inquiries')}
            className="ss-tap inline-flex items-center rounded-full bg-ss-orange px-5 py-2.5 text-[0.82rem] font-bold text-white transition-colors hover:bg-ss-orange-2"
          >
            {DASHBOARD_COPY.postRequirement.en}
          </Link>
          <Link
            href="/products"
            className="ss-tap inline-flex items-center rounded-full border border-ss-line bg-white px-5 py-2.5 text-[0.82rem] font-bold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
          >
            {DASHBOARD_COPY.browseCatalogue.en}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ol className="overflow-hidden rounded-2xl border border-ss-line bg-white">
      {entries.slice(0, 12).map((entry) => {
        const Icon = entry.icon;

        return (
          <li key={`${entry.section}-${entry.id}`}>
            <Link
              href={entry.href}
              className="flex items-center gap-3 border-b border-ss-line px-4 py-3.5 transition-colors last:border-b-0 hover:bg-ss-light sm:px-5"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ss-light text-ss-blue">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.88rem] font-bold text-ss-text">
                  {entry.title}
                </p>
                <p className="ss-tabular mt-0.5 truncate text-[0.74rem] text-ss-muted">
                  {entry.meta}
                </p>
              </div>

              {entry.status && (
                <span className="hidden sm:inline-flex">
                  <PortalStatusBadge status={entry.status} />
                </span>
              )}

              <time
                dateTime={entry.at}
                className="ss-tabular hidden shrink-0 text-right text-[0.72rem] text-ss-muted md:block"
              >
                {formatWhen(entry.at)}
              </time>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

const RFQ_TITLE_FALLBACK = 'Steel requirement';
