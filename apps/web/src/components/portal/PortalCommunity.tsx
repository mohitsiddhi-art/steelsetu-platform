'use client';

import { Users } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { COMMUNITY_COPY, FORM_COPY } from '@/lib/portalCopy';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { CommunityGroup } from '@/types/platform';

/**
 * The community groups panel.
 *
 * The groups themselves run on WhatsApp — they are trade groups, and a
 * closed Facebook page is not where a fabricator looks for a rate. So the
 * "join" action is a WhatsApp deep link to the desk asking to be added to
 * the next open batch for that trade, exactly as the community copy
 * describes.
 */
export default function PortalCommunity({
  groups,
  whatsappNumber,
}: {
  groups: CommunityGroup[];
  whatsappNumber: string;
}) {
  const { t } = usePortalLang();

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-ss-line bg-white px-5 py-4">
        <p className="text-[0.86rem] leading-relaxed text-ss-muted">
          {t(COMMUNITY_COPY.joinHint.en, COMMUNITY_COPY.joinHint.hi)}
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {groups.map((group) => {
          const accent = group.accentColor || '#2563EB';

          return (
            <li
              key={group.id}
              className="flex h-full flex-col rounded-2xl border border-ss-line bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accent}14`, color: accent }}
                  aria-hidden="true"
                >
                  <Users className="h-4.5 w-4.5" />
                </span>

                <div className="min-w-0">
                  <p className="text-[0.92rem] font-bold leading-snug text-ss-text">
                    {group.name}
                  </p>
                  <p
                    className="mt-1 text-[0.72rem] font-bold uppercase tracking-wider"
                    style={{ color: accent }}
                  >
                    {group.category}
                  </p>
                </div>
              </div>

              {group.description && (
                <p className="mt-3 flex-1 text-[0.82rem] leading-relaxed text-ss-muted">
                  {group.description}
                </p>
              )}

              <p className="ss-tabular mt-4 flex items-center gap-3 text-[0.75rem] text-ss-muted">
                <span>
                  <strong className="text-ss-text">{group.memberCount}</strong>{' '}
                  {t(COMMUNITY_COPY.members.en, COMMUNITY_COPY.members.hi)}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-ss-text">{group.postCount}</strong>{' '}
                  {t(COMMUNITY_COPY.posts.en, COMMUNITY_COPY.posts.hi)}
                </span>
              </p>

              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  `Hi Singhi Enterprises, please add me to the "${group.name}" group (${group.category}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-tap mt-4 inline-flex items-center justify-center rounded-full border border-ss-line bg-white px-4 py-2 text-[0.8rem] font-bold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
              >
                {t(FORM_COPY.join.en, FORM_COPY.join.hi)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
