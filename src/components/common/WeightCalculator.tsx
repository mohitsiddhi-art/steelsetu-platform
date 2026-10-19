'use client';

import { useState } from 'react';
import { calculateSheetWeightKg, calculateTonnage } from '@/lib/steelCalculator';
import { Calculator } from 'lucide-react';

export default function WeightCalculator() {
  const [thickness, setThickness] = useState<number>(0.50);
  const [width, setWidth] = useState<number>(1060);
  const [length, setLength] = useState<number>(3660);
  const [pieces, setPieces] = useState<number>(500);

  const unitWeight = calculateSheetWeightKg(thickness, width, length);
  const totalTons = calculateTonnage(unitWeight, pieces);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-white text-base">Theoretical Weight & Tonnage Estimator</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Thickness (mm)</label>
          <input
            type="number"
            step="0.01"
            value={thickness}
            onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Width (mm)</label>
          <input
            type="number"
            step="10"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Length (mm)</label>
          <input
            type="number"
            step="10"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Sheet Count (Pcs)</label>
          <input
            type="number"
            step="10"
            value={pieces}
            onChange={(e) => setPieces(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="text-slate-400">
          Unit Sheet Weight: <span className="font-mono text-white font-semibold">{unitWeight.toFixed(2)} kg</span>
        </div>
        <div className="px-3 py-1.5 rounded-md bg-blue-950/40 border border-blue-800 text-blue-300 font-medium">
          Total Estimated Consignment: <span className="font-mono font-bold text-white text-sm">{totalTons} MT</span>
        </div>
      </div>
    </div>
  );
}
