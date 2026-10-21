import { supabase } from '@/lib/supabase';
import {
  CatalogFilters,
  CatalogSort,
  CatalogStats,
  ProductSpecifications,
  SteelCategory,
  SteelCategoryMeta,
  SteelProduct,
} from '@/types/steel';
import { Database, Json } from '@/types/supabase';

/**
 * Catalogue data access.
 *
 * The live database is Supabase Postgres with a flat, snake_case `products`
 * table (see packages/database/migrations/README.md). This module maps those
 * rows onto the app's `SteelProduct` type and applies catalogue filters.
 *
 * Every read is server-side (this module is imported from server components
 * only), and the anon key is sufficient because the table's RLS policy allows
 * public SELECT.
 */

/** Human labels for the catalogue categories, in display order. */
export const CATEGORY_LABELS: Record<SteelCategory, string> = {
  PROFILE_SHEET: 'Profile / Roofing Sheets',
  GI_SHEET: 'GI Sheets',
  PPGL_COIL: 'PPGL Coils',
  GALVALUME_COIL: 'Galvalume Coils',
  HR_COIL: 'HR Coils',
  CR_COIL: 'CR Coils',
  TMT_BAR: 'TMT Bars',
  ANGLE_CHANNEL: 'Angles & Channels',
};

const CATEGORY_ORDER: SteelCategory[] = [
  'PROFILE_SHEET',
  'GI_SHEET',
  'PPGL_COIL',
  'GALVALUME_COIL',
  'HR_COIL',
  'CR_COIL',
  'TMT_BAR',
  'ANGLE_CHANNEL',
];

/** Raw row shape returned by the `products` table. */
type ProductRow = Database['public']['Tables']['products']['Row'];

const num = (v: number | string | null | undefined, fallback = 0): number => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Narrow the JSONB `specifications` column to a flat key/value record.
 * Non-object values (arrays, scalars) carry no attributes, so they map to `{}`.
 */
function toSpecs(value: Json | null): ProductSpecifications {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: ProductSpecifications = {};
  for (const [key, v] of Object.entries(value)) {
    if (v === null || v === undefined) continue;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[key] = v;
    }
  }
  return out;
}

/** Map a database row onto the app's `SteelProduct` shape. */
function toProduct(row: ProductRow): SteelProduct {
  const specs = toSpecs(row.specifications);
  const yieldStrength = specs.yield_strength_mpa;

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category as SteelCategory,
    thicknessMm: num(row.thickness_mm),
    widthMm: num(row.width_mm),
    lengthMm: row.length_mm === null || row.length_mm === undefined ? undefined : num(row.length_mm),
    coating: (row.coating ?? 'NONE') as SteelProduct['coating'],
    yieldStrengthMpa:
      typeof yieldStrength === 'number' ? yieldStrength : undefined,
    pricePerTonInr: num(row.price_per_ton_inr),
    minimumOrderTons: num(row.minimum_order_tons, 1),
    inventoryTons: num(row.inventory_tons),
    isInStock: row.is_in_stock ?? num(row.inventory_tons) > 0,
    brand: row.brand ?? undefined,
    millName: row.mill_name ?? undefined,
    grade: row.grade ?? undefined,
    hsnCode: row.hsn_code ?? undefined,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    uom: row.uom ?? undefined,
    specifications: specs,
    stockUpdatedAt: row.stock_updated_at ?? undefined,
  };
}

/** Sort comparator factory for client-side ordering of an already-fetched set. */
function comparator(sort: CatalogSort | undefined) {
  switch (sort) {
    case 'price_asc':
      return (a: SteelProduct, b: SteelProduct) => a.pricePerTonInr - b.pricePerTonInr;
    case 'price_desc':
      return (a: SteelProduct, b: SteelProduct) => b.pricePerTonInr - a.pricePerTonInr;
    case 'stock_desc':
      return (a: SteelProduct, b: SteelProduct) => b.inventoryTons - a.inventoryTons;
    case 'name_asc':
      return (a: SteelProduct, b: SteelProduct) => a.name.localeCompare(b.name);
    default:
      return (a: SteelProduct, b: SteelProduct) => a.name.localeCompare(b.name);
  }
}

/**
 * Fetch catalogue products, optionally filtered.
 *
 * Filtering happens in Postgres where possible (category, brand, in-stock)
 * and the free-text search is applied across name, SKU, brand and grade.
 */
