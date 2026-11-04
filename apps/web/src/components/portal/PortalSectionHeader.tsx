'use client';

import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { SECTION_COPY } from '@/lib/portalCopy';
import type { DashboardSection } from '@/types/platform';

/**
 * The heading block that opens every dashboard section.
 *
 * The title and description come from `SECTION_COPY` so the eight sections
 * read consistently, and the description is what tells a first-time user
 * what the section is actually for.
 */
export default function PortalSectionHeader({
  section,
  children,
}: {
  section: DashboardSection;
  children?: React.ReactNode;
}) {
  const { t } = usePortalLang();
  const copy = SECTION_COPY[section];

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="ss-h2 text-2xl text-ss-text sm:text-[1.75rem]">
          {t(copy.title.en, copy.title.hi)}
        </h1>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-ss-muted">
          {t(copy.description.en, copy.description.hi)}
        </p>
      </div>
      {children}
    </div>
  );
}
