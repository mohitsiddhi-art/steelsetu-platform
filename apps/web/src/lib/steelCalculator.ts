/**
 * Steel density constant: 7.85 g/cm3 (0.00785 kg/mm/m2)
 */
export const STEEL_DENSITY = 7.85;

/**
 * Calculates theoretical weight of a single flat sheet in kilograms.
 * @param thicknessMm Thickness in mm (e.g. 0.50)
 * @param widthMm Width in mm (e.g. 1060)
 * @param lengthMm Length in mm (e.g. 2440)
 */
export function calculateSheetWeightKg(thicknessMm: number, widthMm: number, lengthMm: number): number {
  const volumeM3 = (thicknessMm / 1000) * (widthMm / 1000) * (lengthMm / 1000);
  return volumeM3 * STEEL_DENSITY * 1000;
}

/**
 * Calculates total tonnage from piece count.
 */
export function calculateTonnage(weightPerPieceKg: number, pieces: number): number {
  return Number(((weightPerPieceKg * pieces) / 1000).toFixed(3));
}

/**
 * Estimates basic freight per ton based on distance band (INR).
 */
export function estimateFreightPerTon(distanceKm: number): number {
  if (distanceKm <= 100) return 650;
  if (distanceKm <= 300) return 1400;
  if (distanceKm <= 600) return 2200;
  return 3400;
}
