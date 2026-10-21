export type SteelCategory =
  | 'GI_SHEET'       // Galvanized Iron
  | 'PPGL_COIL'      // Pre-Painted Galvalume
  | 'HR_COIL'        // Hot Rolled
  | 'CR_COIL'        // Cold Rolled
  | 'PROFILE_SHEET'  // Roofing / Cladding
  | 'GALVALUME_COIL' // Bare Galvalume
  | 'TMT_BAR'        // Reinforcement bars
  | 'ANGLE_CHANNEL'; // Structural sections

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
