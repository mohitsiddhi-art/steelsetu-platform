import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  Grid3x3,
  Layers,
  Ruler,
  Triangle,
  Waves,
} from 'lucide-react';
import TiltCard from './TiltCard';
import Reveal from './Reveal';

/**
 * Section 1 — "What You Can Source".
 *
 * Six category cards that tilt toward the pointer and glow on hover. The
 * categories map onto the live catalogue's `category` column, so each card
 * links to a real filtered result set rather than a placeholder.
 */
const CATEGORIES = [
  {
    name: 'TMT Bars',
    blurb: 'Fe 500D & Fe 550D reinforcement, BIS IS 1786 certified.',
    query: 'TMT',
    Icon: Ruler,
    accent: 'from-ss-blue/30',
  },
  {
    name: 'MS Pipes & Tubes',
    blurb: 'ERW, seamless and hollow sections across every IS standard.',
    query: 'pipe',
    Icon: Waves,
    accent: 'from-ss-blue/25',
  },
  {
    name: 'Roofing Sheets',
    blurb: 'GI and PPGL profiled sheets, 120–275 GSM.',
    query: 'roof',
    Icon: Grid3x3,
    accent: 'from-ss-orange/25',
  },
  {
    name: 'Steel Plates',
    blurb: 'HR and CR plates, cut to size, mill certificates included.',
    query: 'plate',
    Icon: Layers,
    accent: 'from-ss-blue/25',
  },
  {
    name: 'Wire & Mesh',
    blurb: 'Wire rods, binding wire, and welded mesh.',
    query: 'wire',
    Icon: Boxes,
    accent: 'from-ss-orange/25',
  },
  {
    name: 'Structural Steel',
    blurb: 'Angles, channels and I-sections to IS 808.',
    query: 'angle',
    Icon: Triangle,
    accent: 'from-ss-blue/30',
  },
];

export default function WhatYouCanSource() {
  return (
    <section
      data-layer="marketing"
      className="relative py-24"
      aria-labelledby="source-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">The Catalogue</p>
          <h2 id="source-heading" className="ss-h2 mt-3 text-3xl text-white sm:text-4xl">
            What You Can Source
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-400">
            Every commodity a project actually needs, sourced from verified
            Indian mills and stocked at Burrabazar.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 70}>
              <TiltCard className="h-full">
                <Link
                  href={`/products?q=${encodeURIComponent(cat.query)}`}
                  className="ss-glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-colors hover:border-ss-blue/40"
                >
                  {/* Hover glow wash */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${cat.accent} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden="true"
                  />

                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-blue transition-colors group-hover:border-ss-blue/40 group-hover:text-ss-orange">
                    <cat.Icon className="h-6 w-6" aria-hidden="true" />
                  </span>

                  <h3 className="relative mt-5 text-lg font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                    {cat.blurb}
                  </p>

                  <span className="relative mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-ss-blue transition-colors group-hover:text-ss-orange">
                    Browse {cat.name}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
