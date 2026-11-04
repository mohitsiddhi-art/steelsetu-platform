import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Steelsetu B2B Steel Procurement & CRM',
  description: 'Comprehensive privacy policy detailing data protection for GSTIN, RFQ pricing, company contact details, and compliance with the Indian IT Act.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/85 text-blue-300 text-xs font-mono mb-4">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Legal & Data Governance
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-400 font-mono">
              Last Updated: October 2026 | Operable under Singhi Enterprises, Burrabazar, Kolkata
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-ss-orange" /> 1. Commitment to Data Protection
              </h2>
              <p>
                Steelsetu (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by Singhi Enterprises in Burrabazar, Kolkata, is committed to safeguarding the confidentiality and security of commercial data shared by our B2B procurement partners, contractors, fabricators, and mill suppliers. This Privacy Policy governs our collection, storage, processing, and protection of commercial identifiers including GSTIN, PAN, company contact details, RFQ pricing, and ledger transactions in strict compliance with the Information Technology Act, 2000 and applicable Indian data protection standards.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" /> 2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong className="text-white">Commercial Identifiers:</strong> Company legal name, GSTIN (Goods and Services Tax Identification Number), PAN, registered business address, and delivery site pincodes.</li>
                <li><strong className="text-white">Representative Contact Details:</strong> Names, designation, phone numbers, and official email addresses of procurement heads and site engineers.</li>
                <li><strong className="text-white">Procurement & RFQ Metadata:</strong> Steel grades (e.g., Fe 500D, IS 2062), tonnage requirements, target delivery hubs, quotation logs, and Khata (ledger) payment transactions.</li>
                <li><strong className="text-white">Technical Telemetry:</strong> Secure browser logs, session cookies, and authentication tokens required for secure portal access.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 3. Use & Confidentiality of Commercial Data
              </h2>
              <p>
                All submitted commercial data and RFQ specifications are utilized exclusively for matching buyers with verified mills and stockists, executing trade allocations, issuing GST tax invoices, and managing trade credit (Udhaar) ledgers. We maintain strict non-disclosure safeguards and never sell, lease, or monetize commercial client data to unauthorized third parties.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">4. Security Infrastructure & Compliance</h2>
              <p>
                Data is encrypted in transit and at rest using industry-standard cryptographic protocols. Access to sensitive ledger information is restricted via role-based access control (RBAC) separating Owner and Manager privileges. For privacy inquiries or data removal requests, contact our Compliance Desk at Burrabazar, Kolkata, or via email at <a href="mailto:privacy@steelsetu.com" className="text-blue-400 underline">privacy@steelsetu.com</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
