'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, Loader2, Trash2 } from 'lucide-react';
import { deleteSavedSearchAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { FORM_COPY } from '@/lib/portalCopy';
import { formatDateTime } from '@/lib/format';
import type { SavedSearch } from '@/types/platform';

/**
 * The saved-searches list.
 *
 * The alert frequency is shown as a bell (or a crossed-out bell) rather
 * than as the raw word, because the question a buyer is actually asking is
 * "will I hear about this?" — the frequency itself is secondary.
 */
export default function PortalSavedSearchList({
  searches,
}: {
  searches: SavedSearch[];
}) {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function remove(searchId: string) {
    setBusyId(searchId);
    startTransition(async () => {
      await deleteSavedSearchAction(searchId);
      setBusyId(null);
      router.refresh();
    });
  }

  return (
    <ul className="grid gap-3">
      {searches.map((search) => {
        const busy = pending && busyId === search.id;
        const alerting = search.alertFrequency !== 'none';
        const terms = search.query?.q;

        return (
          <li
            key={search.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-ss-line bg-white p-4 sm:flex-nowrap sm:p-5"
          >
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                alerting
                  ? 'bg-ss-orange/10 text-ss-orange-2'
                  : 'bg-ss-light text-ss-muted'
              }`}
              aria-hidden="true"
            >
              {alerting ? (
                <Bell className="h-4.5 w-4.5" />
              ) : (
                <BellOff className="h-4.5 w-4.5" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[0.92rem] font-bold leading-snug text-ss-text">
                {search.name}
              </p>

              {typeof terms === 'string' && terms && (
                <p className="ss-tabular mt-1 text-[0.78rem] text-ss-muted">
                  {terms}
                </p>
              )}

              <p className="ss-tabular mt-1.5 text-[0.72rem] text-ss-muted">
                {alerting
                  ? t(
                      search.alertFrequency === 'daily'
                        ? FORM_COPY.daily.en
                        : FORM_COPY.weekly.en,
                      search.alertFrequency === 'daily'
                        ? FORM_COPY.daily.hi
                        : FORM_COPY.weekly.hi
                    )
                  : t(FORM_COPY.noAlert.en, FORM_COPY.noAlert.hi)}{' '}
                · {formatDateTime(search.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => remove(search.id)}
              disabled={busy}
              aria-label={t(FORM_COPY.delete.en, FORM_COPY.delete.hi)}
              className="ss-tap inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ss-line bg-white text-ss-muted transition-colors hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
