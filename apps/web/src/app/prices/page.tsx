import type { Metadata } from 'next';
import { Suspense } from 'react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { getMarketRates } from '@/services/platformService';
import { formatInr } from '@/lib/format';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck, Lock, Activity } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Live Steel Market Rates & Burrabazar Mandi Monitor — Steelsetu',
  description: 'Real-time spot rates, 7-day price trends, day high/low bands, and Burrabazar market sentiment for TMT rebars, coils, and structural sections.',
  alternates: { canonical: '/prices' },
};

async function RatesMonitor() {
  const rates = await getMarketRates();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((rate, idx) => {
          const isUp = rate.changePct >= 0;
          return (
            <Reveal key={rate.id} delay={idx * 50}>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />

                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-300">
                      {rate.spec || 'Standard Grade'}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {rate.commodity}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-mono font-bold ${isUp ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? `+${rate.changePct}%` : `${rate.changePct}%`}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                      {formatInr(rate.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">/ {rate.unit}</span>
                  </div>
                </div>

                {/* Simulated 7-day mini sparkline representation */}
                <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>7-Day Trend: <span className="text-emerald-400 font-semibold">Stable High</span></span>
                  <Link
                    href="/user-login?intent=post"
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 font-semibold transition-colors shadow-md"
                  >
                    Lock Rate
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export default async function PricesPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-7xl">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/85 text-blue-300 text-xs font-mono mb-4">
              <Activity className="w-3.5 h-3.5 text-blue-400" /> Burrabazar Mandi Institutional Monitor
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
              Steel Market Rates Monitor
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Institutional ex-mill and Burrabazar stockist benchmarks. Rates are indicative market references. Updated for TMT rebars, structural channels, beams, and color-coated coils.
            </p>
            <p className="mt-2 text-xs text-ss-orange font-medium italic">
              *Prices shown are market benchmarks excluding GST & freight. Verified live quotes available via Trade Desk.
            </p>
          </Reveal>

          <div className="mt-12">
            <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Loading Burrabazar rate monitor...</div>}>
              <RatesMonitor />
            </Suspense>
          </div>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
