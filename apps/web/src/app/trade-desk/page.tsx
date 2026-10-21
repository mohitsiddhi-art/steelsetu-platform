import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { getAllRfqs } from '@/services/rfqService';
import { getStaffIdentity } from '@/services/authService';
import { Clock, CheckCircle } from 'lucide-react';

/**
 * The ledger reads live inquiry rows from Supabase, so it must not be
 * prerendered at build time.
 */
export const instant = false;

export default async function TradeDeskPage() {
  // Defence in depth: the proxy already blocks anonymous visitors, but this
  // check lives with the data it protects. If the proxy is ever removed,
  // misconfigured, or bypassed, this redirect still stops the buyer details
  // from being rendered.
  const staff = await getStaffIdentity();

  if (!staff) {
    redirect('/login?next=%2Ftrade-desk');
  }

  const inquiries = await getAllRfqs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-6">
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Trade Desk Order & Inquiry Ledger
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live mill allocations and quotes submitted by B2B buyers.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800 text-xs text-blue-400 font-mono">
            {inquiries.length} Inquiries Logged
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Ref ID / Time</th>
                <th className="px-6 py-3.5">Buyer & Enterprise</th>
                <th className="px-6 py-3.5">GSTIN</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Quantity</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {inquiries.map((rfq) => (
                <tr key={rfq.referenceId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-400">{rfq.referenceId}</div>
                    <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                      {new Date(rfq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-sans">
                    <div className="font-medium text-white">{rfq.buyerName}</div>
                    <div className="text-xs text-slate-400">{rfq.companyName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {rfq.gstNumber}
                  </td>
                  <td className="px-6 py-4 font-sans text-slate-200">
                    {rfq.productName || rfq.productId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-400">{rfq.tons} MT</span>
                    <span className="text-[11px] text-slate-500 block font-sans">Pin: {rfq.pincode}</span>
                  </td>
                  <td className="px-6 py-4 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                        rfq.status === 'ALLOCATED'
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                          : 'bg-amber-950/60 border-amber-800 text-amber-400'
                      }`}
                    >
                      {rfq.status === 'ALLOCATED' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {rfq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
