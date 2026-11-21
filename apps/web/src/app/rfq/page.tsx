import type { Metadata } from 'next';
import { Suspense } from 'react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import PortalRfqForm from '@/components/portal/PortalRfqForm';
import { getProducts } from '@/services/catalogService';

export const metadata: Metadata = {
  title: 'Post Your Steel Requirement (RFQ) | Steelsetu Burrabazar',
  description: 'Submit your steel procurement requirement and get verified quotes from Singhi Enterprises Trade Desk and network of mills across Burrabazar, Durgapur, and Raipur.',
  alternates: { canonical: '/rfq' },
};

async function RfqFormLoader() {
  const products = await getProducts();
  return <PortalRfqForm products={products} />;
}

export default async function RfqPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="pt-32 pb-24">
        <div className="ss-container max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display mb-6">
            Post Your Steel Requirement
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            One form reaches verified stockists and mills across our network. Our Trade Desk will confirm availability, lock rates, and schedule dispatch within business hours.
          </p>

          <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Loading RFQ form...</div>}>
            <RfqFormLoader />
          </Suspense>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