export async function getProducts(filters: CatalogFilters = {}): Promise<SteelProduct[]> {
  let query = supabase.from('products').select("*");

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.brand) {
    query = query.eq('brand', filters.brand);
  }
  if (filters.inStockOnly) {
    query = query.eq('is_in_stock', true);
  }
  if (filters.search?.trim()) {
    const term = filters.search.trim();
    // PostgREST `or` syntax: ilike on each searchable text column.
    const escaped = term.replace(/[%,()]/g, ' ');
    query = query.or(
      `name.ilike.%${escaped}%,sku.ilike.%${escaped}%,brand.ilike.%${escaped}%,grade.ilike.%${escaped}%`
    );
  }

  const { data, error } = await query.limit(500);

  if (error) {
    console.error('[catalogService] getProducts failed:', error.message);
    return [];
  }

  const products = (data ?? []).map(toProduct);
  return products.sort(comparator(filters.sort));
}

/** Fetch a single product by its id. */
export async function getProductById(id: string): Promise<SteelProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select("*")
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[catalogService] getProductById failed:', error.message);
    return null;
  }
  return data ? toProduct(data) : null;
}

/** Fetch a single product by its SKU. */
export async function getProductBySku(sku: string): Promise<SteelProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select("*")
    .eq('sku', sku)
    .maybeSingle();

  if (error) {
    console.error('[catalogService] getProductBySku failed:', error.message);
    return null;
  }
  return data ? toProduct(data) : null;
}

/**
 * All catalogue categories with their live product counts and rate bands.
 * Categories with no products are omitted.
 */
export async function getCategories(): Promise<SteelCategoryMeta[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category, price_per_ton_inr, inventory_tons');

  if (error) {
    console.error('[catalogService] getCategories failed:', error.message);
    return [];
  }

  const rows = data ?? [];

  const buckets = new Map<
    SteelCategory,
    { count: number; min: number; max: number; stock: number }
  >();

  for (const row of rows) {
    const code = row.category as SteelCategory;
    const price = num(row.price_per_ton_inr);
    const stock = num(row.inventory_tons);
    const b = buckets.get(code) ?? { count: 0, min: Infinity, max: -Infinity, stock: 0 };
    b.count += 1;
    b.min = Math.min(b.min, price);
    b.max = Math.max(b.max, price);
    b.stock += stock;
    buckets.set(code, b);
  }

  return CATEGORY_ORDER.filter((code) => buckets.has(code)).map((code) => {
    const b = buckets.get(code)!;
    return {
      code,
      label: CATEGORY_LABELS[code] ?? code,
      productCount: b.count,
      minPricePerTonInr: b.min,
      maxPricePerTonInr: b.max,
      totalStockTons: b.stock,
    };
  });
}

/** Distinct brands present in the catalogue, alphabetically. */
export async function getBrands(): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('brand');

  if (error) {
    console.error('[catalogService] getBrands failed:', error.message);
    return [];
  }

  const brands = new Set<string>();
  for (const row of data ?? []) {
    if (row.brand) brands.add(row.brand);
  }
  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

/** Headline numbers for the catalogue. */
export async function getCatalogStats(): Promise<CatalogStats> {
  const { data, error } = await supabase
    .from('products')
    .select('category, brand, price_per_ton_inr, inventory_tons');

  if (error) {
    console.error('[catalogService] getCatalogStats failed:', error.message);
    return {
      totalProducts: 0,
      totalStockTons: 0,
      categoryCount: 0,
      brandCount: 0,
      minPricePerTonInr: 0,
      maxPricePerTonInr: 0,
      averagePricePerTonInr: 0,
    };
  }

  const rows = data ?? [];

  if (rows.length === 0) {
    return {
      totalProducts: 0,
      totalStockTons: 0,
      categoryCount: 0,
      brandCount: 0,
      minPricePerTonInr: 0,
      maxPricePerTonInr: 0,
      averagePricePerTonInr: 0,
    };
  }

  const categories = new Set<string>();
  const brands = new Set<string>();
  let totalStock = 0;
  let min = Infinity;
  let max = -Infinity;
  let weightedSum = 0;
  let weight = 0;

  for (const row of rows) {
    if (row.category) categories.add(row.category);
    if (row.brand) brands.add(row.brand);
    const price = num(row.price_per_ton_inr);
    const stock = num(row.inventory_tons);
    totalStock += stock;
    min = Math.min(min, price);
    max = Math.max(max, price);
    weightedSum += price * stock;
    weight += stock;
  }

  return {
    totalProducts: rows.length,
    totalStockTons: totalStock,
    categoryCount: categories.size,
    brandCount: brands.size,
    minPricePerTonInr: min,
    maxPricePerTonInr: max,
    averagePricePerTonInr: weight > 0 ? weightedSum / weight : 0,
  };
}

/**
 * A small set of featured SKUs for the homepage.
 * Falls back to the highest-priced in-stock items when no product is flagged.
 */
export async function getFeaturedProducts(limit = 6): Promise<SteelProduct[]> {
  const all = await getProducts({ inStockOnly: true, sort: 'name_asc' });
  return all.slice(0, limit);
}
