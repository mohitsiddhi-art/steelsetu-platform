'use client';

import { Search, Calculator, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MegaSearch() {
  const primaryPills = [
    { label: 'Ready Spot Stock', href: '/trade-desk', icon: Zap, highlight: false },
    { label: 'Direct Ex-Mill', href: '/products', icon: Layers, highlight: false },
    { label: 'Verified Intermediaries', href: '/suppliers', icon: ShieldCheck, highlight: false },
    { label: '10-Tool Suite', href: '/calculators', icon: Calculator, highlight: true },
  ];

  const accessoryPills = [
    { label: 'SDS Screws', query: 'SDS Screws' },
    { label: 'PPGL Ridge', query: 'PPGL Ridge' },
    { label: 'Daylight Sheets', query: 'Daylight Sheet' },
    { label: 'Turbo Vents', query: 'Turbo Ventilator' },
    { label: 'GI Binding Wire', query: 'Binding Wire' },
  ];

  return (
    <section className="ss-container pt-10 pb-6 relative">
      {/* Absolute Industrial Truss / Lattice SVG Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <svg className="w-full h-full text-slate-700" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="truss-lattice" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 L30 0 L60 30 L30 60 Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M0 0 L60 60 M60 0 L0 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#truss-lattice)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Hero Title & Eyebrow */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ss-orange/15 border border-ss-orange/30 text-xs font-mono text-ss-orange font-bold">
            <Sparkles size={13} /> BURRABAZAR KOLKATA • LIVE B2B STEEL DESK
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            Source Industrial Steel at <span className="ss-text-forge">Ex-Mill & Mandi Rates</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant RFQ dispatch, verified mill test certificates (IS 1786 / IS 277), live Burrabazar price tickers, and 10 expert steel calculation tools.
          </p>
        </div>

        {/* Search Input Box (Placed with generous margin-top) */}
        <div className="relative w-full shadow-2xl shadow-blue-500/10 mt-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-ss-orange to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search TMT Bars, H-Beams, PPGL Coils, Galvanized Sheets, SDS Screws..."
              className="w-full bg-slate-900/95 border border-white/20 rounded-2xl py-4 pl-12 pr-28 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-ss-orange backdrop-blur-xl"
            />
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <button className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-ss-orange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-ss-orange/20 transition-all flex items-center gap-1.5">
              <span>Find Steel</span>
            </button>
          </div>
        </div>

        {/* Functional 2nd Row Pills & Quick Actions */}
        <div className="space-y-3 pt-2">
          {/* Primary Navigation Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 ss-no-scrollbar flex-nowrap items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 pr-1">Quick Hubs:</span>
            {primaryPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    pill.highlight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20 hover:bg-amber-500/30'
                      : 'bg-white/5 text-slate-200 border border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <Icon size={13} className={pill.highlight ? 'text-amber-400' : 'text-ss-blue'} />
                  {pill.label}
                </Link>
              );
            })}
          </div>

          {/* Accessory & Hardware Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 ss-no-scrollbar flex-nowrap items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 pr-1">Accessories:</span>
            {accessoryPills.map((acc) => (
              <Link
                key={acc.label}
                href={`/products?q=${encodeURIComponent(acc.query)}&category=ROOFING_ACCESSORY`}
                className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-medium text-slate-300 bg-slate-900/80 border border-white/10 hover:border-ss-orange/40 hover:text-white whitespace-nowrap transition-all shrink-0"
              >
                {acc.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
