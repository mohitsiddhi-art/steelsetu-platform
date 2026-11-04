'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Factory, MapPin } from 'lucide-react';
import { SteelBrand } from '@/types/platform';
import Reveal from './Reveal';

/**
 * Section 2 — "National & Regional Brands Showcase".
 *
 * An interactive strip: the brand list is a filter rail, and the selected
 * brand expands into a detail panel with its mills, product lines and
 * certifications. The list is horizontally scrollable on a phone, which is
 * the "swipeable slider" the responsive rules call for.
 */
export default function BrandShowcase({ brands }: { brands: SteelBrand[] }) {
  const featured = useMemo(
    () => brands.filter((b) => b.isFeatured),
    [brands]
  );
  const list = featured.length > 0 ? featured : brands;

  const [activeId, setActiveId] = useState(list[0]?.id ?? '');
  const active = list.find((b) => b.id === activeId) ?? list[0];

  if (!active) return null;

  return (
    <section
      data-layer="marketing"
      className="relative border-y border-white/[0.07] bg-ss-graphite/40 py-24"
      aria-labelledby="brands-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">Mills We Work With</p>
          <h2 id="brands-heading" className="ss-h2 mt-3 text-3xl text-white sm:text-4xl">
            National &amp; Regional Brands
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-400">
            Pan-India majors and the eastern mills that supply Bengal — every
            one of them stocked, rated and quoted by our Burrabazar desk.
          </p>
        </Reveal>

        {/* Filter rail */}
        <Reveal delay={80} className="mt-12">
          <div
            className="ss-no-scrollbar -mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-3"
            role="tablist"
            aria-label="Steel brands"
          >
            {list.map((brand) => {
              const selected = brand.id === active.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(brand.id)}
                  className={`snap-start shrink-0 rounded-full border px-4 py-2 text-[0.8rem] font-semibold transition-all ${
                    selected
                      ? 'border-ss-orange/50 bg-ss-orange/15 text-ss-orange'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {brand.shortName ?? brand.name}
                  {brand.origin === 'regional' && (
                    <span className="ml-2 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500">
                      Regional
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Detail panel */}
        <Reveal delay={140} className="mt-6">
          <div className="ss-glass ss-hairline overflow-hidden rounded-3xl">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: active.brandColor }}
                    aria-hidden="true"
                  />
                  <h3 className="ss-h2 text-2xl text-white sm:text-3xl">
                    {active.name}
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {active.origin === 'national' ? 'National' : 'Regional'}
                  </span>
                </div>

                {active.tagline && (
                  <p className="mt-3 text-[0.95rem] font-medium text-ss-orange">
                    {active.tagline}
                  </p>
                )}

                {active.description && (
                  <p className="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-slate-400">
                    {active.description}
                  </p>
                )}

                {active.productLines.length > 0 && (
                  <div className="mt-7">
                    <h4 className="ss-eyebrow text-slate-500">Product Lines</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {active.productLines.map((line) => (
                        <li
                          key={line}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[0.76rem] text-slate-300"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {active.certifications.length > 0 && (
                  <div className="mt-6">
                    <h4 className="ss-eyebrow text-slate-500">Certifications</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {active.certifications.map((cert) => (
                        <li
                          key={cert}
                          className="rounded-lg border border-ss-blue/25 bg-ss-blue/10 px-3 py-1.5 text-[0.76rem] text-ss-blue"
                        >
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Facts rail */}
              <aside className="space-y-3 border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {active.foundedYear && (
                  <Fact label="Founded" value={String(active.foundedYear)} />
                )}
                {active.headquarters && (
                  <Fact label="Headquarters" value={active.headquarters} />
                )}
                {active.millLocations.length > 0 && (
                  <Fact
                    label="Mill Locations"
                    value={active.millLocations.join(' · ')}
                    icon={<Factory className="h-3.5 w-3.5" aria-hidden="true" />}
                  />
                )}
                {active.capacity && (
                  <Fact label="Capacity" value={active.capacity} />
                )}

                <Link
                  href={`/products?brand=${encodeURIComponent(active.name)}`}
                  className="ss-molten mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-[0.82rem] font-semibold text-white"
                >
                  View {active.shortName ?? active.name} Products
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                {active.website && (
                  <a
                    href={active.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[0.78rem] font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Visit official website
                  </a>
                )}
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Fact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-[0.85rem] font-medium text-slate-200">
        {icon}
        {value}
      </p>
    </div>
  );
}
