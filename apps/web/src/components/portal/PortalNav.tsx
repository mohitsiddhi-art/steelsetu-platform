'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
import { dashboardHref, SECTION_COPY } from '@/lib/portalCopy';
import type { DashboardSection } from '@/types/platform';

/**
 * The portal's section switcher.
 *
 * The eight sections are the same for a buyer and a seller, but they live
 * under different route trees, so the hrefs are derived from the role
 * rather than hard-coded. The active section is marked with
 * `aria-current="page"` — a colour change alone would not tell a screen
 * reader where they are.
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

const SECTION_ORDER: DashboardSection[] = [
  'wishlist',
  'inquiries',
  'rfqs',
  'chat',
  'community',
  'tickets',
  'searches',
  'settings',
];

export default function PortalNav({ role }: { role: 'buyer' | 'seller' }) {
  const pathname = usePathname();
  const { t } = usePortalLang();

  return (
    <nav aria-label="Dashboard sections" className="border-b border-ss-line bg-white">
      <div className="ss-container">
        <ul className="ss-no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2">
          {SECTION_ORDER.map((section) => {
            const href = dashboardHref(role, section);
            const active =
              pathname === href || pathname?.startsWith(`${href}/`);

            const Icon = SECTION_ICONS[section];
            const copy = SECTION_COPY[section];

            return (
              <li key={section} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`ss-tap inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-[0.8rem] font-semibold transition-colors ${
                    active
                      ? 'bg-ss-blue text-white'
                      : 'text-ss-muted hover:bg-ss-light hover:text-ss-text'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {t(copy.title.en, copy.title.hi)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
