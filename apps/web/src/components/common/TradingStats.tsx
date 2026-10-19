import { TrendingUp, ShieldCheck, Factory, Layers } from 'lucide-react';

interface TradingStatsProps {
  totalTons: number;
  productCount: number;
}

export default function TradingStats({ totalTons, productCount }: TradingStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Active Spot Stock</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {totalTons.toFixed(1)} <span className="text-xs text-slate-400 font-sans">MT</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
          <Factory className="w-4 h-4 text-emerald-400" />
          <span>Verified Mill SKUs</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {productCount} <span className="text-xs text-slate-400 font-sans">Items</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Benchmark Index</span>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          ₹74,560 <span className="text-xs text-emerald-400 font-sans font-medium">↑ 0.8%</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Quality Standard</span>
        </div>
        <div className="text-lg font-bold text-white pt-1">
          IS 2062 / IS 277
        </div>
      </div>
    </div>
  );
}
