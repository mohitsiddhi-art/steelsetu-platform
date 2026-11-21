import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import OpenComplaintButton from '@/components/trust/OpenComplaintButton';

export const metadata: Metadata = {
  title: 'Grievance Redressal | Steelsetu',
  description: 'Submit formal grievances, quality complaints, or disputes regarding your steel procurement. We ensure rapid redressal via our verified Trade Desk.',
  alternates: { canonical: '/grievance' },
};

export default function GrievancePage() {
  return (
    <div className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="ss-container max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display mb-6">
            Grievance Redressal Desk
          </h1>
          <p className="text-slate-300 mb-8">
            At Steelsetu, we take quality assurance and ethical trading seriously. If you have encountered a discrepancy in weight, quality, or service, please use the official channel below to ensure your case is documented and fast-tracked for resolution.
          </p>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">How to Raise a Grievance</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Prepare your Invoice or Challan number.</li>
              <li>Have photographs of the discrepancy (e.g., weighbridge slip, damaged goods, incorrect gauge) ready.</li>
              <li>Click the button below to open a direct, secure line to our Dispute Redressal Desk.</li>
            </ol>
          </div>
          <div className="mt-8">
            <OpenComplaintButton>Open Complaint Desk</OpenComplaintButton>
          </div>
        </div>
      </main>
      <SiteFooter tone="dark" />
    </div>
  );
}
