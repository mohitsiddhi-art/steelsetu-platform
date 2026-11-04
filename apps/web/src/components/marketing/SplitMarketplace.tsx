'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Package, Truck, Zap, ShieldAlert, Building, Calculator, MessageSquare, ExternalLink } from 'lucide-react';
import { SteelProduct, SteelCategory } from '@/types/steel';
import { formatInr, formatMm } from '@/lib/format';
import ComplaintModal from '@/components/trust/ComplaintModal';

const CATEGORIES: { code: SteelCategory | null; label: string; count: string }[] = [
  { code: null, label: 'All Categories', count: 'Full Inventory' },
  { code: 'TMT_BAR', label: 'TMT Rebars (FE500D/550D)', count: '1,240 MT' },
  { code: 'GI_SHEET', label: 'GP/GI Coils & Sheets', count: '850 MT' },
  { code: 'PROFILE_SHEET', label: 'PPGL Roofing Sheets', count: '620 MT' },
  { code: 'HR_COIL', label: 'HR/CR Plates & Sheets', count: '1,500 MT' },
  { code: 'ANGLE_CHANNEL', label: 'Angles, Channels & Beams', count: '780 MT' },
  { code: 'ROOFING_ACCESSORY', label: 'Roofing Accessories & Fasteners', count: '1,450 Boxes/Pcs' },
];

export default function SplitMarketplace({ products }: { products: SteelProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<SteelCategory | null>(null);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <section className="ss-container py-12">
      <ComplaintModal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category Tree & Platform Quick Access */}
        <div className="lg:col-span-3 space-y-6">
          <div className="ss-glass rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Package size={16} className="text-ss-orange" /> Market Categories
            </h3>
            <ul className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.code;
                return (
                  <li key={cat.label}>
                    <button
                      onClick={() => setActiveCategory(cat.code)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white font-bold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="text-xs group-hover:text-white">{cat.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{cat.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* High-Contrast Platform Quick Access Panel */}
          <div className="rounded-2xl border border-ss-orange/40 bg-slate-900/95 p-5 space-y-3 shadow-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ss-orange font-mono flex items-center gap-2">
              <Zap size={14} className="text-ss-orange animate-pulse" /> Platform Quick Access
            </h3>
            <p className="text-[11px] text-slate-400">
              Direct tools and portals for Burrabazar merchants and stockists:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <Link
                href="/tools/bill-generator"
                className="flex items-center justify-between p-2.5 rounded-xl bg-orange-600/15 border border-orange-500/30 text-orange-300 font-semibold hover:bg-orange-600/25 transition-colors"
              >
                <span className="flex items-center gap-2">🧾 Bill / P.O. / Challan Maker</span>
                <ChevronRight size={12} />
              </Link>

              <Link
                href="/trade-desk"
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 font-semibold hover:bg-blue-600/25 transition-colors"
              >
                <span className="flex items-center gap-2">⚡ Merchant Trade Desk CRM</span>
                <ChevronRight size={12} />
              </Link>

              <Link
                href="/community"
                className="flex items-center justify-between p-2.5 rounded-xl bg-purple-600/15 border border-purple-500/30 text-purple-300 font-semibold hover:bg-purple-600/25 transition-colors"
              >
                <span className="flex items-center gap-2"><MessageSquare size={14} /> Community Trading Exchange</span>
                <ChevronRight size={12} />
              </Link>

              <Link
                href="/calculators"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 font-semibold hover:bg-emerald-600/25 transition-colors"
              >
                <span className="flex items-center gap-2"><Calculator size={14} /> 10-Tool Business Calculators</span>
                <ChevronRight size={12} />
              </Link>

              <Link
                href="/suppliers"
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-600/15 border border-amber-500/30 text-amber-300 font-semibold hover:bg-amber-600/25 transition-colors"
              >
                <span className="flex items-center gap-2"><Building size={14} /> Verified Mill Brands Directory</span>
                <ChevronRight size={12} />
              </Link>

              <button
                onClick={() => setIsComplaintOpen(true)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-red-600/15 border border-red-500/30 text-red-300 font-semibold hover:bg-red-600/25 transition-colors w-full"
              >
                <span className="flex items-center gap-2"><ShieldAlert size={14} /> Complaint Box &amp; Dispute Desk</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Grid */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeCategory ? CATEGORIES.find(c => c.code === activeCategory)?.label : 'Trending Steel Inventory'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredProducts.length} verified listings from Burrabazar & Mill stock.
              </p>
            </div>
            <Link href="/products" className="text-xs text-ss-blue hover:underline">See All Catalog</Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="ss-glass rounded-2xl p-12 text-center space-y-3">
              <p className="text-sm text-slate-300">No items found in this category.</p>
              <button
                onClick={() => setActiveCategory(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
              >
                Reset Category Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="ss-glass rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-ss-blue/50 transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-[9px] font-mono font-bold uppercase mb-1 inline-block">
                          {product.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-ss-blue transition-colors">{product.name}</h4>
                        <p className="text-[10px] text-slate-400">{product.brand} | {product.grade || 'Std Grade'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">{formatInr(product.pricePerTonInr || 54000)}<span className="text-[10px] text-slate-500 font-normal">/{product.uom || 'MT'}</span></p>
                        <p className="text-[10px] text-slate-500">MOQ: {product.minimumOrderTons || 1} {product.uom || 'MT'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                    <div className="text-center">
                      <p className="text-[8px] uppercase text-slate-500">Thickness</p>
                      <p className="text-[10px] text-slate-200 font-mono">{formatMm(product.thicknessMm)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] uppercase text-slate-500">Location</p>
                      <p className="text-[10px] text-slate-200 font-mono">{product.city || 'Kolkata'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] uppercase text-slate-500">Ready Stock</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{product.inventoryTons} {product.uom || 'MT'}</p>
                    </div>
                  </div>

                  {/* Cross-sell banner for profile sheets */}
                  {(product.category === 'PROFILE_SHEET' || product.category === 'GI_SHEET' || product.category === 'PPGL_COIL') && (
                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-[10px] gap-2">
                      <span className="text-amber-300 font-medium">⚡ [Add Mount SDS Screws & Plain Ridge]</span>
                      <Link href="/products?category=ROOFING_ACCESSORY" className="shrink-0 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors">Add</Link>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Link href={`/products/${product.id}`} className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl transition-colors">
                      Lock Rate / RFQ
                    </Link>
                    <a href="https://wa.me/919883051500" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-600/30 transition-colors flex items-center justify-center">
                      <Truck size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
