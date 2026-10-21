import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { getProductById, getProducts, CATEGORY_LABELS } from '@/services/catalogService';
import { SteelProduct } from '@/types/steel';
import { formatInr, formatMm, formatSpecValue, formatTons, humanizeSpecKey } from '@/lib/format';
import RfqModal from '@/components/catalog/ProductDetailRfq';
import WhatsAppButton from '@/components/catalog/WhatsAppButton';
import { ArrowLeft, Factory, Package, Ruler, ScrollText, ShieldCheck } from 'lucide-react';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

/**
 * Product pages read live rates and stock from Supabase, so they must not be
 * prerendered at build time — a baked-in snapshot of prices would be
 * misleading by the time the page is served.
 */
export const instant = false;

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Product Not Found | Steelsetu' };

  return {
    title: `${product.name} | Steelsetu`,
    description:
      product.description ??
      `${product.name} — ${product.brand ?? ''} ${product.grade ?? ''}`.trim(),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const related = (await getProducts({ category: product.category, sort: 'name_asc' }))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const specs = Object.entries(product.specifications ?? {});

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to catalogue
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-8">
            <header className="border-b border-slate-800 pb-6">
              <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {categoryLabel}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                {product.name}
              </h1>
              <p className="mt-1.5 font-mono text-xs text-slate-500">{product.sku}</p>

              {product.description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
                  {product.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {product.brand && (
                  <Badge icon={<Factory className="h-3 w-3" />}>{product.brand}</Badge>
                )}
                {product.grade && (
                  <Badge icon={<ShieldCheck className="h-3 w-3" />}>{product.grade}</Badge>
                )}
                {product.hsnCode && (
                  <Badge icon={<ScrollText className="h-3 w-3" />}>HSN {product.hsnCode}</Badge>
                )}
                {product.millName && (
                  <Badge icon={<Factory className="h-3 w-3" />}>{product.millName}</Badge>
                )}
              </div>
            </header>

            {/* Dimensional spec */}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Ruler className="h-4 w-4 text-blue-400" />
                Dimensions
              </h2>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 sm:grid-cols-4">
                <SpecCell label="Thickness" value={formatMm(product.thicknessMm)} />
                <SpecCell label="Width" value={formatMm(product.widthMm)} />
                <SpecCell
                  label="Length"
                  value={product.lengthMm !== undefined ? formatMm(product.lengthMm) : 'Coil'}
                />
                <SpecCell label="Coating" value={product.coating} accent />
              </div>
            </section>

            {/* Full specifications */}
            {specs.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <ScrollText className="h-4 w-4 text-blue-400" />
                  Technical Specifications
                </h2>
                <div className="overflow-hidden rounded-lg border border-slate-800">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-800/60">
                      {specs.map(([key, value]) => (
                        <tr key={key} className="bg-slate-900/40">
                          <th
                            scope="row"
                            className="w-2/5 px-5 py-3 text-xs font-medium text-slate-400"
                          >
                            {humanizeSpecKey(key)}
                          </th>
                          <td className="px-5 py-3 font-mono text-xs text-slate-200">
                            {formatSpecValue(key, value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Related */}
            {related.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-200">
                  More in {categoryLabel}
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {related.map((r) => (
                    <RelatedCard key={r.id} product={r} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Ex-mill rate
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold text-white">
                    {formatInr(product.pricePerTonInr)}
                  </span>
                  <span className="text-xs text-slate-500">/ MT</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-600">
                  Exclusive of GST, freight and loading
                </p>
              </div>

              <div className="space-y-3 border-y border-slate-800 py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Package className="h-3.5 w-3.5 text-emerald-400" />
                    Available stock
                  </span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {formatTons(product.inventoryTons)} MT
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Minimum order</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {formatTons(product.minimumOrderTons)} MT
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Delivery</span>
                  <span className="text-slate-200">Burrabazar, Kolkata</span>
                </div>
              </div>

              <RfqModal product={product} />

              <WhatsAppButton
                product={product}
                size="lg"
                label="Inquire on WhatsApp for Best Rate"
                className="mt-3"
              />

              <p className="text-center text-[10px] text-slate-600">
                Formal quotation issued within 1 working day
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300">
      {icon}
      {children}
    </span>
  );
}

function SpecCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-slate-900/60 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div
        className={`mt-1 font-mono text-sm font-semibold ${accent ? 'text-blue-400' : 'text-white'}`}
      >
        {value}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: SteelProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-blue-700/60"
    >
      <div className="truncate text-xs font-medium text-slate-200 group-hover:text-blue-300">
        {product.name}
      </div>
      <div className="mt-1 font-mono text-[10px] text-slate-500">{product.sku}</div>
      <div className="mt-2 font-mono text-sm font-bold text-white">
        {formatInr(product.pricePerTonInr)}
        <span className="ml-1 text-[10px] font-normal text-slate-500">/ MT</span>
      </div>
    </Link>
  );
}
