'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Bookmark,
  ClipboardList,
  FileText,
  LifeBuoy,
  MessageCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { DASHBOARD_CARDS, dashboardHref } from '@/lib/portalCopy';
import type { DashboardSection } from '@/types/platform';

/**
 * The eight post-login dashboard cards.
 *
 * The spec calls for exactly eight tiles after sign-in, and each one has to
 * be a real destination — a card that goes nowhere is worse than no card at
 * all. The links are derived from the role via `dashboardHref`, so a buyer
 * and a seller never land on each other's workflows.
 *
 * The tile count is shown on the card itself, because a card that says
 * "Saved Products" but cannot say how many are saved is only half a card.
 */

const SECTION_ICONS: Record<DashboardSection, typeof Bookmark> = {
  wishlist: Bookmark,
  inquiries: ClipboardList,
  rfqs: FileText,
  chat: MessageCircle,
  community: Users,
  tickets: LifeBuoy,
  searches: Search,
  settings: Settings,
};

export default function PortalTileGrid({
  role,
  counts,
}: {
  role: 'buyer' | 'seller';
  counts?: Partial<Record<DashboardSection, number>>;
}) {
  const { t } = usePortalLang();

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_CARDS.map((card) => {
        const Icon = SECTION_ICONS[card.key];
        const count = counts?.[card.key];
        const href = dashboardHref(role, card.key);

        return (
          <li key={card.key}>
            <Link
              href={href}
              className="ss-card-light group flex h-full flex-col p-5 focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${card.accent}14`,
                    color: card.accent,
                  }}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>

                {count !== undefined && (
                  <span className="ss-tabular rounded-full bg-ss-light px-2.5 py-1 text-[0.72rem] font-bold text-ss-text">
                    {count}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-[0.95rem] font-bold leading-snug text-ss-text">
                {t(card.title, card.titleHi)}
              </h3>

              <p className="mt-1.5 flex-1 text-[0.8rem] leading-relaxed text-ss-muted">
                {t(card.description, card.descriptionHi)}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-[0.76rem] font-bold text-ss-blue transition-colors group-hover:text-ss-blue-deep">
                {t('Open', 'खोलें')}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
