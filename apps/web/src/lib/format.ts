/** Display formatting helpers shared across the catalogue UI. */

const INR = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/**
 * Measurements keep up to two decimals but drop trailing zeroes.
 * Sheet gauges are fractional (0.47mm, 0.60mm, 1.2mm), so rounding them to
 * whole numbers would misstate the product.
 */
const DECIMAL = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

/** Format a rupee amount without decimals — ₹1,45,000 */
export function formatInr(value: number): string {
  return `₹${INR.format(Math.round(value))}`;
}

/** Format a rupee amount with paise — ₹1,45,000.00 */
export function formatInrPrecise(value: number): string {
  return `₹${INR_PRECISE.format(value)}`;
}

/**
 * Format a metric ton quantity, trimming trailing zeroes — 45 / 82.5.
 *
 * Sub-tonne figures keep more decimals: a single 12 m bar weighs 0.0107 MT,
 * and rounding that to one decimal would print a flat "0.0".
 */
export function formatTons(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Number.isInteger(value)) return String(value);

  const decimals = Math.abs(value) < 1 ? 4 : 1;
  return String(Number(value.toFixed(decimals)));
}

/** Format a dimension in mm as a friendly string — 1060mm, 0.6mm */
export function formatMm(value: number): string {
  return `${DECIMAL.format(value)}mm`;
}

/**
 * Format an ISO timestamp for a table cell — "21 Oct 2026, 14:05".
 *
 * The locale is left to the runtime so a reader who has set their browser to
 * हिन्दी gets Devanagari month names without a second date library. An
 * unparseable value returns an empty string rather than "Invalid Date",
 * because a blank cell is calmer than a broken-looking one.
 */
export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Human label for a `specifications` key.
 * `yield_strength_mpa` -> `Yield Strength`, `coating_weight_g_m2` -> `Coating Weight`.
 */
export function humanizeSpecKey(key: string): string {
  const overrides: Record<string, string> = {
    yield_strength_mpa: 'Yield Strength',
    elongation_pct: 'Elongation',
    carbon_content_pct: 'Carbon Content',
    coating_weight_g_m2: 'Coating Weight',
    paint_thickness_micron: 'Paint Thickness',
    zinc_aluminium: 'Zn / Al Alloy',
    surface_finish: 'Surface Finish',
    surface_treatment: 'Surface Treatment',
    thickness_tolerance_mm: 'Thickness Tolerance',
    section: 'Section',
    section_weight_kg_per_m: 'Section Weight',
    brand_mark: 'Brand Mark',
    rib_pattern: 'Rib Pattern',
    coil_inner_diameter_mm: 'Coil ID',
    profile: 'Profile',
    colour: 'Colour',
    color: 'Colour',
    application: 'Application',
    temper: 'Temper',
  };

  if (overrides[key]) return overrides[key];

  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Append the right unit to a specification value based on its key. */
export function formatSpecValue(key: string, value: string | number | boolean): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  const unitMap: Record<string, string> = {
    yield_strength_mpa: ' MPa',
    elongation_pct: '%',
    carbon_content_pct: '%',
    coating_weight_g_m2: ' g/m²',
    paint_thickness_micron: ' µm',
    thickness_tolerance_mm: ' mm',
    section_weight_kg_per_m: ' kg/m',
    coil_inner_diameter_mm: ' mm',
  };

  const unit = unitMap[key];
  if (!unit) return String(value);
  return `${value}${unit}`;
}
