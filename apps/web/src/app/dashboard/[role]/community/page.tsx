import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';
import { getCommunityGroups } from '@/services/platformService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalCommunity from '@/components/portal/PortalCommunity';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { COMMUNITY_COPY, DASHBOARD_COPY } from '@/lib/portalCopy';
import { getWhatsAppNumber } from '@/lib/whatsapp';

/**
 * `/dashboard/[role]/community` — Community Groups.
 *
 * The groups are public rows, so this page needs no session-bound query —
 * the layout above it has already guaranteed that whoever is here is
 * signed in.
 */
export const instant = false;

export default async function CommunityPage() {
  // This page reads the session cookie (the profile, and the rows RLS scopes
  // to it), so it is request-time by definition. `connection()` also moves the
  // render into Next.js's dynamic stage, where the synchronous clock reads
  // inside the Supabase auth client (JWT expiry checks) are legal rather
  // than an "unstable value" prerender error.
  await connection();

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/user-login?next=/dashboard');
  }

  const groups = await getCommunityGroups();

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="community" />

      <div className="mt-6">
        {groups.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.noResults}
            hint={COMMUNITY_COPY.joinHint}
            actionHref="/products"
            actionLabel={DASHBOARD_COPY.browseCatalogue}
          />
        ) : (
          <PortalCommunity
            groups={groups}
            whatsappNumber={getWhatsAppNumber()}
          />
        )}
      </div>
    </div>
  );
}
