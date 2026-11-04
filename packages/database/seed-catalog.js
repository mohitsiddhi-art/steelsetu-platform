/**
 * SteelSetu catalogue seed.
 *
 * Seeds the flat `products` table in Supabase with a realistic Burrabazar
 * (Kolkata) B2B steel catalogue: GI/PPGL roofing, galvalume & colour-coated
 * coils, HR/CR coils, TMT bars and structural sections, plus roofing accessories
 * & fasteners featuring Mount, Tata Steel, JSW, etc.
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
  { code: 'ROOFING_ACCESSORY', label: 'Roofing Accessories & Fasteners' },
];

const PRODUCTS = [
  // 1. Mount SDS Screws 12x55
  {
    sku: 'ACC-MOUNT-SDS-12x55',
    name: 'Mount Self-Drilling Screws (SDS) 12x55mm with EPDM Washer',
    category: 'ROOFING_ACCESSORY',
    brand: 'Mount',
    mill_name: 'Mount Fasteners & Hardware',
    grade: 'Class 3 Anti-Corrosion',
    hsn_code: '7318.14',
    thickness_mm: 5.5,
    width_mm: 12,
    length_mm: 55,
    coating: 'CUSTOM',
    price_per_ton_inr: 1420,
    minimum_order_tons: 1,
    inventory_tons: 600,
    is_in_stock: true,
    description: 'Mount Self-Drilling Screws (SDS) 12x55mm with EPDM Washer — Box of 1,000 pcs for secure roofing sheet installation.',
    uom: 'Box',
    specifications: { pack_size: '1,000 pcs', coating: 'Zinc Plated Class 3', application: 'Roofing sheet fixing' },
  },
  // 2. Mount SDS Screws 12x25
  {
    sku: 'ACC-MOUNT-SDS-12x25',
    name: 'Mount Self-Drilling Screws (SDS) 12x25mm for Stitching',
    category: 'ROOFING_ACCESSORY',
    brand: 'Mount',
    mill_name: 'Mount Fasteners & Hardware',
    grade: 'Class 3 Anti-Corrosion',
    hsn_code: '7318.14',
    thickness_mm: 5.5,
    width_mm: 12,
    length_mm: 25,
    coating: 'CUSTOM',
    price_per_ton_inr: 1180,
    minimum_order_tons: 1,
    inventory_tons: 750,
    is_in_stock: true,
    description: 'Mount Self-Drilling Screws (SDS) 12x25mm for lap stitching and accessory fastening — Box of 1,000 pcs.',
    uom: 'Box',
    specifications: { pack_size: '1,000 pcs', coating: 'Zinc Plated Class 3', application: 'Lap stitching' },
  },
  // 3. PPGL Plain Ridge Flashing
  {
    sku: 'ACC-PPGL-RIDGE-050',
    name: 'PPGL Plain Ridge Flashing (0.50mm / 8ft length)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Tata Steel / JSW',
    mill_name: 'Tata Steel Kalinganagar',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.5,
    width_mm: 300,
    length_mm: 2440,
    coating: 'AZ150',
    price_per_ton_inr: 320,
    minimum_order_tons: 10,
    inventory_tons: 350,
    is_in_stock: true,
    description: 'PPGL Plain Ridge Flashing (0.50mm / 8ft length) color matched for apex roof sealing.',
    uom: 'Pc',
    specifications: { length: '8 ft', thickness: '0.50 mm', application: 'Roof apex ridge sealing' },
  },
  // 4. GI Plain Ridge
  {
    sku: 'ACC-GI-PLAIN-RIDGE',
    name: 'Galvanized (GI) Plain Ridge (0.45mm / 8ft length)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Local Mandi Rolling',
    mill_name: 'Burrabazar Local Rolling',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.45,
    width_mm: 300,
    length_mm: 2440,
    coating: '120GSM',
    price_per_ton_inr: 260,
    minimum_order_tons: 10,
    inventory_tons: 400,
    is_in_stock: true,
    description: 'Galvanized (GI) Plain Ridge (0.45mm / 8ft length) economical ridge capping.',
    uom: 'Pc',
    specifications: { length: '8 ft', thickness: '0.45 mm', application: 'Economy ridge capping' },
  },
  // 5. PPGL Rainwater Donga / Valley Gutter
  {
    sku: 'ACC-PPGL-DONGA-VALLEY',
    name: 'PPGL Rainwater Donga / Valley Gutter (Custom Girth / 0.50mm)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Singhi Fabricators',
    mill_name: 'Singhi Sheet Metal Works',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.5,
    width_mm: 450,
    length_mm: 3000,
    coating: 'AZ150',
    price_per_ton_inr: 410,
    minimum_order_tons: 5,
    inventory_tons: 280,
    is_in_stock: true,
    description: 'PPGL Rainwater Donga / Valley Gutter (Custom Girth / 0.50mm) for industrial drainage.',
    uom: 'Pc',
    specifications: { girth: 'Customized', thickness: '0.50 mm', application: 'Drainage & rainwater harvesting' },
  },
  // 6. PPGL Corner / Gable Flashing
  {
    sku: 'ACC-PPGL-CORNER-GABLE',
    name: 'PPGL Corner / Gable Flashing (8ft length)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Singhi Fabricators',
    mill_name: 'Singhi Sheet Metal Works',
    grade: 'IS 277',
    hsn_code: '7210.41',
    thickness_mm: 0.5,
    width_mm: 300,
    length_mm: 2440,
    coating: 'AZ150',
    price_per_ton_inr: 290,
    minimum_order_tons: 5,
    inventory_tons: 220,
    is_in_stock: true,
    description: 'PPGL Corner / Gable Flashing (8ft length) for clean building side termination.',
    uom: 'Pc',
    specifications: { length: '8 ft', thickness: '0.50 mm', application: 'Building side termination' },
  },
  // 7. FRP Corrugated Daylight Sheet
  {
    sku: 'ACC-FRP-CORR-DAYLIGHT',
    name: 'FRP Corrugated Daylight Profile Sheet (1.5mm UV Coated)',
    category: 'ROOFING_ACCESSORY',
    brand: 'FibreTech',
    mill_name: 'FibreTech Polymers',
    grade: 'UV Stabilized FRP',
    hsn_code: '3921.90',
    thickness_mm: 1.5,
    width_mm: 1060,
    length_mm: 3000,
    coating: 'NONE',
    price_per_ton_inr: 165,
    minimum_order_tons: 5,
    inventory_tons: 180,
    is_in_stock: true,
    description: 'FRP Corrugated Daylight Profile Sheet (1.5mm UV Coated) for translucent roof lighting.',
    uom: 'Running Ft',
    specifications: { light_transmission: '85%', uv_protection: 'Double-sided Co-extruded', profile: 'Matches Trapezoidal' },
  },
  // 8. Polycarbonate Multiwall / Profile Sheet
  {
    sku: 'ACC-POLY-MULTIWALL-20',
    name: 'Polycarbonate Multiwall / Profile Sheet (2.0mm Clear Embossed)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Palram',
    mill_name: 'Polycarb Extrusion Works',
    grade: 'Clear Embossed UV Protected',
    hsn_code: '3920.61',
    thickness_mm: 2.0,
    width_mm: 1220,
    length_mm: 3660,
    coating: 'NONE',
    price_per_ton_inr: 880,
    minimum_order_tons: 3,
    inventory_tons: 140,
    is_in_stock: true,
    description: 'Polycarbonate Multiwall / Profile Sheet (2.0mm Clear Embossed) with superior impact resistance.',
    uom: 'Running Ft',
    specifications: { impact_resistance: 'High', uv_protection: 'Co-extruded layer', application: 'Skylights' },
  },
  // 9. PUF Insulated Roofing Panel
  {
    sku: 'PROD-PUF-ROOF-PANEL',
    name: 'PUF Insulated Roofing Panel / Sandwich Sheet (30mm/50mm Core)',
    category: 'PROFILE_SHEET',
    brand: 'Jindal Mectec',
    mill_name: 'Jindal Mectec Sandwich Panels',
    grade: 'PUR / PIR 40kg/m3',
    hsn_code: '7308.90',
    thickness_mm: 50,
    width_mm: 1000,
    length_mm: 6000,
    coating: 'AZ150',
    price_per_ton_inr: 1150,
    minimum_order_tons: 5,
    inventory_tons: 110,
    is_in_stock: true,
    description: 'PUF Insulated Roofing Panel / Sandwich Sheet (30mm/50mm Core) for thermal insulation in PEB warehouses.',
    uom: 'Sq Mtr',
    specifications: { core_density: '40 kg/m3', thermal_conductivity: 'Low', application: 'Cold storage & PEB roofing' },
  },
  // 10. Industrial Rolling Shutter Patti / Slats
  {
    sku: 'CR-SHUTTER-PATTI-18G',
    name: 'Industrial Rolling Shutter Patti / Slats (18G / 20G Cold Rolled)',
    category: 'CR_COIL',
    brand: 'Burrabazar Local Rolling',
    mill_name: 'Burrabazar Shutter Mills',
    grade: 'IS 513 CR',
    hsn_code: '7308.30',
    thickness_mm: 1.2,
    width_mm: 75,
    length_mm: 3000,
    coating: 'NONE',
    price_per_ton_inr: 68,
    minimum_order_tons: 2,
    inventory_tons: 320,
    is_in_stock: true,
    description: 'Industrial Rolling Shutter Patti / Slats (18G / 20G Cold Rolled) for commercial storefronts.',
    uom: 'Kg',
    specifications: { gauge: '18G / 20G', finish: 'Cold Rolled CR', application: 'Rolling shutters' },
  },
  // 11. 24-Inch Wind Turbo Ventilator
  {
    sku: 'ACC-TURBO-VENT-24',
    name: '24-Inch Wind Turbo Ventilator with Aluminum Base',
    category: 'ROOFING_ACCESSORY',
    brand: 'Aeroflow',
    mill_name: 'Ventilation Dynamics',
    grade: 'Aluminum / Stainless Bearings',
    hsn_code: '8414.59',
    thickness_mm: 1.2,
    width_mm: 600,
    length_mm: 600,
    coating: 'CUSTOM',
    price_per_ton_inr: 3850,
    minimum_order_tons: 2,
    inventory_tons: 95,
    is_in_stock: true,
    description: '24-Inch Wind Turbo Ventilator with Aluminum Base. Zero electricity roof ventilation.',
    uom: 'Unit',
    specifications: { throat_diameter: '24 inch', material: 'Aluminum', bearing: 'SKF Sealed' },
  },
  // 12. Galvanized GI Binding Wire
  {
    sku: 'ACC-GI-BINDING-WIRE',
    name: 'Galvanized GI Binding Wire (20G Soft Annealed)',
    category: 'ROOFING_ACCESSORY',
    brand: 'Tata Wiron',
    mill_name: 'Tata Steel Wire Division',
    grade: 'Soft Annealed',
    hsn_code: '7217.20',
    thickness_mm: 1.2,
    width_mm: 0,
    length_mm: 0,
    coating: '120GSM',
    price_per_ton_inr: 74,
    minimum_order_tons: 25,
    inventory_tons: 450,
    is_in_stock: true,
    description: 'Galvanized GI Binding Wire (20G Soft Annealed, 25kg bundles) for rebar tying.',
    uom: 'Kg',
    specifications: { gauge: '18G / 20G', bundle_weight: '25 kg', finish: 'Soft Annealed' },
  },
  // Standard profile sheet
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
    description: 'Pre-painted galvalume profiled roofing sheet in Castle Blue.',
    uom: 'MT',
    specifications: { yield_strength_mpa: 240, colour: 'Castle Blue' },
  },
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
    description: 'High-strength TMT reinforcement bar with ductility class D.',
    uom: 'MT',
    specifications: { yield_strength_mpa: 500, elongation_pct: 16 },
  }
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
      console.log(`  ${p.sku.padEnd(25)} ${p.brand.padEnd(22)} ₹${p.price_per_ton_inr}/${p.uom || 'MT'}  ${p.name}`);
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
        p.description, JSON.stringify(p.specifications ?? {}), p.uom || 'MT', SEEDER,
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
