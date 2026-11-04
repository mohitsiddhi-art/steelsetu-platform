import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentProfile, getWishlist } from '@/services/userService';
import { getProducts } from '@/services/catalogService';
import PortalSectionHeader from '@/components/portal/PortalSectionHeader';
import PortalWishlistList from '@/components/portal/PortalWishlistList';
import PortalEmptyState from '@/components/portal/PortalEmptyState';
import { DASHBOARD_COPY, WISHLIST_COPY } from '@/lib/portalCopy';
import type { SteelProduct } from '@/types/steel';

/**
 * `/dashboard/[role]/wishlist` — Saved Products.
 *
 * The wishlist stores product ids only, so the catalogue is read once here
 * and the matching products are handed down as a map. That way the rate and
 * the stock shown are the live ones, not a snapshot from the day the product
 * was saved.
 */
export const instant = false;

export default async function WishlistPage() {
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

  const [items, products] = await Promise.all([
    getWishlist(),
    getProducts(),
  ]);

  const byId: Record<string, SteelProduct> = {};
  for (const product of products) {
    byId[product.id] = product;
  }

  return (
    <div className="ss-container py-8 sm:py-10">
      <PortalSectionHeader section="wishlist" />

      <div className="mt-6">
        {items.length === 0 ? (
          <PortalEmptyState
            title={DASHBOARD_COPY.emptyWishlist}
            hint={WISHLIST_COPY.emptyHint}
            actionHref="/products"
            actionLabel={DASHBOARD_COPY.browseCatalogue}
          />
        ) : (
          <PortalWishlistList items={items} products={byId} />
        )}
      </div>
    </div>
  );
}
