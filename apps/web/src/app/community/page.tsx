import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { Flame } from 'lucide-react';
import CommunityClient from '@/components/crm/CommunityClient';

export const metadata: Metadata = {
  title: 'Steel Trade Community Hub & Exchange — Steelsetu Burrabazar',
  description: 'Interactive trade exchange for contractors, fabricators, procurement heads, and commission agents in Eastern India steel markets.',
  alternates: { canonical: '/community' },
};

export default function CommunityPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-7xl">
          {/* Header */}
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/85 text-blue-300 text-xs font-mono mb-4">
              <Flame className="w-3.5 h-3.5 text-ss-orange" /> Eastern India Steel Trading Exchange
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
              Steel Trade Community Hub
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Connect directly with Burrabazar stockists, mill-certified fabricators, structural engineers, and commission agents. Real-time mandi sentiment, buy/sell requirements, and direct RFQ conversion.
            </p>
          </Reveal>

          <div className="mt-12">
            <CommunityClient />
          </div>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
