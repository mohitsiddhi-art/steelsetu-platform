import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, IndianRupee, Ruler, Scale } from 'lucide-react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import BusinessCalculatorsSuite from '@/components/calculators/BusinessCalculatorsSuite';
import { getMarketRates } from '@/services/platformService';
import { formatInr } from '@/lib/format';

export const instant = false;

export const metadata: Metadata = {
  title: 'Complete 10-Tool B2B Steel Business Suite — Weight, GST, Landed Cost & Estimator',
  description:
    'Full B2B steel calculation suite: IS 1786 TMT weight, GST proforma invoices, landed cost per MT, gauge conversion, udhaar interest tracker, roofing sheets, profit margin and truck dispatch planner.',
  alternates: { canonical: '/calculators' },
  openGraph: {
    title: '10-Tool B2B Steel Business Suite | Steelsetu',
    description:
      'Burrabazar mandi calculation suite covering weight, GST, landed cost, gauge conversion, interest, and logistics.',
  },
};

export default async function CalculatorsPage() {
  let rates: any[] = [];
  try {
    rates = await getMarketRates();
  } catch (err) {
    rates = [];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Steelsetu 10-Tool Steel Business Suite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://steelsetu.com/calculators',
    description:
      'Complete B2B steel calculation suite for Indian construction procurement and Burrabazar stockists.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  };

  return (
    <div data-layer="marketing" className="relative min-h-screen ss-industrial-grid text-slate-100">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingHeader />

      <main className="ss-aurora pt-36 md:pt-40 pb-24">
        {/* --- Hero --- */}
        <section className="relative pb-10">
          <div className="ss-container">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="ss-eyebrow text-ss-orange">B2B Procurement Intelligence</p>
              <h1 className="ss-h1 mt-4 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
                10-Tool Steel
                <br />
                <span className="ss-text-forge">Business Suite</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-slate-300">
                Work out tonnage, GST invoices, landed site cost, gauge thickness, udhaar interest, and transport logistics before placing your order. Every number is grounded in Burrabazar mandi trade standards.
              </p>

              {rates.length > 0 && (
                <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
                  {rates.slice(0, 4).map((rate) => (
                    <Link
                      key={rate.id}
                      href="/prices"
                      className="ss-glass rounded-full px-4 py-2 transition-colors hover:border-ss-orange/40"
                    >
                      <span className="text-[0.72rem] font-semibold text-white">
                        {rate.commodity}
                      </span>
                      <span className="ss-tabular ml-2 text-[0.72rem] text-slate-400">
                        {formatInr(rate.price)}/{rate.unit}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* --- Interactive Calculators Suite --- */}
        <section className="ss-container mt-12">
          <Reveal delay={120}>
            <BusinessCalculatorsSuite />
          </Reveal>
        </section>

        {/* --- Closing CTA --- */}
        <section className="relative overflow-hidden py-20 mt-20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(56rem 24rem at 50% 120%, rgba(249,115,22,0.32), transparent 68%)',
            }}
          />
          <div className="ss-container relative">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ss-orange">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="ss-h2 mt-5 text-3xl text-white sm:text-4xl">
                Calculations verified? Lock your order now.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-slate-400">
                Post your requirement and reach verified stockists and mills across Bengal with live ex-mill rates and confirmed dispatch dates.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/user-login?intent=post"
                  className="ss-molten inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white sm:w-auto"
                >
                  Post Your Requirement
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
                >
                  Browse the Catalogue
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
