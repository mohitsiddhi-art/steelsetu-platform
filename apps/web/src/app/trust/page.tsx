import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import OpenComplaintButton from '@/components/trust/OpenComplaintButton';

export const metadata: Metadata = {
  title: 'Steel Quality & Trust | Steelsetu',
  description: 'Your trusted source for verified steel products and quality assurance. Submit complaints and quality concerns through our official channels.',
  alternates: { canonical: '/trust' },
};

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="pt-32 pb-24">
        <div className="ss-container max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display mb-6">
            Quality Assurance & Trust
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            We source steel only from verified mills with documented quality certifications. If you encounter any discrepancy in weight, gauge, coating, or material specifications, use the official channel below to ensure your concern is documented and fast-tracked for resolution.
          </p>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">
              Quality Concerns & Redressal
            </h2>
            <p className="text-slate-300 text-sm mb-4">
              Steelsetu guarantees MTC (Mill Test Certificate) verification and weighbridge certification for all dispatched orders. If your delivered material does not match the certified specifications, you may file a formal complaint through our Trade Desk.
            </p>
          </div>

          <div className="mt-8">
            <OpenComplaintButton>Report Quality Concern</OpenComplaintButton>
          </div>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}