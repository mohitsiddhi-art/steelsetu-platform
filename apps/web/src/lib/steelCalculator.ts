/**
 * Steel density constant: 7.85 g/cm3 (0.00785 kg/mm/m2)
 */
export const STEEL_DENSITY = 7.85;

/**
 * Section-weight divisor for a round bar — IS 1786.
 *
 * `kg/m = d² / 162.2`, with `d` in millimetres. A 12 mm bar therefore
 * weighs 0.888 kg/m, and a 12 m length weighs 10.66 kg.
 */
export const ROUND_BAR_DIVISOR = 162.2;

/**
 * kg per mm² per metre.
 *
 * 1 mm² of section running one metre is 1,000 mm³ = 1 cm³ of steel, which
 * weighs 7.85 g = 0.00785 kg.
 */
const AREA_TO_KG_PER_M = 0.00785;

/**
 * kg per mm² per metre of pipe wall.
 *
 * `W = (OD − t) × t × 0.02466`, with both dimensions in millimetres. The
 * factor is `π × density / 1000` — the wall section is a ring, not a solid.
 */
const PIPE_WALL_FACTOR = 0.02466;

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

// ===========================================================================
// Shape weight calculator — IS 1786 / IS 808 section formulae
// ===========================================================================

export type ShapeId =
  | 'round_tmt'
  | 'square_bar'
  | 'pipe'
  | 'angle'
  | 'channel'
  | 'ibeam'
  | 'plate';

export interface ShapeField {
  key: string;
  label: string;
  unit: string;
  defaultValue: number;
  min: number;
  step: number;
  /** Shown under the field — the trade rule behind the number. */
  hint?: string;
}

export interface ShapeDefinition {
  id: ShapeId;
  label: string;
  /** The Indian Standard the section weight follows. */
  standard: string;
  /**
   * `metre` — the formula returns kg per metre of section, and the length
   * field is in metres. `piece` — the formula returns kg for one sheet, and
   * the quantity field counts sheets.
   */
  per: 'metre' | 'piece';
  /** Label of the per-unit weight — "kg/m" or "kg/sheet". */
  unitWeightLabel: string;
  /** The formula, shown to the user so the number is never a black box. */
  formula: string;
  fields: ShapeField[];
  /** Weight in kilograms of one unit (one metre of section, or one sheet). */
  unitWeightKg: (values: Record<string, number>) => number;
  /** A one-line spec summary, reused in the WhatsApp enquiry message. */
  specSummary: (values: Record<string, number>) => string;
}

const round = (value: number, places = 3): number => {
  const f = 10 ** places;
  return Math.round(value * f) / f;
};

/**
 * Every shape the weight calculator supports.
 *
 * The section weights follow the trade's own tables: bar weights are quoted
 * to three decimals of a kilogram per metre, so the per-metre figure is
 * rounded before it is multiplied by the length. That is why 12 mm TMT over
 * 12 m comes out at 10.66 kg and not 10.65 kg.
 */
