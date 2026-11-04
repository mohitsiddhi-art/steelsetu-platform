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
 * Includes MOCK_PRODUCTS fallback so roofing accessories & fasteners are
 * immediately available offline or prior to full database seeding.
 */

export const CATEGORY_LABELS: Record<SteelCategory, string> = {
  PROFILE_SHEET: 'Profile / Roofing Sheets',
  GI_SHEET: 'GI Sheets',
  PPGL_COIL: 'PPGL Coils',
  GALVALUME_COIL: 'Galvalume Coils',
  HR_COIL: 'HR Coils',
  CR_COIL: 'CR Coils',
  TMT_BAR: 'TMT Bars',
  ANGLE_CHANNEL: 'Angles & Channels',
  ROOFING_ACCESSORY: 'Roofing Accessories & Fasteners',
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
  'ROOFING_ACCESSORY',
];

const MOCK_PRODUCTS: SteelProduct[] = [
  // 1. Mount SDS Screws 12x55
  {
    id: 'acc-mount-sds-12x55',
    sku: 'ACC-MOUNT-SDS-12x55',
    name: 'Mount Self-Drilling Screws (SDS) 12x55mm with EPDM Washer',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 5.5,
    widthMm: 12,
    lengthMm: 55,
    coating: 'CUSTOM',
    pricePerTonInr: 1420,
    minimumOrderTons: 1,
    inventoryTons: 600,
    isInStock: true,
    brand: 'Mount',
    millName: 'Mount Fasteners & Hardware',
    grade: 'Class 3 Anti-Corrosion',
    hsnCode: '7318.14',
    description: 'Mount Self-Drilling Screws (SDS) 12x55mm with EPDM Washer — Box of 1,000 pcs for secure roofing sheet installation.',
    uom: 'Box',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 2. Mount SDS Screws 12x25
  {
    id: 'acc-mount-sds-12x25',
    sku: 'ACC-MOUNT-SDS-12x25',
    name: 'Mount Self-Drilling Screws (SDS) 12x25mm for Stitching',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 5.5,
    widthMm: 12,
    lengthMm: 25,
    coating: 'CUSTOM',
    pricePerTonInr: 1180,
    minimumOrderTons: 1,
    inventoryTons: 750,
    isInStock: true,
    brand: 'Mount',
    millName: 'Mount Fasteners & Hardware',
    grade: 'Class 3 Anti-Corrosion',
    hsnCode: '7318.14',
    description: 'Mount Self-Drilling Screws (SDS) 12x25mm for lap stitching and accessory fastening — Box of 1,000 pcs.',
    uom: 'Box',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 3. PPGL Plain Ridge Flashing
  {
    id: 'acc-ppgl-ridge-050',
    sku: 'ACC-PPGL-RIDGE-050',
    name: 'PPGL Plain Ridge Flashing (0.50mm / 8ft length)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 0.5,
    widthMm: 300,
    lengthMm: 2440,
    coating: 'AZ150',
    pricePerTonInr: 320,
    minimumOrderTons: 10,
    inventoryTons: 350,
    isInStock: true,
    brand: 'Tata Steel / JSW',
    millName: 'Tata Steel Kalinganagar',
    grade: 'IS 277',
    hsnCode: '7210.41',
    description: 'PPGL Plain Ridge Flashing (0.50mm / 8ft length) color matched for apex roof sealing.',
    uom: 'Pc',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 4. GI Plain Ridge
  {
    id: 'acc-gi-plain-ridge',
    sku: 'ACC-GI-PLAIN-RIDGE',
    name: 'Galvanized (GI) Plain Ridge (0.45mm / 8ft length)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 0.45,
    widthMm: 300,
    lengthMm: 2440,
    coating: '120GSM',
    pricePerTonInr: 260,
    minimumOrderTons: 10,
    inventoryTons: 400,
    isInStock: true,
    brand: 'Local Mandi Rolling',
    millName: 'Burrabazar Local Rolling',
    grade: 'IS 277',
    hsnCode: '7210.41',
    description: 'Galvanized (GI) Plain Ridge (0.45mm / 8ft length) economical ridge capping.',
    uom: 'Pc',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 5. PPGL Rainwater Donga / Valley Gutter
  {
    id: 'acc-ppgl-donga-gutter',
    sku: 'ACC-PPGL-DONGA-VALLEY',
    name: 'PPGL Rainwater Donga / Valley Gutter (Custom Girth / 0.50mm)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 0.5,
    widthMm: 450,
    lengthMm: 3000,
    coating: 'AZ150',
    pricePerTonInr: 410,
    minimumOrderTons: 5,
    inventoryTons: 280,
    isInStock: true,
    brand: 'Singhi Fabricators',
    millName: 'Singhi Sheet Metal Works',
    grade: 'IS 277',
    hsnCode: '7210.41',
    description: 'PPGL Rainwater Donga / Valley Gutter (Custom Girth / 0.50mm) for industrial drainage.',
    uom: 'Pc',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 6. PPGL Corner / Gable Flashing
  {
    id: 'acc-ppgl-corner-gable',
    sku: 'ACC-PPGL-CORNER-GABLE',
    name: 'PPGL Corner / Gable Flashing (8ft length)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 0.5,
    widthMm: 300,
    lengthMm: 2440,
    coating: 'AZ150',
    pricePerTonInr: 290,
    minimumOrderTons: 5,
    inventoryTons: 220,
    isInStock: true,
    brand: 'Singhi Fabricators',
    millName: 'Singhi Sheet Metal Works',
    grade: 'IS 277',
    hsnCode: '7210.41',
    description: 'PPGL Corner / Gable Flashing (8ft length) for clean building side termination.',
    uom: 'Pc',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 7. FRP Corrugated Daylight Sheet
  {
    id: 'acc-frp-daylight',
    sku: 'ACC-FRP-CORR-DAYLIGHT',
    name: 'FRP Corrugated Daylight Profile Sheet (1.5mm UV Coated)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 1.5,
    widthMm: 1060,
    lengthMm: 3000,
    coating: 'NONE',
    pricePerTonInr: 165,
    minimumOrderTons: 5,
    inventoryTons: 180,
    isInStock: true,
    brand: 'FibreTech',
    millName: 'FibreTech Polymers',
    grade: 'UV Stabilized FRP',
    hsnCode: '3921.90',
    description: 'FRP Corrugated Daylight Profile Sheet (1.5mm UV Coated) for translucent roof lighting.',
    uom: 'Running Ft',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 8. Polycarbonate Multiwall / Profile Sheet
  {
    id: 'acc-poly-multiwall',
    sku: 'ACC-POLY-MULTIWALL-20',
    name: 'Polycarbonate Multiwall / Profile Sheet (2.0mm Clear Embossed)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 2.0,
    widthMm: 1220,
    lengthMm: 3660,
    coating: 'NONE',
    pricePerTonInr: 880,
    minimumOrderTons: 3,
    inventoryTons: 140,
    isInStock: true,
    brand: 'Palram',
    millName: 'Polycarb Extrusion Works',
    grade: 'Clear Embossed UV Protected',
    hsnCode: '3920.61',
    description: 'Polycarbonate Multiwall / Profile Sheet (2.0mm Clear Embossed) with superior impact resistance.',
    uom: 'Running Ft',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 9. PUF Insulated Roofing Panel
  {
    id: 'prod-puf-panel',
    sku: 'PROD-PUF-ROOF-PANEL',
    name: 'PUF Insulated Roofing Panel / Sandwich Sheet (30mm/50mm Core)',
    category: 'PROFILE_SHEET',
    thicknessMm: 50,
    widthMm: 1000,
    lengthMm: 6000,
    coating: 'AZ150',
    pricePerTonInr: 1150,
    minimumOrderTons: 5,
    inventoryTons: 110,
    isInStock: true,
    brand: 'Jindal Mectec',
    millName: 'Jindal Mectec Sandwich Panels',
    grade: 'PUR / PIR 40kg/m3',
    hsnCode: '7308.90',
    description: 'PUF Insulated Roofing Panel / Sandwich Sheet (30mm/50mm Core) for thermal insulation in PEB warehouses.',
    uom: 'Sq Mtr',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 10. Industrial Rolling Shutter Patti / Slats
  {
    id: 'prod-shutter-patti',
    sku: 'CR-SHUTTER-PATTI-18G',
    name: 'Industrial Rolling Shutter Patti / Slats (18G / 20G Cold Rolled)',
    category: 'CR_COIL',
    thicknessMm: 1.2,
    widthMm: 75,
    lengthMm: 3000,
    coating: 'NONE',
    pricePerTonInr: 68,
    minimumOrderTons: 2,
    inventoryTons: 320,
    isInStock: true,
    brand: 'Burrabazar Local Rolling',
    millName: 'Burrabazar Shutter Mills',
    grade: 'IS 513 CR',
    hsnCode: '7308.30',
    description: 'Industrial Rolling Shutter Patti / Slats (18G / 20G Cold Rolled) for commercial storefronts.',
    uom: 'Kg',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 11. 24-Inch Wind Turbo Ventilator
  {
    id: 'acc-turbo-vent-24',
    sku: 'ACC-TURBO-VENT-24',
    name: '24-Inch Wind Turbo Ventilator with Aluminum Base',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 1.2,
    widthMm: 600,
    lengthMm: 600,
    coating: 'CUSTOM',
    pricePerTonInr: 3850,
    minimumOrderTons: 2,
    inventoryTons: 95,
    isInStock: true,
    brand: 'Aeroflow',
    millName: 'Ventilation Dynamics',
    grade: 'Aluminum / Stainless Bearings',
    hsnCode: '8414.59',
    description: '24-Inch Wind Turbo Ventilator with Aluminum Base. Zero electricity roof ventilation.',
    uom: 'Unit',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // 12. Galvanized GI Binding Wire
  {
    id: 'acc-gi-binding-wire',
    sku: 'ACC-GI-BINDING-WIRE',
    name: 'Galvanized GI Binding Wire (20G Soft Annealed)',
    category: 'ROOFING_ACCESSORY',
    thicknessMm: 1.2,
    widthMm: 0,
    lengthMm: 0,
    coating: '120GSM',
    pricePerTonInr: 74,
    minimumOrderTons: 25,
    inventoryTons: 450,
    isInStock: true,
    brand: 'Tata Wiron',
    millName: 'Tata Steel Wire Division',
    grade: 'Soft Annealed',
    hsnCode: '7217.20',
    description: 'Galvanized GI Binding Wire (20G Soft Annealed, 25kg bundles) for rebar tying.',
    uom: 'Kg',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  // Standard profile sheet
  {
    id: 'prod-ppgl-050-blu',
    sku: 'PPGL-050-AZ150-BLU',
    name: 'PPGL Profile Sheet 0.50mm AZ150 (Castle Blue)',
    category: 'PROFILE_SHEET',
    thicknessMm: 0.5,
    widthMm: 1060,
    lengthMm: 3660,
    coating: 'AZ150',
    pricePerTonInr: 78500,
    minimumOrderTons: 2.5,
    inventoryTons: 45,
    isInStock: true,
    brand: 'Tata Steel',
    millName: 'Tata Steel Kalinganagar',
    grade: 'IS 277',
    hsnCode: '7210.41',
    description: 'Pre-painted galvalume profiled roofing sheet in Castle Blue.',
    uom: 'MT',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  },
  {
    id: 'prod-tmt-012',
    sku: 'TMT-012-FE500D',
    name: 'TMT Bar 12mm IS 1786 Fe500D',
    category: 'TMT_BAR',
    thicknessMm: 12,
    widthMm: 12,
    lengthMm: 12000,
    coating: 'NONE',
    pricePerTonInr: 59000,
    minimumOrderTons: 10,
    inventoryTons: 165,
    isInStock: true,
    brand: 'Tata Steel',
    millName: 'Tata Steel Jamshedpur',
    grade: 'IS 1786 Fe500D',
    hsnCode: '7214.20',
    description: 'High-strength TMT reinforcement bar with ductility class D.',
    uom: 'MT',
    city: 'Kolkata',
    supplierName: 'Singhi Enterprises — Burrabazar',
    isFeatured: true,
    isVerified: true,
  }
];

type ProductRow = Database['public']['Tables']['products']['Row'];

const num = (v: number | string | null | undefined, fallback = 0): number => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

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
    brandId: row.brand_id ?? undefined,
    city: row.city ?? undefined,
    supplierName: row.supplier_name ?? undefined,
    colour: row.colour ?? undefined,
    isFeatured: row.is_featured,
    isVerified: row.is_verified,
    priceRangeMinPerTonInr:
      row.price_range_min_per_ton_inr === null ||
      row.price_range_min_per_ton_inr === undefined
        ? undefined
        : num(row.price_range_min_per_ton_inr),
    priceRangeMaxPerTonInr:
      row.price_range_max_per_ton_inr === null ||
      row.price_range_max_per_ton_inr === undefined
        ? undefined
        : num(row.price_range_max_per_ton_inr),
    leadTimeDays:
      row.lead_time_days === null || row.lead_time_days === undefined
        ? undefined
        : num(row.lead_time_days),
  };
}

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

export async function getProducts(filters: CatalogFilters = {}): Promise<SteelProduct[]> {
  let dbProducts: SteelProduct[] = [];
  const { data, error } = await supabase.from('products').select('*').limit(500);
  if (!error && data && data.length > 0) {
    dbProducts = data.map(toProduct);
  }

  const map = new Map<string, SteelProduct>();
  for (const p of MOCK_PRODUCTS) {
    map.set(p.sku, p);
  }
  for (const p of dbProducts) {
    map.set(p.sku, p);
  }
  const allProducts = Array.from(map.values());

  let filtered = allProducts.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.inStockOnly && !p.isInStock) return false;
    if (filters.search?.trim()) {
      const terms = filters.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const matchesAll = terms.every((term) => {
        const matchName = p.name.toLowerCase().includes(term);
        const matchSku = p.sku.toLowerCase().includes(term);
        const matchBrand = (p.brand ?? '').toLowerCase().includes(term);
        const matchCategory = p.category.toLowerCase().includes(term);
        const matchGrade = (p.grade ?? '').toLowerCase().includes(term);
        return matchName || matchSku || matchBrand || matchCategory || matchGrade;
      });
      if (!matchesAll) return false;
    }
    return true;
  });

  return filtered.sort(comparator(filters.sort));
}

export async function getProductById(id: string): Promise<SteelProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!error && data) {
    return toProduct(data);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

export async function getProductBySku(sku: string): Promise<SteelProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sku', sku)
    .maybeSingle();

  if (!error && data) {
    return toProduct(data);
  }
  return MOCK_PRODUCTS.find((p) => p.sku === sku) || null;
}

export async function getCategories(): Promise<SteelCategoryMeta[]> {
  const all = await getProducts({});
  const buckets = new Map<
    SteelCategory,
    { count: number; min: number; max: number; stock: number }
  >();

  for (const p of all) {
    const code = p.category;
    const price = p.pricePerTonInr;
    const stock = p.inventoryTons;
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

export async function getBrands(): Promise<string[]> {
  const all = await getProducts({});
  const brands = new Set<string>();
  for (const p of all) {
    if (p.brand) brands.add(p.brand);
  }
  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

export async function getCatalogStats(): Promise<CatalogStats> {
  const all = await getProducts({});
  if (all.length === 0) {
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

  for (const p of all) {
    categories.add(p.category);
    if (p.brand) brands.add(p.brand);
    totalStock += p.inventoryTons;
    min = Math.min(min, p.pricePerTonInr);
    max = Math.max(max, p.pricePerTonInr);
    weightedSum += p.pricePerTonInr * p.inventoryTons;
    weight += p.inventoryTons;
  }

  return {
    totalProducts: all.length,
    totalStockTons: totalStock,
    categoryCount: categories.size,
    brandCount: brands.size,
    minPricePerTonInr: min,
    maxPricePerTonInr: max,
    averagePricePerTonInr: weight > 0 ? weightedSum / weight : 0,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<SteelProduct[]> {
  const all = await getProducts({ inStockOnly: true });
  const featured = all.filter((p) => p.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const seen = new Set(featured.map((p) => p.id));
  const extras = all.filter((p) => !seen.has(p.id)).slice(0, limit - featured.length);

  return [...featured, ...extras];
}
