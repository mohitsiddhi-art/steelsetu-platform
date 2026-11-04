import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';
import { PortalLangProvider } from '@/components/portal/PortalLangProvider';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';

/**
 * The portal shell.
 *
 * This is Layer 2 — the clean product layer. The whole tree is white and
 * flat: no aurora, no 3D, no custom cursor. The `data-layer="product"`
 * attribute is what flips the page to the light treatment, because the
 * root layout is shared with the cinematic marketing pages.
 *
 * The shell is a server component so the profile — and therefore the
 * greeting — is rendered on the server. The language is passed down into
 * the client provider, which lets the visitor flip it in place without a
 * round-trip.
 */

export const instant = false;

export const metadata: Metadata = {
  title: {
    default: 'Your Dashboard | Steelsetu',
    template: '%s | Steelsetu Dashboard',
  },
  description:
    'Your SteelSetu portal — track inquiries and RFQs, manage saved products and search alerts, and talk to the Burrabazar trade desk.',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The dashboard is inherently request-time: the profile behind it comes
  // from a session cookie. `connection()` says so explicitly, which also
  // moves the render into Next.js's dynamic stage — where the synchronous
  // clock reads inside the Supabase auth client (JWT expiry checks, JWKS
  // caching) are legal rather than a "unstable value" prerender error.
  await connection();

  // The proxy already guards this tree, but the guard is duplicated here so
  // the shell fails closed even if the matcher is ever widened.
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/user-login?next=/dashboard');
  }

  const role = profile.role === 'seller' ? 'seller' : 'buyer';

  return (
    <div data-layer="product" className="flex min-h-screen flex-col bg-ss-light">
      <PortalLangProvider initialLang={profile.locale === 'hi' ? 'hi' : 'en'}>
        <PortalHeader firstName={profile.firstName} role={role} />
        <PortalNav role={role} />
        <main className="flex-1">{children}</main>
      </PortalLangProvider>
    </div>
  );
}
