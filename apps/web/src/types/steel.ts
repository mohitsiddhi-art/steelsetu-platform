export type SteelCategory =
  | 'GI_SHEET'       // Galvanized Iron
  | 'PPGL_COIL'      // Pre-Painted Galvalume
  | 'HR_COIL'        // Hot Rolled
  | 'CR_COIL'        // Cold Rolled
  | 'PROFILE_SHEET'  // Roofing / Cladding
  | 'GALVALUME_COIL' // Bare Galvalume
  | 'TMT_BAR'        // Reinforcement bars
  | 'ANGLE_CHANNEL'  // Structural sections
  | 'ROOFING_ACCESSORY'; // Roofing Accessories & Fasteners

export type CoatingStandard = 'AZ70' | 'AZ150' | '120GSM' | '275GSM' | '80GSM' | 'NONE' | 'CUSTOM';

/** Free-form catalogue attributes, stored as JSONB on the `products` table. */
export type ProductSpecifications = Record<string, string | number | boolean>;

export interface SteelProduct {
  id: string;
  sku: string;
  name: string;
  category: SteelCategory;
  thicknessMm: number;    // e.g., 0.35 - 2.0 mm
  widthMm: number;        // e.g., 900 - 1250 mm
  lengthMm?: number;      // Optional for coils, mandatory for cut sheets
  coating: CoatingStandard;
  yieldStrengthMpa?: number;
  pricePerTonInr: number;
  minimumOrderTons: number;
  inventoryTons: number;
  isInStock: boolean;

  // --- Catalogue metadata (added 2026-10-20) ---
  brand?: string;
  millName?: string;
  grade?: string;
  hsnCode?: string;
  description?: string;
  imageUrl?: string;
  uom?: string;
  specifications?: ProductSpecifications;
  stockUpdatedAt?: string;

  // --- Platform layer (added 2026-10-21, migration 003) ---
  /** FK to the `brands` directory row. */
  brandId?: string;
  /** Dispatch city, e.g. "Jamshedpur" / "Howrah". */
  city?: string;
  /** The supplier behind this SKU, e.g. "Tata Steel — Jamshedpur Works". */
  supplierName?: string;
  /** Surface colour, e.g. "Grey" / "Bare Galvalume" / "Blue". */
  colour?: string;
  /** True when the SKU is promoted on the homepage showcase. */
  isFeatured?: boolean;
  /** True when the listing has been verified by the Steelsetu desk. */
  isVerified?: boolean;
  /** Low end of the indicative per-ton band, in rupees. */
  priceRangeMinPerTonInr?: number;
  /** High end of the indicative per-ton band, in rupees. */
  priceRangeMaxPerTonInr?: number;
  /** Indicative dispatch lead time, in days. */
  leadTimeDays?: number;
}

/** A product category plus its live catalogue count. */
export interface SteelCategoryMeta {
  code: SteelCategory;
  label: string;
  productCount: number;
  minPricePerTonInr: number;
  maxPricePerTonInr: number;
  totalStockTons: number;
}

export interface TradeInquiry {
  id: string;
  buyerName: string;
  companyName: string;
  gstNumber: string;
  productId: string;
  requestedQuantityTons: number;
  deliveryPincode: string;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
}

/** Filters accepted by the /products catalogue page. */
export interface CatalogFilters {
  category?: SteelCategory;
  brand?: string;
  search?: string;
  inStockOnly?: boolean;
  sort?: CatalogSort;
}

export type CatalogSort = 'price_asc' | 'price_desc' | 'stock_desc' | 'name_asc';

export interface CatalogStats {
  totalProducts: number;
  totalStockTons: number;
  categoryCount: number;
  brandCount: number;
  minPricePerTonInr: number;
  maxPricePerTonInr: number;
  /** Volume-weighted average rate across the whole catalogue. */
  averagePricePerTonInr: number;
}
