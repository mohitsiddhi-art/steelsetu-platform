import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Reveal from '@/components/marketing/Reveal';
import { Scale, ShieldAlert, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trade & Tolerance Disclaimer — Steelsetu B2B Procurement',
  description: 'Legal protection against mill-level variations, coating tolerances, thickness rolling variances, and official MTC weighbridge weight bindings.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div data-layer="marketing" className="relative min-h-screen bg-ss-ink text-slate-100">
      <MarketingHeader />

      <main className="ss-aurora pt-32 pb-24">
        <div className="ss-container max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/85 text-purple-300 text-xs font-mono mb-4">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Technical & Trade Disclaimers
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
              Trade &amp; Tolerance Disclaimer
            </h1>
            <p className="mt-3 text-sm text-slate-400 font-mono">
              Binding Technical Standards | Singhi Enterprises, Burrabazar, Kolkata
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-ss-orange" /> 1. Mill Tolerances & Coating Variations
              </h2>
              <p>
                All steel products supplied via Steelsetu (including TMT rebars, structural angles, channels, beams, galvanised sheets, and PPGL coils) adhere to relevant Bureau of Indian Standards (BIS) specifications (such as IS 1786 for TMT, IS 808 for structural steel, and IS 277 for galvanised products). Buyers acknowledge that manufacturing tolerances apply to all steel dimensions, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 pt-2">
                <li><strong className="text-white">Coating & Spangle Variations:</strong> Galvanized and PPGL color-coated coils are subject to standard coating mass tolerances (e.g., nominal 120 GSM / AZ-150 with standard mill batch ranges between 80 GSM to 150 GSM).</li>
                <li><strong className="text-white">Dimensional & Weight Rolling Tolerances:</strong> Per BIS standards (IS 1786 / IS 1852), individual bar and plate weights are subject to permissible rolling margins (±2.5% to ±5% depending on section size).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 2. Binding Authority of MTC & Weighbridge Slips
              </h2>
              <p>
                Platform calculators, estimated weights, and ex-mill rate summaries are provided solely for preliminary planning and budgeting. <strong className="text-white">Final billing quantity and dispatch valuation correspond strictly to the manufacturer&apos;s official Mill Test Certificate (MTC) and certified electronic weighbridge delivery slips</strong> issued at the time of dispatch from the mill or Burrabazar warehouse.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" /> 3. Limitation of Liability
              </h2>
              <p>
                Singhi Enterprises and Steelsetu shall not be held liable for indirect or consequential losses arising from site delivery delays caused by transporter strikes, highway restrictions, state border Octroi/tax check-post inspections, or force majeure events. Buyers are advised to inspect materials upon receipt prior to fabrication.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}
