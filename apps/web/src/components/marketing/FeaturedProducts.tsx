import Link from 'next/link';
import {
  BadgeCheck,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Ruler,
} from 'lucide-react';
import { SteelProduct } from '@/types/steel';
import { formatInr, formatMm, formatTons } from '@/lib/format';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

/**
 * Section 3 — "Featured Products".
 *
 * Six sponsored items. Every card carries the full specification the brief
 * asks for: name, brand, grade/spec, size/thickness, unit, colour, price
 * range, city, supplier, verified badge and a WhatsApp CTA to 919883051500.
 */
export default function FeaturedProducts({
  products,
}: {
  products: SteelProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <section
      data-layer="marketing"
      className="relative py-24"
      aria-labelledby="featured-heading"
    >
      <div className="ss-container">
        <Reveal className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="ss-eyebrow text-ss-orange">Sponsored Listings</p>
            <h2
              id="featured-heading"
              className="ss-h2 mt-3 text-3xl text-white sm:text-4xl"
            >
              Featured Products
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-slate-400">
              Live stock from the Burrabazar yard, priced for bulk dispatch.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[0.82rem] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            View all products
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, i) => {
            const priceMin = product.priceRangeMinPerTonInr ?? product.pricePerTonInr;
            const priceMax = product.priceRangeMaxPerTonInr ?? product.pricePerTonInr;

            const waMessage = [
              `Hi Singhi Enterprises, I am interested in ${product.name}`,
              `(${[product.brand, product.grade, formatMm(product.thicknessMm)]
                .filter(Boolean)
                .join(', ')})`,
              `Please share the best bulk rate for Burrabazar delivery.`,
            ].join(' ');

            return (
              <Reveal key={product.id} delay={i * 70}>
                <TiltCard className="h-full" max={4}>
                  <article className="ss-glass group flex h-full flex-col overflow-hidden rounded-2xl transition-colors hover:border-ss-blue/40">
                    {/* Header strip */}
                    <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5 pb-4">
                      <div className="min-w-0">
                        <h3 className="text-[0.98rem] font-semibold leading-snug text-white">
                          {product.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-[0.76rem] text-slate-400">
                          {product.brand ?? 'Unbranded'}
                          {product.grade && (
                            <>
                              <span className="text-slate-600">·</span>
                              {product.grade}
                            </>
                          )}
                        </p>
                      </div>

                      {product.isVerified && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-emerald-300">
                          <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Spec grid */}
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 pt-4 text-[0.76rem]">
                      <Spec
                        icon={<Ruler className="h-3.5 w-3.5" aria-hidden="true" />}
                        label="Size / Thickness"
                        value={`${formatMm(product.thicknessMm)} × ${formatMm(product.widthMm)}`}
                      />
                      <Spec
                        icon={<Package className="h-3.5 w-3.5" aria-hidden="true" />}
                        label="Unit"
                        value={product.uom ?? 'Per Ton'}
                      />
                      <Spec
                        icon={<Package className="h-3.5 w-3.5" aria-hidden="true" />}
                        label="Colour"
                        value={product.colour ?? 'As per mill finish'}
                      />
                      <Spec
                        icon={<Package className="h-3.5 w-3.5" aria-hidden="true" />}
                        label="Min. Order"
                        value={`${formatTons(product.minimumOrderTons)} MT`}
                      />
                      {product.city && (
                        <Spec
                          icon={<MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
                          label="City"
                          value={product.city}
                        />
                      )}
                      {product.leadTimeDays !== undefined && (
                        <Spec
                          icon={<Clock className="h-3.5 w-3.5" aria-hidden="true" />}
                          label="Lead Time"
                          value={`${product.leadTimeDays} days`}
                        />
                      )}
                    </dl>

                    {/* Supplier + price */}
                    <div className="mt-auto border-t border-white/10 p-5 pt-4">
                      {product.supplierName && (
                        <p className="truncate text-[0.74rem] text-slate-500">
                          <span className="text-slate-600">Supplier:</span>{' '}
                          <span className="text-slate-300">{product.supplierName}</span>
                        </p>
                      )}

                      <p className="ss-tabular mt-2 text-[1.05rem] font-bold text-white">
                        {priceMin === priceMax
                          ? formatInr(priceMin)
                          : `${formatInr(priceMin)} – ${formatInr(priceMax)}`}
                        <span className="ml-1 text-[0.7rem] font-medium text-slate-500">
                          / MT
                        </span>
                      </p>

                      <div className="mt-4 flex gap-2">
                        <a
                          href={`https://wa.me/919883051500?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500/15 text-[0.78rem] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          WhatsApp
                        </a>

                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-[0.78rem] font-semibold text-white transition-colors hover:bg-white/10"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span className="text-ss-blue">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 truncate font-medium text-slate-200">{value}</dd>
    </div>
  );
}
