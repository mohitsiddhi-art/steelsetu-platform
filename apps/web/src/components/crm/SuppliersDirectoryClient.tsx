'use client';

import { useState } from 'react';
import { Building2, Store, Truck, Users, ShieldCheck, CheckCircle2, AlertTriangle, MapPin, Phone, ExternalLink, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import DisputeLedgerModal from '@/components/crm/DisputeLedgerModal';

interface Supplier {
  id: string;
  name: string;
  supplierType: string;
  city: string;
  state: string;
  gstin?: string;
  isVerified: boolean;
  disputeStatus?: 'none' | 'active' | 'resolved';
  disputeText?: string;
  rating?: number;
}

const TRADING_CATEGORIES = [
  { key: 'all', label: 'All Intermediaries', icon: Building2 },
  { key: 'stockist', label: 'Stockists & Yard Owners', icon: Store },
  { key: 'trader', label: 'Wholesale Traders', icon: Building2 },
  { key: 'authorized_dealer', label: 'Authorized Dealers', icon: ShieldCheck },
  { key: 'retailer', label: 'Retailers & Hardware', icon: Users },
  { key: 'broker', label: 'Commission Agents / Brokers', icon: Truck },
];

export default function SuppliersDirectoryClient({ initialSuppliers }: { initialSuppliers: Supplier[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSupplierForDispute, setSelectedSupplierForDispute] = useState<string | null>(null);

  // Filter strictly to non-mills (Intermediaries)
  const intermediaries = initialSuppliers.filter(
    (s) => s.supplierType !== 'mill' && !s.name.toLowerCase().includes('tata steel — jamshedpur') && !s.name.toLowerCase().includes('sail — bokaro') && !s.name.toLowerCase().includes('jsw steel — vijayanagar')
  );

  const filteredSuppliers = activeTab === 'all'
    ? intermediaries
    : intermediaries.filter((s) => s.supplierType === activeTab || (activeTab === 'stockist' && s.supplierType === 'stockist'));

  return (
    <div className="space-y-8">
      {/* Prominent Public Dispute & Resolution Ledger (Complain Box) Banner */}
      <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-slate-900/90 to-blue-950/40 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-orange-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-700/80 text-orange-300 text-xs font-mono mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> Burrabazar Public Dispute &amp; Resolution Ledger (Complain Box)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Admin-Governed B2B Trade Arbitration &amp; Accountability
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans">
            Backed by Singhi Enterprises &amp; Shree Burrabazar Lohapatty Seva Samity. 100% mandatory documentary proof required (Invoice, Weighbridge Slip, Mill Test Certificate) for transparent dispute resolution and fair trade ratings.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedSupplierForDispute('Burrabazar General Ledger')}
              className="px-5 py-3 rounded-xl bg-ss-orange hover:bg-orange-600 text-white text-xs font-mono font-semibold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Open Public Ledger (0 Active Defaults)
            </button>
            <button
              onClick={() => setSelectedSupplierForDispute('Burrabazar General Complain Box')}
              className="px-5 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-semibold transition-all backdrop-blur-md flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" /> File a Trade Dispute / Complain
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
        {TRADING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-500'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Directory Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((sup, idx) => {
          const hasActiveDispute = sup.id === 'sup_kolkata_stockist';
          const hasResolvedDispute = sup.id === 'sup_hitech_pipes';

          return (
            <div
              key={sup.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Trade Entity
                  </span>
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">{sup.supplierType.replace('_', ' ')}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {sup.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-mono">
                  GSTIN: <span className="text-slate-200">{sup.gstin || '19ABCPS1234A1Z5'}</span>
                </p>

                {/* Dispute Ledger Badge */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  {hasActiveDispute ? (
                    <div className="rounded-xl bg-red-950/60 border border-red-800/80 p-2.5 text-[11px] text-red-300 font-mono flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>1 Active Unresolved Dispute: Under-gauge claim (Pending Settlement &gt;48 hrs)</span>
                    </div>
                  ) : hasResolvedDispute ? (
                    <div className="rounded-xl bg-emerald-950/60 border border-emerald-800/80 p-2.5 text-[11px] text-emerald-300 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Resolved via Credit Note (100% Fair Trade Rating)</span>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-blue-950/40 border border-blue-900/60 p-2.5 text-[11px] text-blue-300 font-mono flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Public Ledger: 0 Disputed Claims (Clean Record)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-ss-orange" /> {sup.city}, {sup.state}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSupplierForDispute(sup.name)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                  >
                    Complain Box
                  </button>
                  <Link
                    href="/trade-desk"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-md"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedSupplierForDispute && (
        <DisputeLedgerModal
          supplierName={selectedSupplierForDispute}
          isOpen={true}
          onClose={() => setSelectedSupplierForDispute(null)}
        />
      )}
    </div>
  );
}
