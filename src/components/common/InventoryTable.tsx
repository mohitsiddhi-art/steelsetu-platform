'use client';

import { useState } from 'react';
import { SteelProduct, SteelCategory } from '@/types/steel';
import RfqModal from './RfqModal';
import { Search, Filter } from 'lucide-react';

interface InventoryTableProps {
  products: SteelProduct[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<SteelProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { label: 'All Inventory', value: 'ALL' },
    { label: 'Profile Sheets', value: 'PROFILE_SHEET' },
    { label: 'GI Sheets', value: 'GI_SHEET' },
    { label: 'PPGL Coils', value: 'PPGL_COIL' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.coating.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors }
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by SKU, spec, coating..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3.5">SKU / Material</th>
                <th className="px-6 py-3.5">Specs (Thk × Wd)</th>
                <th className="px-6 py-3.5">Coating</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Rate / Ton</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-xs">
                    No steel materials match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{p.sku}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {p.thicknessMm}mm × {p.widthMm}mm
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-400">
                      {p.coating}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-semibold">{p.inventoryTons} MT</span>
                      <span className="text-xs text-slate-500 block">Min: {p.minimumOrderTons} MT</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      ₹{p.pricePerTonInr.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors"
                      >
                        RFQ Quote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RfqModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
