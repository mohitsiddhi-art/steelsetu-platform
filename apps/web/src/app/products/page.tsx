import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/catalog/ProductCard';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import {
  getBrands,
  getCategories,
  getProducts,
  getCatalogStats,
} from '@/services/catalogService';
import { CatalogSort, SteelCategory } from '@/types/steel';
import { formatInr, formatTons } from '@/lib/format';
import { Boxes, IndianRupee, Layers, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Catalogue | Steelsetu',
  description:
    'Browse live B2B inventory of GI and PPGL roofing sheets, galvalume and colour-coated coils, HR/CR coils, TMT bars and structural sections from verified Burrabazar mills.',
};

/**
 * The catalogue reads live rates and stock from Supabase, so it must not be
 * prerendered at build time — a baked-in snapshot of prices would be
 * misleading by the time the page is served.
 */
export const instant = false;

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const VALID_SORTS: CatalogSort[] = ['price_asc', 'price_desc', 'stock_desc', 'name_asc'];

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v || undefined;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const categoryParam = firstValue(params.category);
  const brandParam = firstValue(params.brand);
  const searchParam = firstValue(params.q);
  const sortParam = firstValue(params.sort);

  // Only apply a category if it is one we actually know about.
  const categories = await getCategories();
  const validCategoryCodes = new Set(categories.map((c) => c.code));
  const category =
    categoryParam && validCategoryCodes.has(categoryParam as SteelCategory)
      ? (categoryParam as SteelCategory)
      : undefined;

  const brands = await getBrands();
  const brand = brandParam && brands.includes(brandParam) ? brandParam : undefined;

  const sort = VALID_SORTS.includes(sortParam as CatalogSort)
    ? (sortParam as CatalogSort)
    : 'name_asc';

  const [products, stats] = await Promise.all([
    getProducts({ category, brand, search: searchParam, sort }),
    getCatalogStats(),
  ]);

  const categoryLabel = (code: string) =>
    categories.find((c) => c.code === code)?.label ?? code;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-10">
        {/* Header */}
        <header className="border-b border-slate-800 pb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Live Catalogue
              </span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Steel Product Catalogue
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Ex-mill rates and live stock from verified mills, quoted for Burrabazar
                despatch. Request a formal quotation for any SKU.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Spot Trading Active
            </div>
          </div>
        </header>

        {/* Stats strip */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={<Boxes className="h-4 w-4 text-blue-400" />}
            label="Active SKUs"
            value={String(stats.totalProducts)}
            sub="mill-verified listings"
          />
          <StatCard
            icon={<Package className="h-4 w-4 text-emerald-400" />}
            label="Spot Stock"
            value={`${formatTons(stats.totalStockTons)} MT`}
            sub="available to allocate"
          />
          <StatCard
            icon={<Layers className="h-4 w-4 text-amber-400" />}
            label="Categories"
            value={String(stats.categoryCount)}
            sub={`${stats.brandCount} mill brands`}
          />
          <StatCard
            icon={<IndianRupee className="h-4 w-4 text-cyan-400" />}
            label="Rate Band"
            value={`${formatInr(stats.minPricePerTonInr)}–${formatInr(stats.maxPricePerTonInr)}`}
            sub={`avg ${formatInr(stats.averagePricePerTonInr)}/MT`}
          />
        </section>

        {/* Filters + grid */}
        <section className="space-y-6">
          <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-slate-900/50" />}>
            <CatalogFilters
              categories={categories}
              brands={brands}
              activeCategory={category}
              activeBrand={brand}
              activeSearch={searchParam}
              activeSort={sort}
              resultCount={products.length}
            />
          </Suspense>

          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
              <Boxes className="mx-auto h-10 w-10 text-slate-700" />
              <h2 className="mt-4 text-base font-semibold text-slate-300">
                No steel materials match your filters
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                Try widening the category or clearing the search term. Our trade desk
                also sources on-demand for specifications not listed.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryLabel={categoryLabel(p.category)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-800 py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-[11px] text-slate-600">
          Steelsetu · Burrabazar, Kolkata — rates ex-mill, exclusive of GST and freight
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-mono text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[10px] text-slate-500">{sub}</div>
    </div>
  );
}
