import type { Metadata } from 'next';
import { Suspense } from 'react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { getSuppliers } from '@/services/platformService';
import { Building2, Store, ShieldCheck } from 'lucide-react';
import SuppliersDirectoryClient from '@/components/crm/SuppliersDirectoryClient';

export const metadata: Metadata = {
  title: 'Verified Burrabazar Stockists, Wholesalers & Dealers Directory — Steelsetu',
  description: 'Strictly trade intermediaries directory: Stockists, wholesale traders, authorized dealers, and Burrabazar mandi brokers with Public Dispute & Resolution Ledger badges.',
  alternates: { canonical: '/suppliers' },
};

async function SuppliersDirectoryLoader() {
  const suppliers = await getSuppliers();
  return <SuppliersDirectoryClient initialSuppliers={suppliers} />;
}

export default async function SuppliersPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen ss-industrial-grid text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-7xl">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/85 text-blue-300 text-xs font-mono mb-4">
              <Store className="w-3.5 h-3.5 text-blue-400" /> Trade Intermediaries &amp; Stockists Directory
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
              Verified Burrabazar Stockists &amp; Wholesalers
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Directory of verified trade intermediaries, stockists, and mandi brokers. Every entity is backed by the Public Dispute &amp; Resolution Ledger for transparent B2B accountability.
            </p>
          </Reveal>

          <div className="mt-12">
            <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Loading trade intermediaries directory...</div>}>
              <SuppliersDirectoryLoader />
            </Suspense>
          </div>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
