'use client';

import Link from 'next/link';
import { SteelProduct } from '@/types/steel';
import { formatInr, formatMm, formatTons } from '@/lib/format';
import RfqModal from '@/components/common/RfqModal';
import WhatsAppButton from '@/components/catalog/WhatsAppButton';
import { useState } from 'react';
import { FileText, Package, TrendingDown } from 'lucide-react';

interface ProductCardProps {
  product: SteelProduct;
  categoryLabel: string;
}

export default function ProductCard({ product, categoryLabel }: ProductCardProps) {
  const [rfqOpen, setRfqOpen] = useState(false);

  const stockTone =
    product.inventoryTons <= 0
      ? 'text-slate-500'
      : product.inventoryTons < 30
        ? 'text-amber-400'
        : 'text-emerald-400';

  return (
    <>
      <article className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-blue-700/60 hover:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {categoryLabel}
            </span>
            <h3 className="mt-2 text-sm font-semibold leading-snug text-white">
              <Link
                href={`/products/${product.id}`}
                className="transition-colors hover:text-blue-400 focus-visible:underline focus-visible:outline-none"
              >
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{product.sku}</p>
          </div>

          {product.brand && (
            <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-medium text-slate-300">
              {product.brand}
            </span>
          )}
        </div>

        {product.grade && (
          <p className="mt-3 text-[11px] text-slate-400">
            <span className="text-slate-500">Spec:</span> {product.grade}
          </p>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-slate-800/80 py-3 text-[11px]">
          <div>
            <dt className="text-slate-500">Thickness</dt>
            <dd className="font-mono font-medium text-slate-200">
              {formatMm(product.thicknessMm)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Width</dt>
            <dd className="font-mono font-medium text-slate-200">
              {formatMm(product.widthMm)}
            </dd>
          </div>
          {product.lengthMm !== undefined && (
            <div>
              <dt className="text-slate-500">Length</dt>
              <dd className="font-mono font-medium text-slate-200">
                {formatMm(product.lengthMm)}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500">Coating</dt>
            <dd className="font-mono font-medium text-blue-400">{product.coating}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-white">
                {formatInr(product.pricePerTonInr)}
              </span>
              <span className="text-[10px] text-slate-500">/ MT</span>
            </div>
            <div className={`mt-0.5 flex items-center gap-1.5 text-[11px] font-medium ${stockTone}`}>
              <Package className="h-3 w-3" />
              {product.inventoryTons > 0
                ? `${formatTons(product.inventoryTons)} MT in stock`
                : 'Out of stock'}
              {product.minimumOrderTons > 0 && (
                <span className="text-slate-600">· min {formatTons(product.minimumOrderTons)} MT</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setRfqOpen(true)}
            disabled={product.inventoryTons <= 0}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          >
            {product.inventoryTons > 0 ? 'Request Quotation' : 'Unavailable'}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Specs
          </Link>
        </div>

        <WhatsAppButton
          product={product}
          label="Chat on WhatsApp for Best Rate"
          className="mt-2 w-full"
        />
      </article>

      <RfqModal product={rfqOpen ? product : null} onClose={() => setRfqOpen(false)} />
    </>
  );
}
