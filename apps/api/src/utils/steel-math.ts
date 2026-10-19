/**
 * Steelsetu Core Mathematical Engine (PRD Section 4)
 */
export const STEEL_DENSITY = 7.85;

export function calculatePlainSheetWeightKg(
  lengthMeters: number,
  widthMeters: number,
  thicknessMm: number
): number {
  return Number((lengthMeters * widthMeters * thicknessMm * STEEL_DENSITY).toFixed(3));
}

export function calculateCorrugatedWeightKg(
  plainWeightKg: number,
  pitchFactor: number = 0.06
): number {
  return Number((plainWeightKg * (1 + pitchFactor)).toFixed(3));
}

export function calculateLineItemTotal(
  quantityKg: number,
  basePricePerKg: number,
  pieceCount: number,
  labourChargePerPiece: number,
  gstPercentage: number = 18
) {
  const materialCost = quantityKg * basePricePerKg;
  const labourCost = pieceCount * labourChargePerPiece;
  const taxableValue = materialCost + labourCost;
  const gstAmount = taxableValue * (gstPercentage / 100);
  const grandTotal = taxableValue + gstAmount;

  return {
    materialCost: Number(materialCost.toFixed(2)),
    labourCost: Number(labourCost.toFixed(2)),
    taxableValue: Number(taxableValue.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}
