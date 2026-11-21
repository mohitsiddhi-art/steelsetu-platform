import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { getBrands } from '@/services/platformService';

export const metadata: Metadata = {
  title: 'Verified Steel Brands & Mill Directory — Steelsetu',
  description: 'A curated directory of verified steel mill brands and manufacturers across India. Filter by origin, product lines, and certifications to find trusted suppliers for your procurement needs.',
  alternates: { canonical: '/brands' },
};

async function BrandGrid() {
  const brands = await getBrands();

  if (brands.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center">
        <p className="text-slate-400">No brands currently listed.</p>
        <p className="mt-2 text-sm text-slate-500">Contact our Trade Desk to have your brand added.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 hover:border-ss-orange/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="h-5 w-5 rounded-full"
              style={{ background: brand.brandColor }}
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold text-white">{brand.name}</h3>
            {brand.origin === 'regional' && (
              <span className="text-[0.65rem] font-medium uppercase tracking-wider text-slate-500">Regional</span>
            )}
          </div>

          {brand.tagline && (
            <p className="text-[0.85rem] text-ss-orange mb-3 font-medium">
              {brand.tagline}
            </p>
          )}

          {brand.description && (
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {brand.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            <div>
              <strong>Origin:</strong> {brand.origin === 'national' ? 'Pan-India' : 'Regional'}
            </div>
            <div>
              <strong>Founded:</strong> {brand.foundedYear?.toString() ?? 'N/A'}
            </div>
          </div>

          <Link
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.7rem] font-medium text-slate-300 transition-colors hover:text-white"
          >
            View {brand.shortName ?? brand.name} Products
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="pt-32 pb-24">
        <div className="ss-container max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display mb-6">
            Verified Steel Brands
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Below is a directory of accredited steel mill brands and manufacturers. Each entry has been verified for quality standards, certifications, and regional availability.
          </p>

          <Suspense fallback={<div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">Loading brands...</div>}>
            <BrandGrid />
          </Suspense>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
