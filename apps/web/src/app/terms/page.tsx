import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { Scale, FileCheck, AlertTriangle, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Steelsetu B2B Steel Procurement',
  description: 'B2B steel procurement guidelines, advance payment protocols, non-cancellable mill orders post-dispatch, and legal jurisdiction limited strictly to Kolkata Courts.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/85 text-amber-300 text-xs font-mono mb-4">
              <Scale className="w-3.5 h-3.5 text-amber-400" /> B2B Legal & Procurement Framework
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-slate-400 font-mono">
              Effective Date: October 2026 | Governing Entity: Singhi Enterprises, Burrabazar, Kolkata
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-ss-orange" /> 1. Scope of B2B Platform Services
              </h2>
              <p>
                Steelsetu is an institutional B2B digital trade desk and procurement platform operated by Singhi Enterprises (Burrabazar, Kolkata). By accessing our portal, submitting Quotation Requests (RFQs), or engaging in trade transactions, you acknowledge that you are acting in a commercial or industrial capacity (contractor, fabricator, corporate buyer, or mill supplier) and agree to be bound by these Terms of Service.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" /> 2. Quotations, Pricing & Advance Payment Protocols
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong className="text-white">Indicative Rates:</strong> Platform rates and cost estimates are indicative ex-mill / stockist rates subject to daily market fluctuations, freight tariffs, and GST (18%).</li>
                <li><strong className="text-white">Payment Terms:</strong> Confirmed orders require agreed advance payment or approved credit terms (Khata / Udhaar limits) backed by valid GSTIN credentials.</li>
                <li><strong className="text-white">Price Revision:</strong> Orders remain tentative until a formal Proforma Invoice is issued by Singhi Trade Desk and advance remittance is verified.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> 3. Non-Cancellable Mill Orders & Logistics
              </h2>
              <p>
                Once a mill allocation or stockist dispatch is initiated and trucks are loaded, orders are <strong className="text-white">strictly non-cancellable</strong>. Buyers are responsible for safe unloading and site accessibility. Demurrage charges resulting from truck detention at the delivery destination will be billed to the buyer&apos;s account.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">4. Governing Law & Kolkata Jurisdiction</h2>
              <p>
                All commercial transactions, disputes, or legal claims arising from use of Steelsetu or dealings with Singhi Enterprises shall be governed by the laws of India. Any litigation or legal proceedings shall be subject <strong className="text-white">strictly to the exclusive jurisdiction of the Courts in Kolkata, West Bengal</strong>.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
