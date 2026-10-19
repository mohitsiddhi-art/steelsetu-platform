import { SteelProduct } from '@/types/steel';

export const INITIAL_STEEL_CATALOG: SteelProduct[] = [
  {
    id: 'prod-001',
    sku: 'PPGL-050-AZ150-BLU',
    name: 'PPGL Profile Sheet (Castle Blue)',
    category: 'PROFILE_SHEET',
    thicknessMm: 0.50,
    widthMm: 1060,
    lengthMm: 3660,
    coating: 'AZ150',
    pricePerTonInr: 78500,
    minimumOrderTons: 2.5,
    inventoryTons: 45.0,
    isInStock: true,
  },
  {
    id: 'prod-002',
    sku: 'GI-040-120GSM-REG',
    name: 'GI Corrugated Sheet 120 GSM',
    category: 'GI_SHEET',
    thicknessMm: 0.40,
    widthMm: 910,
    lengthMm: 2440,
    coating: '120GSM',
    pricePerTonInr: 74200,
    minimumOrderTons: 5.0,
    inventoryTons: 82.0,
    isInStock: true,
  },
  {
    id: 'prod-003',
    sku: 'GL-COIL-045-AZ70',
    name: 'Galvalume Steel Coil Bare AZ70',
    category: 'PPGL_COIL',
    thicknessMm: 0.45,
    widthMm: 1220,
    coating: 'AZ70',
    pricePerTonInr: 71000,
    minimumOrderTons: 10.0,
    inventoryTons: 120.0,
    isInStock: true,
  },
];

export async function getFeaturedProducts(): Promise<SteelProduct[]> {
  return INITIAL_STEEL_CATALOG;
}
