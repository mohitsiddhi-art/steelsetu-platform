import Navbar from '@/components/layout/Navbar';
import { Shield, Users, TrendingUp, AlertCircle, FileText } from 'lucide-react';

export const instant = false;

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <div className="ss-container py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Shield className="w-8 h-8 text-ss-orange" /> Super Admin ERP Cockpit
            </h1>
            <p className="text-slate-400 mt-1">Platform management, supplier KYC verification, and dispute desk.</p>
          </div>
          <span className="px-3 py-1 rounded bg-blue-900 border border-blue-700 text-blue-300 font-mono text-xs">
            Admin: admin@steelsetu.com
          </span>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs uppercase text-slate-400 font-mono">Pending Supplier KYC</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">4 Mills / Stockists</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs uppercase text-slate-400 font-mono">Live Platform Leads</p>
            <p className="text-3xl font-extrabold text-blue-400 mt-2">1,420 Active</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs uppercase text-slate-400 font-mono">Disputes &amp; Claims Desk</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">0 Open Tickets</p>
          </div>
        </div>

        {/* Supplier KYC List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-xl font-bold">Pending Supplier KYC Verification</h2>
          <div className="space-y-3">
            {[
              { name: 'Howrah Steel Rolling Mills', gstin: '19AABCH9912K1Z8', city: 'Howrah', status: 'Pending Review' },
              { name: 'Durgapur Structural Pipe Co', gstin: '19AACPD4411M1Z1', city: 'Durgapur', status: 'Pending GST Verification' },
            ].map((sup, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold">{sup.name}</p>
                  <p className="text-xs font-mono text-slate-400">GSTIN: {sup.gstin} | City: {sup.city}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold">Approve KYC</button>
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold">Inspect Docs</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
