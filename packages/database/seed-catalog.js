/**
 * SteelSetu catalogue seed.
 *
 * Seeds the flat `products` table in Supabase with a realistic Burrabazar
 * (Kolkata) B2B steel catalogue: GI/PPGL roofing, galvalume & colour-coated
 * coils, HR/CR coils, TMT bars and structural sections.
 *
 * Upserts on `sku`, so re-running is safe and existing rows are enriched in
 * place rather than duplicated.
 *
 *   node seed-catalog.js            # seed the catalogue
 *   node seed-catalog.js --dry-run  # print what would change, write nothing
 */
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SEEDER = 'seed-catalog.js';

/** Catalogue categories, in display order. */
const CATEGORIES = [
  { code: 'PROFILE_SHEET', label: 'Profile / Roofing Sheets' },
  { code: 'GI_SHEET', label: 'GI Sheets' },
  { code: 'PPGL_COIL', label: 'PPGL Coils' },
  { code: 'GALVALUME_COIL', label: 'Galvalume Coils' },
  { code: 'HR_COIL', label: 'HR Coils' },
  { code: 'CR_COIL', label: 'CR Coils' },
  { code: 'TMT_BAR', label: 'TMT Bars' },
  { code: 'ANGLE_CHANNEL', label: 'Angles & Channels' },
];

/**
 * The catalogue. Prices are ex-mill INR per metric ton and reflect the
 * Indian spot market band for mid-2026; they are indicative list rates,
 * not live index-linked quotes.
 */