export const SHAPES: ShapeDefinition[] = [
  {
    id: 'round_tmt',
    label: 'Round TMT Bar',
    standard: 'IS 1786',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = d² / 162.2',
    fields: [
      {
        key: 'diameter',
        label: 'Diameter',
        unit: 'mm',
        defaultValue: 12,
        min: 6,
        step: 1,
        hint: '8 · 10 · 12 · 16 · 20 · 25 · 32 mm',
      },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 12, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) => (v.diameter * v.diameter) / ROUND_BAR_DIVISOR,
    specSummary: (v) => `${v.diameter} mm TMT bar × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'square_bar',
    label: 'Square Bar',
    standard: 'IS 1786',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = a² / 162.2',
    fields: [
      { key: 'side', label: 'Side', unit: 'mm', defaultValue: 16, min: 6, step: 1 },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 6, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) => (v.side * v.side) / ROUND_BAR_DIVISOR,
    specSummary: (v) => `${v.side} mm square bar × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'pipe',
    label: 'MS Pipe',
    standard: 'IS 1239',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = (OD − t) × t × 0.02466',
    fields: [
      { key: 'od', label: 'Outer Diameter', unit: 'mm', defaultValue: 114.3, min: 10, step: 0.1 },
      { key: 'wall', label: 'Wall Thickness', unit: 'mm', defaultValue: 4.9, min: 0.5, step: 0.1 },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 6, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) => (v.od - v.wall) * v.wall * PIPE_WALL_FACTOR,
    specSummary: (v) =>
      `MS pipe ${v.od} mm OD × ${v.wall} mm wall × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'angle',
    label: 'MS Angle',
    standard: 'IS 808',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = t × (a + b − t) × 0.00785',
    fields: [
      { key: 'legA', label: 'Leg A', unit: 'mm', defaultValue: 50, min: 10, step: 1 },
      { key: 'legB', label: 'Leg B', unit: 'mm', defaultValue: 50, min: 10, step: 1 },
      { key: 'thickness', label: 'Thickness', unit: 'mm', defaultValue: 6, min: 1, step: 0.5 },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 6, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) => v.thickness * (v.legA + v.legB - v.thickness) * AREA_TO_KG_PER_M,
    specSummary: (v) =>
      `MS angle ${v.legA}×${v.legB}×${v.thickness} mm × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'channel',
    label: 'MS Channel',
    standard: 'IS 808',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = [tw × (h − 2·tf) + 2 × b × tf] × 0.00785',
    fields: [
      { key: 'depth', label: 'Depth (h)', unit: 'mm', defaultValue: 200, min: 40, step: 5 },
      { key: 'flange', label: 'Flange Width (b)', unit: 'mm', defaultValue: 75, min: 20, step: 5 },
      { key: 'web', label: 'Web Thickness (tw)', unit: 'mm', defaultValue: 8, min: 2, step: 0.5 },
      { key: 'flangeT', label: 'Flange Thickness (tf)', unit: 'mm', defaultValue: 12, min: 2, step: 0.5 },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 6, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) =>
      (v.web * (v.depth - 2 * v.flangeT) + 2 * v.flange * v.flangeT) * AREA_TO_KG_PER_M,
    specSummary: (v) =>
      `MS channel ${v.depth}×${v.flange} mm (${v.web}/${v.flangeT} mm) × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'ibeam',
    label: 'I-Beam / ISMB',
    standard: 'IS 808',
    per: 'metre',
    unitWeightLabel: 'kg/m',
    formula: 'kg/m = [tw × (h − 2·tf) + 2 × b × tf] × 0.00785',
    fields: [
      { key: 'depth', label: 'Depth (h)', unit: 'mm', defaultValue: 200, min: 40, step: 5 },
      { key: 'flange', label: 'Flange Width (b)', unit: 'mm', defaultValue: 100, min: 20, step: 5 },
      { key: 'web', label: 'Web Thickness (tw)', unit: 'mm', defaultValue: 5.6, min: 2, step: 0.2 },
      { key: 'flangeT', label: 'Flange Thickness (tf)', unit: 'mm', defaultValue: 7.5, min: 2, step: 0.5 },
      { key: 'length', label: 'Length', unit: 'm', defaultValue: 6, min: 0.1, step: 0.5 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) =>
      (v.web * (v.depth - 2 * v.flangeT) + 2 * v.flange * v.flangeT) * AREA_TO_KG_PER_M,
    specSummary: (v) =>
      `I-beam ${v.depth}×${v.flange} mm (${v.web}/${v.flangeT} mm) × ${v.length} m × ${v.quantity} nos`,
  },
  {
    id: 'plate',
    label: 'Plate / Sheet',
    standard: 'IS 2062',
    per: 'piece',
    unitWeightLabel: 'kg/sheet',
    formula: 'kg = t × w × l × 0.00000785',
    fields: [
      { key: 'thickness', label: 'Thickness', unit: 'mm', defaultValue: 6, min: 0.2, step: 0.1 },
      { key: 'width', label: 'Width', unit: 'mm', defaultValue: 1500, min: 50, step: 10 },
      { key: 'length', label: 'Length', unit: 'mm', defaultValue: 2500, min: 50, step: 10 },
      { key: 'quantity', label: 'Quantity', unit: 'nos', defaultValue: 1, min: 1, step: 1 },
    ],
    unitWeightKg: (v) => v.thickness * v.width * v.length * 0.00000785,
    specSummary: (v) =>
      `MS plate ${v.thickness}×${v.width}×${v.length} mm × ${v.quantity} nos`,
  },
];

/** Look up a shape definition by id. */
export function getShape(id: ShapeId): ShapeDefinition {
  return SHAPES.find((s) => s.id === id) ?? SHAPES[0];
}

export interface ShapeWeightResult {
  /** kg per metre (sections) or kg per sheet (plate). */
  unitWeightKg: number;
  /** Total weight in kilograms for the entered length and quantity. */
  totalKg: number;
  /** Total weight in metric tonnes. */
  totalTons: number;
  /** Number of pieces (lengths of bar, or sheets). */
  pieces: number;
}

/**
 * Work out the weight of a run of steel.
 *
 * Section weights are rounded to three decimals of a kilogram per metre
 * before the length is applied — the same convention the trade's own weight
 * tables use, and the reason a 12 mm × 12 m bar reads 10.66 kg.
 */
export function calculateShapeWeight(
  shape: ShapeDefinition,
  values: Record<string, number>,
): ShapeWeightResult {
  const safeValues: Record<string, number> = {};
  if (shape && shape.fields) {
    shape.fields.forEach((f) => {
      const raw = values[f.key];
      const parsed = parseFloat(String(raw));
      safeValues[f.key] = Number.isFinite(parsed) ? parsed : f.defaultValue;
    });
  }

  const unitWeightKg = round(shape.unitWeightKg(safeValues), 3);
  const quantity = Math.max(1, parseInt(String(safeValues.quantity ?? 1), 10) || 1);

  const totalKg =
    shape.per === 'metre'
      ? unitWeightKg * (safeValues.length ?? 0) * quantity
      : unitWeightKg * quantity;

  const validTotalKg = Number.isFinite(totalKg) && totalKg > 0 ? totalKg : 0;

  return {
    unitWeightKg: Number.isFinite(unitWeightKg) ? unitWeightKg : 0,
    totalKg: round(validTotalKg, 2),
    totalTons: round(validTotalKg / 1000, 4),
    pieces: quantity,
  };
}

// ===========================================================================
// Unit converter
// ===========================================================================

export interface ConversionPair {
  id: string;
  label: string;
  fromUnit: string;
  toUnit: string;
  /** Multiply the "from" value by this to get the "to" value. */
  factor: number;
  decimals: number;
  hint?: string;
}

/**
 * The conversions a steel buyer actually reaches for.
 *
 * Every pair is bidirectional — the converter swaps the two ends rather
 * than offering a separate "from" and "to" list.
 */
export const CONVERSION_PAIRS: ConversionPair[] = [
  {
    id: 'length_small',
    label: 'Millimetres ↔ Inches',
    fromUnit: 'mm',
    toUnit: 'inch',
    factor: 1 / 25.4,
    decimals: 4,
    hint: '1 inch = 25.4 mm',
  },
  {
    id: 'mass',
    label: 'Metric Tonnes ↔ Kilograms',
    fromUnit: 'MT',
    toUnit: 'kg',
    factor: 1000,
    decimals: 2,
    hint: '1 MT = 1,000 kg',
  },
  {
    id: 'area',
    label: 'Square Metres ↔ Square Feet',
    fromUnit: 'm²',
    toUnit: 'sq.ft',
    factor: 10.7639104167,
    decimals: 3,
    hint: '1 m² = 10.764 sq.ft',
  },
  {
    id: 'length_large',
    label: 'Feet ↔ Metres',
    fromUnit: 'ft',
    toUnit: 'm',
    factor: 0.3048,
    decimals: 4,
    hint: '1 ft = 0.3048 m',
  },
];

/** Convert a value within a pair, respecting the direction. */
export function convert(value: number, pair: ConversionPair, swapped: boolean): number {
  const factor = swapped ? 1 / pair.factor : pair.factor;
  return value * factor;
}

// ===========================================================================
// Thumb rules — residential steel consumption
// ===========================================================================

export interface ThumbRule {
  id: string;
  label: string;
  /** Kilograms of steel per square foot of built-up area. */
  minKgPerSqFt: number;
  maxKgPerSqFt: number;
  note: string;
}

/**
 * The trade's built-up-area rules.
 *
 * A residential RCC frame consumes roughly 3.5–4.5 kg of steel per square
 * foot of built-up area. Commercial and industrial buildings carry heavier
 * frames, columns and equipment loads, so they sit higher on the scale.
 */
export const THUMB_RULES: ThumbRule[] = [
  {
    id: 'residential',
    label: 'Residential (RCC frame)',
    minKgPerSqFt: 3.5,
    maxKgPerSqFt: 4.5,
    note: '3.5–4.5 kg/sq.ft — the standard residential thumb rule.',
  },
  {
    id: 'commercial',
    label: 'Commercial / Industrial',
    minKgPerSqFt: 5,
    maxKgPerSqFt: 7,
    note: '5–7 kg/sq.ft — heavier frames, columns and equipment loads.',
  },
];
