'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight, Search, ShieldCheck, Zap, Building2, Layers } from 'lucide-react';
import SteelFrameHero from './SteelFrameHero';

const MILL_BRANDS = [
  'Tata Steel / Tiscon',
  'SAIL',
  'JSW Steel',
  'AM/NS India',
  'Jindal Panther',
  'APL Apollo',
  'Surya Roshni',
  'Shyam Steel',
  'Super Smelters',
  'Manaksia Steels',
];

const CATEGORIES = [
  { id: 'tmt', name: 'TMT Rebars (Fe 500D / 550D)' },
  { id: 'pipes', name: 'MS & GI Steel Pipes (IS 1239 / 1161)' },
  { id: 'sheets', name: 'GI & PPGL Roofing Sheets (AZ-150)' },
  { id: 'plates', name: 'IS 2062 E250 / E350 Plates & Coils' },
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [bentoCategory, setBentoCategory] = useState(CATEGORIES[0].id);
  const [bentoBrand, setBentoBrand] = useState(MILL_BRANDS[0]);
  const [bentoTonnage, setBentoTonnage] = useState('25');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : '/products');
  };

  const handleBentoSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/products?category=${bentoCategory}&brand=${encodeURIComponent(bentoBrand)}&tons=${bentoTonnage}`);
  };

  return (
    <section
      className="ss-aurora relative isolate flex min-h-[92vh] flex-col justify-between overflow-hidden pb-12 pt-28"
      data-layer="marketing"
    >
      <SteelFrameHero />

      {/* Radial mesh glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/20 via-amber-500/10 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Bottom fade into the ticker strip. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(5,6,10,0.85) 78%, var(--ss-ink))',
        }}
        aria-hidden="true"
      />

      <div className="ss-container relative z-10 text-center max-w-5xl mx-auto space-y-8">
        {/* Eyebrow */}
        <div className="ss-fade-up inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-slate-900/80 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-blue-300 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          Burrabazar Prime Stockists & Mill Channel Partners · Kolkata, WB
        </div>

        {/* Headline */}
        <h1
          className="ss-fade-up ss-h1 text-balance text-[2.4rem] leading-[1.06] sm:text-6xl lg:text-[4.4rem]"
          style={{ animationDelay: '80ms' }}
        >
          Build the Right Connection.{' '}
          <span className="ss-text-forge">Source the Right Steel.</span>
        </h1>

        {/* Supporting copy */}
        <p
          className="ss-fade-up mx-auto max-w-3xl text-pretty text-[0.98rem] leading-relaxed text-slate-300 sm:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          Direct mill allocations, verified ISI gauge protection, and instant transparent pricing for India&apos;s leading infrastructure builders and fabricators.
        </p>

        {/* Instant Mill RFQ & Rate Finder Bento Widget inside Hero fold */}
        <div
          className="ss-fade-up rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl text-left max-w-4xl mx-auto"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Instant Mill RFQ & Rate Finder</h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Live Allocation Desk Active
            </span>
          </div>

          <form onSubmit={handleBentoSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">1. Steel Category</label>
              <select
                value={bentoCategory}
                onChange={(e) => setBentoCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">2. Preferred Mill / Brand</label>
              <select
                value={bentoBrand}
                onChange={(e) => setBentoBrand(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
              >
                {MILL_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">3. Quantity (MT)</label>
              <input
                type="number"
                min={1}
                max={5000}
                value={bentoTonnage}
                onChange={(e) => setBentoTonnage(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-[38px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Find Rate & Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Trust Guarantee sub-bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Risk Protection: Verified Mill-Edge / ISI Gauge — Avoid 8–12% under-gauge market loss
            </span>
            <span className="font-mono text-slate-500">Approx. ex-mill rates apply</span>
          </div>
        </div>

        {/* Secondary search bar */}
        <form
          onSubmit={onSubmit}
          className="ss-glass ss-hairline mx-auto flex max-w-2xl flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center sm:rounded-full"
          role="search"
        >
          <div className="flex flex-1 items-center gap-3 px-3 sm:px-4">
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Or search full Burrabazar catalogue (e.g. 12mm TMT, IS 2062 Angles)..."
              className="h-10 w-full bg-transparent text-[0.9rem] text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-white transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Infinite Scrolling Mill Brands Marquee below Hero */}
      <div className="relative z-10 w-full bg-slate-900/90 border-t border-b border-slate-800 py-4 mt-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" /> Authorized Channel Partner & Mill Ecosystem:
          </span>
          <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">Direct Ex-Mill Dispatch</span>
        </div>

        <div className="flex overflow-x-auto scrollbar-none gap-8 px-6 py-2 items-center justify-start lg:justify-center whitespace-nowrap">
          {MILL_BRANDS.map((brand) => (
            <div
              key={brand}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 font-semibold text-xs tracking-wide shadow-sm hover:border-blue-500/50 hover:text-white transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
