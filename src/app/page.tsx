import Navbar from '@/components/layout/Navbar';
import { getFeaturedProducts } from '@/services/catalogService';

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
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

        <section id="catalog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">Spot Inventory</h2>
            <span className="text-xs text-slate-400">All prices ex-mill / INR per Ton</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">SKU / Material</th>
                  <th className="px-6 py-3.5">Specs (Thk x Wd)</th>
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
                      <button className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors">
                        RFQ Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
