import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalProfileForm from '@/components/portal/PortalProfileForm';
import { DASHBOARD_COPY, FORM_COPY } from '@/lib/portalCopy';

/**
 * `/dashboard/[role]/settings` — Profile Settings.
 *
 * These details travel with every inquiry, so the form is prefilled from
 * the stored profile and the GSTIN is upper-cased on save.
 */
export const instant = false;

export default async function SettingsPage() {
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

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="settings" />

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="ss-h2 text-lg text-ss-text">
            {FORM_COPY.profileHeading.en}
          </h2>
          <p className="mt-1.5 max-w-2xl text-[0.85rem] leading-relaxed text-ss-muted">
            {FORM_COPY.profileHint.en}
          </p>
        </div>

        <PortalProfileForm profile={profile} />
      </section>

      <section className="mt-8 rounded-2xl border border-ss-line bg-white p-5 sm:p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-ss-muted">
              {DASHBOARD_COPY.profileDetails.en}
            </dt>
            <dd className="mt-1 text-[0.88rem] font-semibold text-ss-text">
              {profile.email ?? '—'}
            </dd>
          </div>

          <div>
            <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-ss-muted">
              {DASHBOARD_COPY.memberSince.en}
            </dt>
            <dd className="ss-tabular mt-1 text-[0.88rem] font-semibold text-ss-text">
              {profile.createdAt.slice(0, 10)}
            </dd>
          </div>

          <div>
            <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-ss-muted">
              {DASHBOARD_COPY.status.en}
            </dt>
            <dd className="mt-1 text-[0.88rem] font-semibold text-ss-text">
              {profile.role === 'seller'
                ? DASHBOARD_COPY.sellerRole.en
                : DASHBOARD_COPY.buyerRole.en}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
