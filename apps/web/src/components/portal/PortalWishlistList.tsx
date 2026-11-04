'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import { removeFromWishlistAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { FORM_COPY, WISHLIST_COPY } from '@/lib/portalCopy';
import { formatDateTime, formatInr, formatTons } from '@/lib/format';
import type { SteelProduct } from '@/types/steel';
import type { WishlistItem } from '@/types/platform';

/**
 * The saved-products list.
 *
 * The wishlist stores only product ids, so the products themselves are
 * resolved server-side and handed down as props. That keeps the rate and
 * stock figures current with the catalogue without the client having to
 * make a second round-trip.
 */
export default function PortalWishlistList({
  items,
  products,
}: {
  items: WishlistItem[];
  products: Record<string, SteelProduct>;
}) {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function remove(productId: string) {
    setBusyId(productId);
    startTransition(async () => {
      await removeFromWishlistAction(productId);
      setBusyId(null);
      router.refresh();
    });
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => {
        const product = products[item.productId];
        const busy = pending && busyId === item.productId;

        return (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-ss-line bg-white p-4 sm:flex-nowrap sm:p-5"
          >
            {/* Spec block */}
            <div className="min-w-0 flex-1">
              <p className="text-[0.95rem] font-bold leading-snug text-ss-text">
                {product?.name ?? 'Product no longer in catalogue'}
              </p>

              <p className="ss-tabular mt-1 text-[0.78rem] text-ss-muted">
                {[
                  product?.brand,
                  product?.grade,
                  product?.city,
                  product?.supplierName,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>

              <p className="ss-tabular mt-2 text-[0.72rem] text-ss-muted">
                {t(WISHLIST_COPY.savedOn.en, WISHLIST_COPY.savedOn.hi)}{' '}
                {formatDateTime(item.createdAt)}
              </p>
            </div>

            {/* Rate + stock */}
            <div className="shrink-0 text-left sm:text-right">
              <p className="ss-tabular text-[1.05rem] font-extrabold leading-none text-ss-text">
                {product ? formatInr(product.pricePerTonInr) : '—'}
                <span className="ml-1 text-[0.7rem] font-semibold text-ss-muted">
                  {t('/ MT', '/ मीट्रिक टन')}
                </span>
              </p>
              <p className="ss-tabular mt-1.5 text-[0.74rem] text-ss-muted">
                {product?.isInStock
                  ? `${formatTons(product.inventoryTons)} MT ${t(
                      FORM_COPY.stock.en,
                      FORM_COPY.stock.hi
                    )}`
                  : t(FORM_COPY.outOfStock.en, FORM_COPY.outOfStock.hi)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {product && (
                <Link
                  href={`/products/${product.id}`}
                  className="ss-tap inline-flex items-center rounded-full border border-ss-line bg-white px-4 py-2 text-[0.78rem] font-bold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
                >
                  {t(WISHLIST_COPY.viewProduct.en, WISHLIST_COPY.viewProduct.hi)}
                </Link>
              )}

              <button
                type="button"
                onClick={() => remove(item.productId)}
                disabled={busy}
                aria-label={t(
                  WISHLIST_COPY.removeConfirm.en,
                  WISHLIST_COPY.removeConfirm.hi
                )}
                className="ss-tap inline-flex h-10 w-10 items-center justify-center rounded-full border border-ss-line bg-white text-ss-muted transition-colors hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
