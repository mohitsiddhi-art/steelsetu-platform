import { ShieldCheck, FileText, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TrustShieldBar() {
  return (
    <section className="ss-container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ss-glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-950/50 rounded-lg text-blue-400">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Computerized Weighbridge Slip</h3>
            <p className="text-[10px] text-slate-400">Physical gross & tare slip matched with computerized tax invoice.</p>
          </div>
        </div>

        <div className="ss-glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-950/50 rounded-lg text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Mill Test Certificate (MTC)</h3>
            <p className="text-[10px] text-slate-400">Original manufacturer heat number & chemical composition test report.</p>
          </div>
        </div>

        <Link href="/suppliers#disputes" className="ss-glass p-4 rounded-xl flex items-center gap-3 hover:border-ss-orange/40 transition-all">
          <div className="p-2 bg-orange-950/50 rounded-lg text-orange-400">
            <Scale size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Public Dispute & Arbitration Ledger</h3>
            <p className="text-[10px] text-slate-400">Complain box & transparent merchant dispute resolution.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
