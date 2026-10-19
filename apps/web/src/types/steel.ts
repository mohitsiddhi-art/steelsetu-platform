export type SteelCategory = 
  | 'GI_SHEET'       // Galvanized Iron
  | 'PPGL_COIL'      // Pre-Painted Galvalume
  | 'HR_COIL'        // Hot Rolled
  | 'CR_COIL'        // Cold Rolled
  | 'PROFILE_SHEET'; // Roofing / Cladding

export type CoatingStandard = 'AZ70' | 'AZ150' | '120GSM' | '275GSM' | 'CUSTOM';

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
