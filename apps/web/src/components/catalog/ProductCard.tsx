'use client';

import Link from 'next/link';
import { SteelProduct } from '@/types/steel';
import { formatInr, formatTons } from '@/lib/format';
import { getApproxWeightPerPiece } from '@/lib/costEstimator';
import RfqModal from '@/components/common/RfqModal';
import WhatsAppButton from '@/components/catalog/WhatsAppButton';
import { useState, useTransition } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  FileText,
  LoaderCircle,
  Package,
  Scale,
  ShieldAlert,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { saveToWishlistAction } from '@/app/actions/portalActions';

interface ProductCardProps {
  product: SteelProduct;
  categoryLabel: string;
}

export default function ProductCard({ product, categoryLabel }: ProductCardProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [wishlistPending, startWishlistTransition] = useTransition();
  const [savedToWishlist, setSavedToWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  function saveToWishlist() {
    if (wishlistPending || savedToWishlist) return;

    setWishlistError(null);
    startWishlistTransition(async () => {
      const result = await saveToWishlistAction(product.id);
      if (result.ok) {
        setSavedToWishlist(true);
        return;
      }

      setWishlistError(
        result.message === 'signInFailed'
          ? 'Sign in to save products.'
          : 'Could not save this product. Please try again.'
      );
    });
  }

  const stockTone =
    product.inventoryTons <= 0
      ? 'text-slate-500'
      : product.inventoryTons < 30
        ? 'text-amber-400'
        : 'text-emerald-400';

  const weightInfo = getApproxWeightPerPiece(product);

  // Determine badge styling based on category or product name
  const nameLower = product.name.toLowerCase();
  let badgeText = 'ISI Certified Mill Stock';
  let badgeColor = 'bg-blue-950/80 border-blue-800/80 text-blue-300';
  if (nameLower.includes('tmt') || nameLower.includes('fe 500')) {
    badgeText = 'Fe 500D / 550D Ribbed Rebar';
    badgeColor = 'bg-amber-950/80 border-amber-800/80 text-amber-300';
  } else if (nameLower.includes('ppgl') || nameLower.includes('roofing') || nameLower.includes('sheet')) {
    badgeText = 'AZ-150 Color Coated Profile';
    badgeColor = 'bg-purple-950/80 border-purple-800/80 text-purple-300';
  } else if (nameLower.includes('galvalume') || nameLower.includes('coil')) {
    badgeText = '150 GSM Spangled Coil';
    badgeColor = 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300';
  } else if (nameLower.includes('angle') || nameLower.includes('channel') || nameLower.includes('beam')) {
    badgeText = 'IS 2062 Structural Grade';
    badgeColor = 'bg-slate-800 border-slate-700 text-slate-200';
  }

  return (
    <>
      <article className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-[#0B132B]/90 p-5 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)' }}
      >
        {/* Top Metallic Visual Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300 border border-slate-700/60">
              <Layers className="w-3 h-3 text-blue-400" /> {categoryLabel}
            </span>
            <h3 className="mt-2 text-sm font-bold leading-snug text-white group-hover:text-blue-400 transition-colors">
              <Link
                href={`/products/${product.id}`}
                className="focus-visible:underline focus-visible:outline-none"
              >
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 font-mono text-[11px] text-slate-500">SKU: {product.sku}</p>
          </div>

          {product.brand && (
            <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-950 px-3 py-1 text-[10px] font-bold text-slate-200 shadow-sm">
              {product.brand}
            </span>
          )}
        </div>

        {/* High-End Metallic Visual Render / Badge strip */}
        <div className={`my-2 flex items-center justify-between px-3 py-2 rounded-xl border text-[11px] font-mono ${badgeColor}`}>
          <span className="flex items-center gap-1.5 font-semibold">
            <Zap className="w-3.5 h-3.5" /> {badgeText}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Verified</span>
        </div>

        {product.grade && (
          <p className="text-[11px] text-slate-400">
            <span className="text-slate-500">Specification:</span> <span className="text-slate-200 font-mono">{product.grade}</span>
          </p>
        )}

        {/* Approx Weight per piece / unit */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-400 font-mono">
          <Scale className="h-3.5 w-3.5 text-blue-400" />
          <span>Unit Weight / Length: {weightInfo.value} {weightInfo.unit}</span>
        </div>

            <div className="flex items-end justify-between gap-3 border-t border-slate-800/80 pt-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold font-mono text-white">
                {formatInr(product.pricePerTonInr)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">/{product.uom || 'MT'}</span>
            </div>
            <div className={`mt-1 flex items-center gap-1.5 text-[11px] font-medium ${stockTone}`}>
              <Package className="h-3.5 w-3.5" />
              {product.inventoryTons > 0
                ? `${product.inventoryTons} ${product.uom === 'MT' ? 'MT' : (product.uom || 'Pcs')} in Burrabazar Stock`
                : 'Allocation Required'}
              {product.minimumOrderTons > 0 && (
                <span className="text-slate-500 font-mono">· min {product.minimumOrderTons} {product.uom || 'MT'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Loss Aversion Framing & Mandatory Policy */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-950/50 p-2 text-[10px] text-blue-300 border border-blue-800/60 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Risk Protection: Verified Mill-Edge / ISI Gauge — Avoid 8–12% under-gauge market loss.</span>
          </div>
          <div className="flex items-start gap-1.5 rounded-lg bg-slate-950/80 p-2 text-[10px] text-slate-400 border border-slate-800/80">
            <span>* Approx. / Indicative ex-mill rates (exclusive of GST, freight, loading) — confirm before order.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setRfqOpen(true)}
            disabled={product.inventoryTons <= 0}
            className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 shadow-md shadow-blue-600/20"
          >
            {product.inventoryTons > 0 ? 'Request Quotation' : 'Allocation Pending'}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Specs
          </Link>
          <button
            type="button"
            onClick={saveToWishlist}
            disabled={wishlistPending || savedToWishlist}
            aria-label={savedToWishlist ? 'Saved to your wishlist' : 'Save to wishlist'}
            aria-pressed={savedToWishlist}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-300 transition-colors hover:border-blue-500 hover:text-blue-400 disabled:cursor-default disabled:border-emerald-800 disabled:text-emerald-400"
          >
            {wishlistPending ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : savedToWishlist ? (
              <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {wishlistError && (
          <p role="alert" className="mt-2 text-[11px] text-rose-400">
            {wishlistError}
          </p>
        )}

        <WhatsAppButton
          product={product}
          label="Chat on WhatsApp for Best Rate"
          className="mt-2.5 w-full"
        />
      </article>

      <RfqModal product={rfqOpen ? product : null} onClose={() => setRfqOpen(false)} />
    </>
  );
}
