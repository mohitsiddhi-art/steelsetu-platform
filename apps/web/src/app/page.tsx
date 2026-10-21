import Navbar from '@/components/layout/Navbar';
import InventoryTable from '@/components/common/InventoryTable';
import WeightCalculator from '@/components/common/WeightCalculator';
import TradingStats from '@/components/common/TradingStats';
import { getFeaturedProducts } from '@/services/catalogService';

/**
 * The dashboard reads live spot rates and stock from Supabase, so it must not
 * be prerendered at build time — a baked-in snapshot of prices would be
 * misleading by the time the page is served.
 */
export const instant = false;

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const totalStockTons = products.reduce((acc, curr) => acc + curr.inventoryTons, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="border-b border-slate-800 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                B2B Steel & Coil Exchange
              </h1>
              <p className="text-slate-400 mt-1">
                Verified inventory of GI sheets, PPGL coils, and profile roofing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Spot Trading Active
              </span>
            </div>
          </div>
        </div>

        <TradingStats totalTons={totalStockTons} productCount={products.length} />

        <WeightCalculator />

        <section id="catalog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">Spot Inventory</h2>
            <span className="text-xs text-slate-400">All prices ex-mill / INR per Ton</span>
          </div>

          <InventoryTable products={products} />
        </section>
      </main>
    </div>
  );
}