const PRODUCTS = [
  // ---------------------------------------------------------------- PROFILE
  {
    sku: 'PPGL-050-AZ150-BLU',
    name: 'PPGL Profile Sheet 0.50mm AZ150 (Castle Blue)',
    category: 'PROFILE_SHEET',
    brand: 'Tata Steel',
    mill_name: 'Tata Steel Kalinganagar',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.5,
    width_mm: 1060,
    length_mm: 3660,
    coating: 'AZ150',
    price_per_ton_inr: 78500,
    minimum_order_tons: 2.5,
    inventory_tons: 45,
    is_in_stock: true,
    description:
      'Pre-painted galvalume profiled roofing sheet in Castle Blue. 150 g/m2 zinc-aluminium alloy coating with 15 micron colour finish on top. Standard Burrabazar dealer stock for industrial shed and warehouse roofing.',
    specifications: {
      yield_strength_mpa: 240,
      coating_weight_g_m2: 150,
      colour: 'Castle Blue',
      paint_thickness_micron: 15,
      surface_finish: 'Colour Coated',
      zinc_aluminium: '55% Al / 45% Zn',
      profile: 'Trapezoidal 3-rib',
      application: 'Industrial roofing, PEB structures',
    },
  },
  {
    sku: 'PPGL-047-AZ150-GRY',
    name: 'PPGL Profile Sheet 0.47mm AZ150 (Silver Grey)',
    category: 'PROFILE_SHEET',
    brand: 'AM/NS',
    mill_name: 'Akshay Mahan NMC',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.47,
    width_mm: 1060,
    length_mm: 3660,
    coating: 'AZ150',
    price_per_ton_inr: 76500,
    minimum_order_tons: 2.5,
    inventory_tons: 62.5,
    is_in_stock: true,
    description:
      'Galvalume colour-coated profiled sheet in Silver Grey, AZ150 coating. Trapezoidal profile with anti-capillary groove for leak-resistant lapping.',
    specifications: {
      yield_strength_mpa: 240,
      coating_weight_g_m2: 150,
      colour: 'Silver Grey',
      paint_thickness_micron: 15,
      surface_finish: 'Colour Coated',
      zinc_aluminium: '55% Al / 45% Zn',
      profile: 'Trapezoidal 3-rib',
      application: 'Residential and commercial roofing',
    },
  },
  {
    sku: 'GI-PRF-050-120GSM',
    name: 'GI Profile Sheet 0.50mm 120 GSM',
    category: 'PROFILE_SHEET',
    brand: 'Shyam Metalics',
    mill_name: 'Shyam Metalics (Durgapur)',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.5,
    width_mm: 1060,
    length_mm: 3660,
    coating: '120GSM',
    price_per_ton_inr: 72000,
    minimum_order_tons: 3,
    inventory_tons: 38,
    is_in_stock: true,
    description:
      'Unpainted galvanised profiled roofing sheet, 120 g/m2 zinc coating. Economy option for covered godowns and temporary structures.',
    specifications: {
      yield_strength_mpa: 210,
      coating_weight_g_m2: 120,
      surface_finish: 'Bare Galvanised',
      zinc_aluminium: 'Pure Zinc',
      profile: 'Trapezoidal 3-rib',
      application: 'Godown roofing, site sheds',
    },
  },
  {
    sku: 'PPGL-060-AZ150-RED',
    name: 'PPGL Colour Coated Profile 0.60mm AZ150 (Red oxide)',
    category: 'PROFILE_SHEET',
    brand: 'JSW Steel',
    mill_name: 'JSW coated Coils (Vasanthapuram)',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.6,
    width_mm: 1060,
    length_mm: 3660,
    coating: 'AZ150',
    price_per_ton_inr: 84000,
    minimum_order_tons: 2.5,
    inventory_tons: 21.5,
    is_in_stock: true,
    description:
      'Heavy-gauge colour-coated profile sheet for long-span roofing. Higher coating mass and yield for cyclonic wind loads.',
    specifications: {
      yield_strength_mpa: 260,
      coating_weight_g_m2: 150,
      colour: 'Red Oxide',
      paint_thickness_micron: 15,
      surface_finish: 'Colour Coated',
      zinc_aluminium: '55% Al / 45% Zn',
      profile: 'Trapezoidal 3-rib',
      application: 'Long-span roofing, coastal projects',
    },
  },

  // -------------------------------------------------------------- GI SHEET
  {
    sku: 'GI-040-120GSM-REG',
    name: 'GI Corrugated Sheet 0.40mm 120 GSM',
    category: 'GI_SHEET',
    brand: 'Tata Steel',
    mill_name: 'Tata Steel Jamshedpur',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.4,
    width_mm: 910,
    length_mm: 2440,
    coating: '120GSM',
    price_per_ton_inr: 74200,
    minimum_order_tons: 5,
    inventory_tons: 82,
    is_in_stock: true,
    description:
      'Standard corrugated galvanised iron roofing sheet. 120 g/m2 zinc coating, full corrugation pitch for drainage.',
    specifications: {
      yield_strength_mpa: 210,
      coating_weight_g_m2: 120,
      surface_finish: 'Bare Galvanised',
      zinc_aluminium: 'Pure Zinc',
      profile: 'Corrugated, 76mm pitch',
      application: 'General roofing, fencing, ducting',
    },
  },
  {
    sku: 'GI-047-080GSM',
    name: 'GI Corrugated Sheet 0.47mm 80 GSM',
    category: 'GI_SHEET',
    brand: 'Shyam Metalics',
    mill_name: 'Shyam Metalics (Durgapur)',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.47,
    width_mm: 910,
    length_mm: 2440,
    coating: '80GSM',
    price_per_ton_inr: 69500,
    minimum_order_tons: 5,
    inventory_tons: 55,
    is_in_stock: true,
    description:
      'Economy corrugated GI sheet with 80 g/m2 zinc coating. Suitable for low-exposure shed roofing where corrosion risk is limited.',
    specifications: {
      yield_strength_mpa: 210,
      coating_weight_g_m2: 80,
      surface_finish: 'Bare Galvanised',
      zinc_aluminium: 'Pure Zinc',
      profile: 'Corrugated, 76mm pitch',
      application: 'Internal roofing, partition panels',
    },
  },
  {
    sku: 'GI-PLAIN-060-120GSM',
    name: 'GI Plain Sheet 0.60mm 120 GSM',
    category: 'GI_SHEET',
    brand: 'SAIL',
    mill_name: 'SAIL Bokaro',
    grade: 'IS 513',
    hsn_code: '7210.41',
    thickness_mm: 0.6,
    width_mm: 1250,
    length_mm: 2500,
    coating: '120GSM',
    price_per_ton_inr: 71000,
    minimum_order_tons: 4,
    inventory_tons: 48,
    is_in_stock: true,
    description:
      'Flat galvanised sheet for fabrication, ducting, ducting fabrication and general sheet metal work.',
    specifications: {
      yield_strength_mpa: 230,
      coating_weight_g_m2: 120,
      surface_finish: 'Bare Galvanised',
      zinc_aluminium: 'Pure Zinc',
      profile: 'Plain flat sheet',
      application: 'Sheet metal fabrication, ducting',
    },
  },

  // ----------------------------------------------------------- PPGL COILS
  {
    sku: 'PPGL-CL-047-AZ150',
    name: 'PPGL Coil 0.47mm AZ150 (Colour Coated)',
    category: 'PPGL_COIL',
    brand: 'JSW Steel',
    mill_name: 'JSW coated Coils (Vasanthapuram)',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.47,
    width_mm: 1220,
    length_mm: null,
    coating: 'AZ150',
    price_per_ton_inr: 79500,
    minimum_order_tons: 10,
    inventory_tons: 96,
    is_in_stock: true,
    description:
      'Colour-coated pre-painted galvalume coil, AZ150 with 15 micron top coat. Supplied in coil form for slitting and roll forming.',
    specifications: {
      yield_strength_mpa: 240,
      coating_weight_g_m2: 150,
      paint_thickness_micron: 15,
      surface_finish: 'Colour Coated',
      zinc_aluminium: '55% Al / 45% Zn',
      coil_inner_diameter_mm: 508,
      application: 'Roll forming, slitting, cladding panels',
    },
  },
  {
    sku: 'PPGL-CL-035-AZ70',
    name: 'PPGL Coil 0.35mm AZ70 (Colour Coated)',
    category: 'PPGL_COIL',
    brand: 'AM/NS',
    mill_name: 'Akshay Mahan NMC',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.35,
    width_mm: 1220,
    length_mm: null,
    coating: 'AZ70',
    price_per_ton_inr: 78000,
    minimum_order_tons: 10,
    inventory_tons: 74,
    is_in_stock: true,
    description:
      'Light-gauge colour-coated galvalume coil for false ceiling, partition and lightweight cladding applications.',
    specifications: {
      yield_strength_mpa: 220,
      coating_weight_g_m2: 70,
      paint_thickness_micron: 12,
      surface_finish: 'Colour Coated',
      zinc_aluminium: '55% Al / 45% Zn',
      coil_inner_diameter_mm: 508,
      application: 'False ceiling, partitions, light cladding',
    },
  },

  // ------------------------------------------------------- GALVALUME COIL
  {
    sku: 'GL-COIL-045-AZ70',
    name: 'Galvalume Steel Coil Bare AZ70 0.45mm',
    category: 'GALVALUME_COIL',
    brand: 'Jindal Steel',
    mill_name: 'Jindal Steel & Power (Raigarh)',
    grade: 'IS 277',
    hsn_code: '7210.11',
    thickness_mm: 0.45,
    width_mm: 1220,
    length_mm: null,
    coating: 'AZ70',
    price_per_ton_inr: 71000,
    minimum_order_tons: 10,
    inventory_tons: 120,
    is_in_stock: true,
    description:
      'Bare galvalume coil with 70 g/m2 zinc-aluminium alloy coating. Base coil for in-house colour coating or direct profile forming.',
    specifications: {
      yield_strength_mpa: 230,
      coating_weight_g_m2: 70,
      surface_finish: 'Bare Galvalume',
      zinc_aluminium: '55% Al / 45% Zn',
      coil_inner_diameter_mm: 508,
      application: 'Profile forming, colour coating base',
    },
  },
  {
    sku: 'GL-COIL-060-AZ150',
    name: 'Galvalume Steel Coil Bare AZ150 0.60mm',
    category: 'GALVALUME_COIL',
    brand: 'Essar Steel',
    mill_name: 'Essar Steel Bhilai',
    grade: 'IS 277',
    hsn_code: '7210.11',
    thickness_mm: 0.6,
    width_mm: 1220,
    length_mm: null,
    coating: 'AZ150',
    price_per_ton_inr: 74800,
    minimum_order_tons: 10,
    inventory_tons: 68,
    is_in_stock: true,
    description:
      'Heavy-gauge galvalume coil for structural cladding, ducting and pre-engineered building panels.',
    specifications: {
      yield_strength_mpa: 260,
      coating_weight_g_m2: 150,
      surface_finish: 'Bare Galvalume',
      zinc_aluminium: '55% Al / 45% Zn',
      coil_inner_diameter_mm: 508,
      application: 'PEB cladding, ducting, structural panels',
    },
  },

  // -------------------------------------------------------------- HR COILS
  {
    sku: 'HR-CL-025-E250',
    name: 'HR Coil 2.5mm IS 2062 E250 BR',
    category: 'HR_COIL',
    brand: 'Tata Steel',
    mill_name: 'Tata Steel Jamshedpur',
    grade: 'IS 2062 E250 BR',
    hsn_code: '7208.39',
    thickness_mm: 2.5,
    width_mm: 1500,
    length_mm: null,
    coating: 'NONE',
    price_per_ton_inr: 54000,
    minimum_order_tons: 20,
    inventory_tons: 210,
    is_in_stock: true,
    description:
      'Hot rolled coil for general fabrication, laser cutting and structural fabrication. Black mill finish, oiled surface.',
    specifications: {
      yield_strength_mpa: 250,
      elongation_pct: 26,
      surface_finish: 'Black / Mill Scale',
      surface_treatment: 'Oiled',
      thickness_tolerance_mm: '±0.2',
      application: 'Fabrication, laser cutting, general purpose',
    },
  },
  {
    sku: 'HR-CL-030-E250',
    name: 'HR Coil 3.0mm IS 2062 E250 BR',
    category: 'HR_COIL',
    brand: 'JSW Steel',
    mill_name: 'JSW Steel Vijayanagar',
    grade: 'IS 2062 E250 BR',
    hsn_code: '7208.39',
    thickness_mm: 3.0,
    width_mm: 1500,
    length_mm: null,
    coating: 'NONE',
    price_per_ton_inr: 53800,
    minimum_order_tons: 20,
    inventory_tons: 185,
    is_in_stock: true,
    description:
      'Hot rolled coil in 3.0mm gauge — the workhorse grade for fabrication shops and container/pallet manufacturing.',
    specifications: {
      yield_strength_mpa: 250,
      elongation_pct: 26,
      surface_finish: 'Black / Mill Scale',
      surface_treatment: 'Oiled',
      thickness_tolerance_mm: '±0.25',
      application: 'Fabrication, container, pallets',
    },
  },
  {
    sku: 'HR-CL-016-E350',
    name: 'HR Coil 1.6mm IS 2062 E350',
    category: 'HR_COIL',
    brand: 'SAIL',
    mill_name: 'SAIL Rourkela',
    grade: 'IS 2062 E350',
    hsn_code: '7208.39',
    thickness_mm: 1.6,
    width_mm: 1500,
    length_mm: null,
    coating: 'NONE',
    price_per_ton_inr: 56800,
    minimum_order_tons: 20,
    inventory_tons: 140,
    is_in_stock: true,
    description:
      'Higher-strength hot rolled coil at E350 grade for pressure vessel and heavier structural fabrication.',
    specifications: {
      yield_strength_mpa: 350,
      elongation_pct: 23,
      surface_finish: 'Black / Mill Scale',
      surface_treatment: 'Oiled',
      thickness_tolerance_mm: '±0.2',
      application: 'Pressure parts, heavy fabrication',
    },
  },

  // -------------------------------------------------------------- CR COILS
  {
    sku: 'CR-CL-060-IS513',
    name: 'CR Coil 0.60mm IS 513',
    category: 'CR_COIL',
    brand: 'APL Apollo',
    mill_name: 'APL Apollo Steel Raipur',
    grade: 'IS 513',
    hsn_code: '7209.17',
    thickness_mm: 0.6,
    width_mm: 1250,
    length_mm: null,
    coating: 'NONE',
    price_per_ton_inr: 62500,
    minimum_order_tons: 15,
    inventory_tons: 88,
    is_in_stock: true,
    description:
      'Cold rolled coil, bright annealed finish with mill oil. The standard grade for precision blanking, auto components and enclosures.',
    specifications: {
      yield_strength_mpa: 270,
      surface_finish: 'Bright Annealed / BA',
      surface_treatment: 'Oiled',
      thickness_tolerance_mm: '±0.03',
      temper: 'Quarter Hard / Half Hard',
      application: 'Auto body, enclosures, precision blanking',
    },
  },
  {
    sku: 'CR-CL-100-IS513',
    name: 'CR Coil 1.00mm IS 513',
    category: 'CR_COIL',
    brand: 'AM/NS',
    mill_name: 'Akshay Mahan NMC',
    grade: 'IS 513',
    hsn_code: '7209.17',
    thickness_mm: 1.0,
    width_mm: 1250,
    length_mm: null,
    coating: 'NONE',
    price_per_ton_inr: 61800,
    minimum_order_tons: 15,
    inventory_tons: 64,
    is_in_stock: true,
    description:
      'Cold rolled coil in 1.0mm gauge, full bright annealed. Supplied for electrical enclosures and general sheet metal fabrication.',
    specifications: {
      yield_strength_mpa: 270,
      surface_finish: 'Bright Annealed / BA',
      surface_treatment: 'Oiled',
      thickness_tolerance_mm: '±0.04',
      temper: 'Quarter Hard',
      application: 'Electrical enclosures, general fabrication',
    },
  },

  // -------------------------------------------------------------- TMT BARS
  {
    sku: 'TMT-012-FE500D',
    name: 'TMT Bar 12mm IS 1786 Fe500D',
    category: 'TMT_BAR',
    brand: 'Tata Steel',
    mill_name: 'Tata Steel Jamshedpur',
    grade: 'IS 1786 Fe500D',
    hsn_code: '7214.20',
    thickness_mm: 12,
    width_mm: 12,
    length_mm: 12000,
    coating: 'NONE',
    price_per_ton_inr: 59000,
    minimum_order_tons: 10,
    inventory_tons: 165,
    is_in_stock: true,
    description:
      'High-strength TMT reinforcement bar with ductility class D. Fe500D grade carries the BIS kmark licence for seismic-zone construction.',
    specifications: {
      yield_strength_mpa: 500,
      elongation_pct: 16,
      carbon_content_pct: 0.2,
      brand_mark: 'TATA TIS',
      rib_pattern: 'Ribbed (Fe550D pattern)',
      application: 'Residential, commercial RCC',
    },
  },
  {
    sku: 'TMT-016-FE550D',
    name: 'TMT Bar 16mm IS 1786 Fe550D',
    category: 'TMT_BAR',
    brand: 'SAIL',
    mill_name: 'SAIL Bokaro',
    grade: 'IS 1786 Fe550D',
    hsn_code: '7214.20',
    thickness_mm: 16,
    width_mm: 16,
    length_mm: 12000,
    coating: 'NONE',
    price_per_ton_inr: 60500,
    minimum_order_tons: 10,
    inventory_tons: 130,
    is_in_stock: true,
    description:
      'Fe550D TMT reinforcement bar in 16mm diameter for heavy columns, footings and transfer structures.',
    specifications: {
      yield_strength_mpa: 550,
      elongation_pct: 14,
      carbon_content_pct: 0.22,
      brand_mark: 'SAIL',
      rib_pattern: 'Ribbed',
      application: 'Heavy columns, footings, transfer structures',
    },
  },

  // ------------------------------------------------------ ANGLES & CHANNELS
  {
    sku: 'MS-ANG-50-50-6',
    name: 'MS Angle 50 x 50 x 6mm',
    category: 'ANGLE_CHANNEL',
    brand: 'Shyam Metalics',
    mill_name: 'Shyam Metalics (Durgapur)',
    grade: 'IS 2062 E250',
    hsn_code: '7216.10',
    thickness_mm: 6,
    width_mm: 50,
    length_mm: 6000,
    coating: 'NONE',
    price_per_ton_inr: 54800,
    minimum_order_tons: 2,
    inventory_tons: 42,
    is_in_stock: true,
    description:
      'Hot rolled equal-leg structural angle in 6m lengths. Standard for frames, bracing and tower structures.',
    specifications: {
      section: 'Equal Leg Angle 50x50x6',
      yield_strength_mpa: 250,
      length_mm: 6000,
      section_weight_kg_per_m: 4.52,
      surface_finish: 'Black / Mill Scale',
      application: 'Structural frames, bracing, towers',
    },
  },
  {
    sku: 'MS-CH-100-50',
    name: 'MS Channel 100 x 50mm (ISMC 100)',
    category: 'ANGLE_CHANNEL',
    brand: 'JSW Steel',
    mill_name: 'JSW Steel Vijayanagar',
    grade: 'IS 2062 E250',
    hsn_code: '7216.20',
    thickness_mm: 5,
    width_mm: 100,
    length_mm: 6000,
    coating: 'NONE',
    price_per_ton_inr: 56200,
    minimum_order_tons: 2,
    inventory_tons: 36,
    is_in_stock: true,
    description:
      'ISMC 100 hot rolled channel in 6m lengths. Workhorse section for PEB structures, gantry beams and purlins.',
    specifications: {
      section: 'ISMC 100 (100x50x5)',
      yield_strength_mpa: 250,
      length_mm: 6000,
      section_weight_kg_per_m: 7.14,
      surface_finish: 'Black / Mill Scale',
      application: 'PEB structures, gantry beams, purlins',
    },
  },
  {
    sku: 'MS-SQ-025-6',
    name: 'MS Square Bar 25 x 25mm',
    category: 'ANGLE_CHANNEL',
    brand: 'APL Apollo',
    mill_name: 'APL Apollo Steel Raipur',
    grade: 'IS 2062 E250',
    hsn_code: '7216.10',
    thickness_mm: 6,
    width_mm: 25,
    length_mm: 6000,
    coating: 'NONE',
    price_per_ton_inr: 55600,
    minimum_order_tons: 2,
    inventory_tons: 28,
    is_in_stock: true,
    description:
      'Hot rolled mild steel square bar for machineries, jigs and general fabrication work.',
    specifications: {
      section: 'Square Bar 25x25',
      yield_strength_mpa: 250,
      length_mm: 6000,
      section_weight_kg_per_m: 3.77,
      surface_finish: 'Black / Mill Scale',
      application: 'General fabrication, machineries, jigs',
    },
  },
];

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  await client.connect();

  console.log(
    `\n${dryRun ? '[DRY RUN] ' : ''}Seeding SteelSetu catalogue — ${PRODUCTS.length} products across ${CATEGORIES.length} categories\n`
  );

  if (dryRun) {
    for (const p of PRODUCTS) {
      console.log(`  ${p.sku.padEnd(22)} ${p.brand.padEnd(16)} ₹${p.price_per_ton_inr}/MT  ${p.name}`);
    }
    await client.end();
    return;
  }

  // --- Companies that stock the catalogue ---------------------------------
  const seller = await client.query(
    `INSERT INTO "Company" (
        id, "legalName", "brandName", "companyType", gstin,
        "verificationStatus", "isFeatured", "yearsInBusiness",
        "registeredAddress", city, state, pincode, "areaMarket",
        "profileCompleteness", "createdAt", "updatedAt"
     ) VALUES (
        gen_random_uuid(), 'Singhi Enterprises', 'Singhi Steel & Coils', 'PROPRIETORSHIP',
        '19AAAAA0000A1Z5', 'VERIFIED', true, 18,
        'Lohapati, Burrabazar', 'Kolkata', 'West Bengal', '700007',
        'Burrabazar - Lohapati', 100, NOW(), NOW()
     )
     ON CONFLICT (gstin) DO UPDATE SET
        "brandName" = EXCLUDED."brandName",
        "verificationStatus" = EXCLUDED."verificationStatus",
        "updatedAt" = NOW()
     RETURNING id`
  );
  const sellerId = seller.rows[0].id;
  console.log(`  ✓ Seller: Singhi Enterprises (${sellerId})`);

  // --- Products -------------------------------------------------------------
  let created = 0;
  let updated = 0;

  for (const p of PRODUCTS) {
    const result = await client.query(
      `INSERT INTO products (
          id, sku, name, category, brand, mill_name, grade, hsn_code,
          thickness_mm, width_mm, length_mm, coating,
          price_per_ton_inr, minimum_order_tons, inventory_tons, is_in_stock,
          description, specifications, uom, stock_updated_at, updated_by, created_at
       ) VALUES (
          gen_random_uuid()::text,
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17::jsonb, $18,
          NOW(), $19, NOW()
       )
       ON CONFLICT (sku) DO UPDATE SET
          name              = EXCLUDED.name,
          category          = EXCLUDED.category,
          brand             = EXCLUDED.brand,
          mill_name         = EXCLUDED.mill_name,
          grade             = EXCLUDED.grade,
          hsn_code          = EXCLUDED.hsn_code,
          thickness_mm      = EXCLUDED.thickness_mm,
          width_mm          = EXCLUDED.width_mm,
          length_mm         = EXCLUDED.length_mm,
          coating           = EXCLUDED.coating,
          price_per_ton_inr = EXCLUDED.price_per_ton_inr,
          minimum_order_tons= EXCLUDED.minimum_order_tons,
          inventory_tons    = EXCLUDED.inventory_tons,
          is_in_stock       = EXCLUDED.is_in_stock,
          description       = EXCLUDED.description,
          specifications    = EXCLUDED.specifications,
          uom               = EXCLUDED.uom,
          stock_updated_at  = NOW(),
          updated_by        = EXCLUDED.updated_by
       RETURNING (xmax = 0) AS was_created`,
      [
        p.sku, p.name, p.category, p.brand, p.mill_name, p.grade, p.hsn_code,
        p.thickness_mm, p.width_mm, p.length_mm, p.coating,
        p.price_per_ton_inr, p.minimum_order_tons, p.inventory_tons, p.is_in_stock,
        p.description, JSON.stringify(p.specifications ?? {}), 'MT', SEEDER,
      ]
    );

    if (result.rows[0].was_created) created += 1;
    else updated += 1;
  }

  console.log(`  ✓ Products: ${created} created, ${updated} updated`);

  // --- Summary --------------------------------------------------------------
  const summary = await client.query(
    `SELECT category, COUNT(*)::int AS n,
            MIN(price_per_ton_inr)::numeric(10,0) AS min_rate,
            MAX(price_per_ton_inr)::numeric(10,0) AS max_rate,
            SUM(inventory_tons)::numeric(10,1) AS stock
     FROM products
     GROUP BY category
     ORDER BY category`
  );

  console.log('\n  Category                 Items   Rate range (₹/MT)      Stock (MT)');
  console.log('  ' + '-'.repeat(68));
  for (const r of summary.rows) {
    console.log(
      `  ${r.category.padEnd(24)} ${String(r.n).padStart(4)}   ` +
        `${Number(r.min_rate).toLocaleString('en-IN').padStart(7)} - ${Number(r.max_rate).toLocaleString('en-IN').padEnd(7)}   ` +
        `${String(r.stock).padStart(8)}`
    );
  }

  const totals = await client.query(
    `SELECT COUNT(*)::int AS n, COALESCE(SUM(inventory_tons),0)::numeric(10,1) AS stock
     FROM products`
  );
  console.log(
    `\n  ✓ Catalogue total: ${totals.rows[0].n} SKUs, ${totals.rows[0].stock} MT in stock\n`
  );

  await client.end();
}

main().catch((err) => {
  console.error('\n❌ Catalogue seed failed:', err.message);
  process.exit(1);
});
