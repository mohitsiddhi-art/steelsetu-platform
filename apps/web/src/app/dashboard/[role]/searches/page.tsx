import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile, getSavedSearches } from '@/services/userService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalSavedSearchList from '@/components/portal/PortalSavedSearchList';
import PortalSavedSearchForm from '@/components/portal/PortalSavedSearchForm';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { DASHBOARD_COPY, FORM_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]/searches` — Saved Searches & Alerts.
 *
 * The form sits above the list so the two read as one workflow: name a
 * search, set how often you want to hear about it, and watch the list.
 */
export const instant = false;

export default async function SearchesPage() {
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

  const searches = await getSavedSearches();

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="searches" />

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="ss-h2 text-lg text-ss-text">
            {FORM_COPY.saveSearch.en}
          </h2>
          <p className="mt-1.5 text-[0.85rem] text-ss-muted">
            {FORM_COPY.saveSearchHint.en}
          </p>
        </div>

        <PortalSavedSearchForm />
      </section>

      <section className="mt-8">
        <h2 className="ss-h2 mb-4 text-lg text-ss-text">
          {DASHBOARD_COPY.saved.en}
        </h2>

        {searches.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.emptySearches}
            hint={FORM_COPY.saveSearchHint}
            actionHref="/products"
            actionLabel={DASHBOARD_COPY.browseCatalogue}
          />
        ) : (
          <PortalSavedSearchList searches={searches} />
        )}
      </section>
    </div>
  );
}
