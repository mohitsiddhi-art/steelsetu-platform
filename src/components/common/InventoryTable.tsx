'use client';

import { useState } from 'react';
import { SteelProduct } from '@/types/steel';
import RfqModal from './RfqModal';

interface InventoryTableProps {
  products: SteelProduct[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<SteelProduct | null>(null);

  return (
    <>
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
            {products.map((p) => (
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
            ))}
          </tbody>
        </table>
      </div>

      <RfqModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
