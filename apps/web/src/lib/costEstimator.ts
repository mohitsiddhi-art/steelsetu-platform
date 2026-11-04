import { SteelProduct } from '@/types/steel';
import { calculateSheetWeightKg, calculateShapeWeight } from '@/lib/steelCalculator';

export interface SteelCategory {
  id: string;
  label: string;
  basePricePerTon: number;
  grades: { id: string; label: string; premium: number }[];
}

export interface CityOption {
  id: string;
  label: string;
  state: string;
  freightMultiplier: number;
  factor: number;
  distanceKm: number;
}

export const CATEGORIES: SteelCategory[] = [
  {
    id: 'tmt',
    label: 'TMT Rebars (Fe 500D / 550D)',
    basePricePerTon: 58000,
    grades: [
      { id: 'fe500d', label: 'Fe 500D (Standard High Ductility)', premium: 0 },
      { id: 'fe550d', label: 'Fe 550D (High Rise & Heavy Load)', premium: 2500 },
      { id: 'fe600', label: 'Fe 600 (Ultra High Strength)', premium: 5000 },
    ],
  },
  {
    id: 'structurals',
    label: 'Structural Steel (Angles, Channels, Beams)',
    basePricePerTon: 54000,
    grades: [
      { id: 'e250', label: 'IS 2062 E250 (Standard Commercial)', premium: 0 },
      { id: 'e350', label: 'IS 2062 E350 (High Tensile)', premium: 3000 },
    ],
  },
  {
    id: 'sheets_coils',
    label: 'HR Coils, GP & PPGL Sheets',
    basePricePerTon: 62000,
    grades: [
      { id: 'is513_gp', label: 'GP Sheet / Coil (120 GSM)', premium: 0 },
      { id: 'ppgl_az150', label: 'PPGL Colour Coated (AZ-150)', premium: 12000 },
      { id: 'hr_coil', label: 'HR Coil IS 2062', premium: -2000 },
    ],
  },
  {
    id: 'pipes',
    label: 'GI & ERW Black Steel Pipes',
    basePricePerTon: 64000,
    grades: [
      { id: 'medium_gi', label: 'Medium Class GI Pipe (IS 1239)', premium: 0 },
      { id: 'heavy_gi', label: 'Heavy Class GI Pipe', premium: 4000 },
      { id: 'erw_black', label: 'ERW Black Steel Pipe', premium: -3000 },
    ],
  },
];

export const CITIES: CityOption[] = [
  { id: 'kolkata', label: 'Kolkata', state: 'West Bengal', freightMultiplier: 1.0, factor: 1.0, distanceKm: 0 },
  { id: 'patna', label: 'Patna', state: 'Bihar', freightMultiplier: 1.05, factor: 1.05, distanceKm: 600 },
  { id: 'ranchi', label: 'Ranchi', state: 'Jharkhand', freightMultiplier: 1.03, factor: 1.03, distanceKm: 410 },
  { id: 'bhubaneswar', label: 'Bhubaneswar', state: 'Odisha', freightMultiplier: 1.04, factor: 1.04, distanceKm: 440 },
  { id: 'guwahati', label: 'Guwahati', state: 'Assam', freightMultiplier: 1.08, factor: 1.08, distanceKm: 1000 },
  { id: 'siliguri', label: 'Siliguri', state: 'West Bengal', freightMultiplier: 1.02, factor: 1.02, distanceKm: 560 },
];

export function getCategory(id: string): SteelCategory {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

export function getCity(id: string): CityOption {
  return CITIES.find((c) => c.id === id) || CITIES[0];
}

export function getGrade(category: SteelCategory, gradeId: string) {
  return category.grades.find((g) => g.id === gradeId) || category.grades[0];
}

export function tonnageFromArea(areaSqFt: number, rule: { minKgPerSqFt: number; maxKgPerSqFt: number }) {
  const minKg = areaSqFt * rule.minKgPerSqFt;
  const maxKg = areaSqFt * rule.maxKgPerSqFt;
  const midKg = (minKg + maxKg) / 2;
  return {
    minTons: Number((minKg / 1000).toFixed(1)),
    maxTons: Number((maxKg / 1000).toFixed(1)),
    midTons: Number((midKg / 1000).toFixed(1)),
  };
}

export interface EstimateParams {
  categoryId: string;
  gradeId: string;
  cityId: string;
  tons: number;
  thumbRuleId?: string | null;
  areaSqFt?: number;
}

export interface EstimateResult {
  lowTotal: number;
  highTotal: number;
  totalTons: number;
  lowPerTon: number;
  highPerTon: number;
  baseRatePerTon: number;
  freightPerTon: number;
  freightTotal: number;
  estimatedTotalInr: number;
  perTonRateInr: number;
  gstInr: number;
  grandTotalInr: number;
}

export function estimateCost(params: EstimateParams): EstimateResult {
  const cat = getCategory(params.categoryId);
  const grade = getGrade(cat, params.gradeId);
  const city = getCity(params.cityId);

  const baseRatePerTon = cat.basePricePerTon + grade.premium;
  const freightPerTon = Math.round(1200 * city.freightMultiplier);
  const perTonRate = baseRatePerTon + freightPerTon;

  const lowPerTon = Math.round(perTonRate * 0.96);
  const highPerTon = Math.round(perTonRate * 1.04);

  const totalTons = params.tons;
  const lowTotal = Math.round(lowPerTon * totalTons);
  const highTotal = Math.round(highPerTon * totalTons);
  const freightTotal = Math.round(freightPerTon * totalTons);

  const subtotal = perTonRate * totalTons;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = Math.round(subtotal + gst);

  return {
    lowTotal,
    highTotal,
    totalTons,
    lowPerTon,
    highPerTon,
    baseRatePerTon,
    freightPerTon,
    freightTotal,
    estimatedTotalInr: Math.round(subtotal),
    perTonRateInr: Math.round(perTonRate),
    gstInr: gst,
    grandTotalInr: grandTotal,
  };
}

export function getApproxWeightPerPiece(product: SteelProduct): { value: number; unit: string } {
  const t = product.thicknessMm || 0.5;
  const w = product.widthMm || 1200;
  const l = product.lengthMm || (product.category === 'PROFILE_SHEET' ? 3000 : 6000);

  if (
    product.category === 'PROFILE_SHEET' ||
    product.category === 'GI_SHEET' ||
    product.category === 'GALVALUME_COIL' ||
    product.category === 'PPGL_COIL'
  ) {
    const kg = calculateSheetWeightKg(t, w, l);
    return { value: Number(kg.toFixed(2)), unit: 'kg/sheet' };
  }

  if (product.category === 'ANGLE_CHANNEL') {
    const weightPerMtr = t * (w + (product.specifications?.legB ? Number(product.specifications.legB) : w) - t) * 0.00785;
    return { value: Number((weightPerMtr * 6).toFixed(2)), unit: 'kg/6m length' };
  }

  if (product.category === 'TMT_BAR') {
    const dia = product.thicknessMm || 12;
    const weightPerMtr = (dia * dia) / 162.2;
    return { value: Number((weightPerMtr * 12).toFixed(2)), unit: 'kg/12m length' };
  }

  const fallbackKg = calculateSheetWeightKg(t, w, l);
  return { value: Number(fallbackKg.toFixed(2)), unit: 'kg/unit' };
}
