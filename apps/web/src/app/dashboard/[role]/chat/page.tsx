import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/services/userService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalChat from '@/components/portal/PortalChat';
import { getWhatsAppNumber } from '@/lib/whatsapp';

/**
 * `/dashboard/[role]/chat` — Chat.
 *
 * The trade desk is a WhatsApp line, so this section is a set of deep
 * links into it rather than a chat widget. The number is resolved on the
 * server from the environment, so it is never baked into the client bundle
 * and can be changed without a rebuild.
 */
export const instant = false;

export default async function ChatPage() {
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
      <PortalSectionHeader section="chat" />

      <div className="mt-6">
        <PortalChat
          whatsappNumber={getWhatsAppNumber()}
          contactName={profile.firstName}
          city={profile.city}
        />
      </div>
    </div>
  );
}
