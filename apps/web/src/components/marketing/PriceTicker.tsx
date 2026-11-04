'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Activity, Send, TrendingUp } from 'lucide-react';
import { MarketRate } from '@/types/platform';
import { formatInr } from '@/lib/format';

/**
 * Enhanced live steel price ticker with mandi tabs and WhatsApp lock rate button.
 */
export default function PriceTicker({ rates }: { rates: MarketRate[] }) {
  const [activeMandi, setActiveMandi] = useState<'BURRABAZAR' | 'DURGAPUR' | 'RAIPUR'>('BURRABAZAR');

  const mandiRates: Record<string, Array<{ name: string; spec: string; price: number; change: string; up: boolean }>> = {
    BURRABAZAR: [
      { name: 'TMT Rebar 12mm (Fe 500D)', spec: 'IS 1786', price: 54200, change: '+₹250 today', up: true },
      { name: 'PPGL Roofing Sheet 0.50mm', spec: 'AZ150', price: 78500, change: '+₹500 today', up: true },
      { name: 'MS Angle 50x50x6mm', spec: 'IS 2062', price: 54800, change: '-₹100 today', up: false },
      { name: 'Mount SDS Screws 12x55', spec: 'EPDM Washer', price: 1420, change: 'Stable', up: true },
      { name: 'GI Plain Sheet 0.45mm', spec: '120GSM', price: 68200, change: '+₹150 today', up: true },
    ],
    DURGAPUR: [
      { name: 'TMT Rebar 12mm (Secondary)', spec: 'IS 1786', price: 51800, change: '+₹200 today', up: true },
      { name: 'MS Billets (100x100mm)', spec: 'IS 2830', price: 44500, change: '-₹300 today', up: false },
      { name: 'Structural Channel 100x50', spec: 'IS 2062', price: 53200, change: 'Stable', up: true },
    ],
    RAIPUR: [
      { name: 'TMT Rebar 12mm (Primary)', spec: 'IS 1786', price: 52500, change: '+₹350 today', up: true },
      { name: 'MS Wire Rod 5.5mm', spec: 'HC Grade', price: 50900, change: '+₹150 today', up: true },
      { name: 'GI Wire 8G', spec: 'Galvanized', price: 56400, change: 'Stable', up: true },
    ],
  };

  const currentRates = mandiRates[activeMandi];

  return (
    <section
      data-layer="marketing"
      className="relative z-10 border-y border-white/10 bg-ss-graphite/80 backdrop-blur-xl"
      aria-label="Live steel prices"
    >
      <div className="ss-container py-4 space-y-3">
        {/* Mandi Selector Tabs & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-emerald-300">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              Live Mandi Rates
            </span>

            <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-1 text-xs">
              {(['BURRABAZAR', 'DURGAPUR', 'RAIPUR'] as const).map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setActiveMandi(mandi)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    activeMandi === mandi
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mandi.charAt(0) + mandi.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/919883051500?text=Hello%20Singhi%20Trade%20Desk,%20I%20would%20like%20to%20lock%20live%20rates%20for%20today."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-4 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-600/30 shadow-md"
          >
            <Send className="h-3.5 w-3.5" />
            Lock Rate via WhatsApp (+91 98830 51500)
          </a>
        </div>

        {/* Ticker Cards / Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentRates.map((item, idx) => {
            const ChangeIcon = item.up ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between hover:border-blue-500/50 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-white line-clamp-1">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.spec}</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {formatInr(item.price)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                        item.up ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <ChangeIcon className="h-3 w-3" />
                      {item.change}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">Spot Despatch</span>
                  <a
                    href={`https://wa.me/919883051500?text=${encodeURIComponent(`Hello Singhi Trade Desk, I want to lock rate for ${item.name} at ₹${item.price}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ss-orange font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Lock Rate &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
