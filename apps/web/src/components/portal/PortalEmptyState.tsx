'use client';

import Link from 'next/link';
import { Inbox } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';

/** A bilingual string pair. */
export interface PortalCopy {
  en: string;
  hi: string;
}

/**
 * The empty state for a dashboard section.
 *
 * An empty list is not an error, and it should not look like one — the
 * tone is a plain explanation plus the one action that fills the section.
 *
 * The copy arrives as a bilingual pair rather than a string because the
 * section pages are server components that render English, while the
 * language toggle lives in a client context. Handing the pair down lets the
 * empty state re-render in हिन्दी without a round-trip.
 */
export default function PortalEmptyState({
  title,
  hint,
  actionHref,
  actionLabel,
}: {
  title: PortalCopy;
  hint?: PortalCopy;
  actionHref?: string;
  actionLabel?: PortalCopy;
}) {
  const { t } = usePortalLang();

  return (
    <div className="rounded-2xl border border-dashed border-ss-line bg-white px-6 py-14 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-ss-light text-ss-muted">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-[0.95rem] font-bold text-ss-text">
        {t(title.en, title.hi)}
      </p>
      {hint && (
        <p className="mx-auto mt-1.5 max-w-sm text-[0.85rem] leading-relaxed text-ss-muted">
          {t(hint.en, hint.hi)}
        </p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="ss-tap mt-5 inline-flex items-center rounded-full bg-ss-orange px-5 py-2.5 text-[0.82rem] font-bold text-white transition-colors hover:bg-ss-orange-2"
        >
          {t(actionLabel.en, actionLabel.hi)}
        </Link>
      )}
    </div>
  );
}
