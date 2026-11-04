/**
 * Seeds the platform layer: brands, suppliers, market rates, blog posts,
 * community groups, and the brand/product links.
 *
 * Idempotent — every write is an upsert keyed on a stable id or slug, so
 * re-running it refreshes the content instead of duplicating it. The existing
 * 21-SKU `products` catalogue is only touched through the additive columns
 * (brand_id, city, supplier_name, colour, is_featured, is_verified, price
 * range, lead time); no existing value is ever overwritten with a null.
 *
 * Usage:
 *   node seed-platform.js
 */
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ===========================================================================
// Brands — national and regional, per the catalogue brief
// ===========================================================================

const BRANDS = [
  {
    id: 'brand_tata_steel',
    slug: 'tata-steel',
    name: 'Tata Steel',
    short_name: 'Tata',
    origin: 'national',
    tagline: 'India’s strongest steel brand, built on 110+ years of Tata engineering.',
    description:
      'Tata Steel is India’s most recognised steel brand, with mills at Jamshedpur, Kalinganagar and Joda producing Tiscon TMT bars, Galvalume and colour-coated roofing, and HR coils. Tata Tiscon is the benchmark every other TMT brand is measured against, and Tata BlueScope’s AZ-150 Galvalume is the de facto standard for quality roofing in the Indian market.',
    website: 'https://www.tatasteel.com',
    founded_year: 1912,
    headquarters: 'Jamshedpur, Jharkhand',
    mill_locations: ['Jamshedpur, Jharkhand', 'Kalinganagar, Odisha', 'Joda, Odisha'],
    capacity: '30 MTPA TMT and 5 MTPA wire rod',
    product_lines: [
      'TMT Bars',
      'Structural Steel',
      'Galvalume & Colour Coated Roofing',
      'HR Coils',
      'Wire Rods',
      'Tata BlueScope',
    ],
    certifications: ['BIS IS 1786:2016', 'ISO 9001', 'Tata GreenPro'],
    brand_color: '#2563EB',
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'brand_jindal_india',
    slug: 'jindal-india',
    name: 'Jindal (India) Ltd',
    short_name: 'Jindal',
    origin: 'national',
    tagline: '350,000 MTPA of galvanised and colour-coated capacity from Howrah, West Bengal.',
    description:
      'Jindal (India) Ltd operates its flagship Jangalpur and Ranihati complex in Howrah, West Bengal — one of the largest galvanised sheet plants in the country at 350,000 MTPA. The portfolio spans Jindal Sabrang pre-coated sheets, Jindal Neucolor+, Jindalume Al-Zn Galvalume, IS 277 galvanised sheets, IS 1239 black and GI ERW pipes, and API 5L Grade HFW line pipes. Being a Bengal-based producer, Jindal is the natural stockist partner for Burrabazar buyers.',
    website: 'https://www.jindalindia.com',
    founded_year: 1988,
    headquarters: 'Howrah, West Bengal',
    mill_locations: ['Jangalpur, Howrah, West Bengal', 'Ranihati, Howrah, West Bengal'],
    capacity: '350,000 MTPA galvanised and colour coated',
    product_lines: [
      'Jindal Sabrang',
      'Jindal Neucolor+',
      'Jindalume Al-Zn Galvalume',
      'Galvanised Sheets IS 277',
      'ERW Pipes IS 1239',
      'HFW Line Pipes API 5L',
    ],
    certifications: ['BIS IS 277', 'BIS IS 1239', 'API 5L', 'ISO 9001'],
    brand_color: '#1D4ED8',
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'brand_sail',
    slug: 'sail',
    name: 'Steel Authority of India Limited',
    short_name: 'SAIL',
    origin: 'national',
    tagline: 'India’s largest public-sector steelmaker, owner of the SeQR TMT brand.',
    description:
      'SAIL is the largest steelmaker in India by capacity, with integrated plants at Bokaro, Rourkela, Durgapur, Burnpur and Bhilai. Its SeQR TMT bar is copper-chromium alloyed for corrosion resistance, and SAIL also supplies IS 2062 E250 hot-rolled plates, HR coils and galvanised sheets for the eastern Indian market.',
    website: 'https://sail.co.in',
    founded_year: 1974,
    headquarters: 'New Delhi',
    mill_locations: ['Bokaro, Jharkhand', 'Rourkela, Odisha', 'Durgapur, West Bengal', 'Bhilai, Chhattisgarh'],
    capacity: 'Over 20 MTPA of crude steel and 1 MTPA of rails',
    product_lines: ['SeQR TMT Bars', 'HR Coils', 'HR Plates', 'Galvanised Sheets', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'BIS IS 2062', 'ISO 9001'],
    brand_color: '#0EA5E9',
    is_featured: true,
    sort_order: 3,
  },
  {
    id: 'brand_jsw_steel',
    slug: 'jsw-steel',
    name: 'JSW Steel',
    short_name: 'JSW',
    origin: 'national',
    tagline: 'Neosteel, One Helix pipes and colour-coated coils from a 16 MTPA complex.',
    description:
      'JSW Steel’s Vijayanagar and Ballari plants produce Neosteel TMT in Fe 550D, 600 and CRS grades, IS 808 structural I-beams, HR sheets, and the One Helix brand of ERW pipes. Its coated coils plant at Vasanthapuram feeds the colour-coated roofing sheet business, one of the largest in India.',
    website: 'https://www.jswsteel.in',
    founded_year: 2007,
    headquarters: 'Bengaluru, Karnataka',
    mill_locations: ['Vijayanagar, Karnataka', 'Ballari, Karnataka', 'Vasanthapuram, Andhra Pradesh'],
    capacity: '16 MTPA of steel and 15 MTPA of painted coils',
    product_lines: ['Neosteel TMT', 'Structural Sections', 'HR Sheets', 'One Helix Pipes', 'Colour Coated Coils'],
    certifications: ['BIS IS 1786', 'BIS IS 808', 'BIS IS 4923', 'ISO 9001'],
    brand_color: '#1E40AF',
    is_featured: true,
    sort_order: 4,
  },
  {
    id: 'brand_jindal_panther',
    slug: 'jindal-panther',
    name: 'Jindal Panther',
    short_name: 'JSP',
    origin: 'national',
    tagline: 'A dedicated TMT producer with plants across eastern and central India.',
    description:
      'Jindal Panther (JSP) is a focused long-products producer with TMT bar capacity at Raigarh, Bokaro, Tisco and Mahasweta. Fe 500D and Fe 550D grades are produced on modern long-product lines with consistent rib geometry.',
    website: 'https://www.jindalpanther.com',
    founded_year: 2008,
    headquarters: 'Raigarh, Chhattisgarh',
    mill_locations: ['Raigarh, Chhattisgarh', 'Bokaro, Jharkhand', 'Tisco, Jharkhand', 'Mahasweta, Chhattisgarh'],
    capacity: '2.4 MTPA of TMT',
    product_lines: ['TMT Bars Fe 500D', 'TMT Bars Fe 550D', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'ISO 9001'],
    brand_color: '#334155',
    is_featured: true,
    sort_order: 5,
  },
  {
    id: 'brand_vizag_steel',
    slug: 'vizag-steel',
    name: 'Vizag Steel Plant (RINL)',
    short_name: 'RINL',
    origin: 'national',
    tagline: 'A public-sector long-products producer from the Andhra coast.',
    description:
      'Rashtriya Ispat Nigam Limited’s Vizag Steel Plant produces Fe 500D and Fe 550D TMT bars from its blast-furnace and long-products route, and is a recognised alternative mill in the southern and eastern markets.',
    website: 'https://rinl.co.in',
    founded_year: 1963,
    headquarters: 'Visakhapatnam, Andhra Pradesh',
    mill_locations: ['Visakhapatnam, Andhra Pradesh'],
    capacity: '3 MTPA of TMT bars',
    product_lines: ['TMT Bars Fe 500D', 'TMT Bars Fe 550D', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'ISO 9001'],
    brand_color: '#0891B2',
    is_featured: true,
    sort_order: 6,
  },
  {
    id: 'brand_srmb',
    slug: 'srmb',
    name: 'SRMB Srijan',
    short_name: 'SRMB',
    origin: 'regional',
    tagline: 'Bengal’s benchmark TMT, with Belgian Tempcore and WinGrip rib geometry.',
    description:
      'SRMB Srijan operates a block mill at Durgapur and a billet plant at Rourkela, producing Fe 550D and Fe 500D TMT bars using Belgian Tempcore technology with WinGrip rib geometry. Its RealRing TMT, RealEdge Galvalume, RealRoof roofing and RealFabrica hollow sections make it the most recognisable eastern-Indian brand among contractors.',
    website: 'https://srmbgroup.com',
    founded_year: 2007,
    headquarters: 'Kolkata, West Bengal',
    mill_locations: ['Durgapur, West Bengal', 'Rourkela, Odisha'],
    capacity: '1.5 MTPA of TMT bars',
    product_lines: [
      'SRMB RealRing TMT',
      'SRMB RealEdge Galvalume',
      'SRMB RealRoof',
      'SRMB RealFabrica Hollow Sections',
      'Structural Steel',
    ],
    certifications: ['BIS IS 1786', 'BIS IS 4923', 'ISO 9001'],
    brand_color: '#F97316',
    is_featured: true,
    sort_order: 7,
  },
  {
    id: 'brand_shyam_steel',
    slug: 'shyam-steel',
    name: 'Shyam Steel',
    short_name: 'Shyam',
    origin: 'regional',
    tagline: 'Durgapur’s Fe 500D and Fe 550D specialist, built for Bengal.',
    description:
      'Shyam Steel’s Durgapur plant produces BIS IS 1786 certified Fe 500D and Fe 550D TMT bars. Being a Bengal mill, it holds a structural cost advantage over coastal brands for Kolkata, Howrah and North Bengal deliveries.',
    website: 'https://shyamsteel.com',
    founded_year: 1998,
    headquarters: 'Durgapur, West Bengal',
    mill_locations: ['Durgapur, West Bengal'],
    capacity: '0.6 MTPA of TMT bars',
    product_lines: ['TMT Bars Fe 500D', 'TMT Bars Fe 550D', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'ISO 9001'],
    brand_color: '#EA580C',
    is_featured: true,
    sort_order: 8,
  },
  {
    id: 'brand_rashmi_metaliks',
    slug: 'rashmi-metaliks',
    name: 'Rashmi Metaliks',
    short_name: 'Rashmi',
    origin: 'regional',
    tagline: 'A 1.18 MTPA Kharagpur mill producing TMT, DI pipes, pig iron and wire rod.',
    description:
      'Rashmi Metaliks runs an integrated 1.18 MTPA plant at Kharagpur, West Bengal producing EQCR TMT bars in Fe 500D and Fe 550D, ductile iron pipes, pig iron, and AISI 200/300/400 series wire rods. Its proximity to Kolkata makes it a same-day delivery option for Burrabazar buyers.',
    website: 'https://rashmimetaliks.com',
    founded_year: 1990,
    headquarters: 'Kolkata, West Bengal',
    mill_locations: ['Kharagpur, West Bengal'],
    capacity: '1.18 MTPA integrated',
    product_lines: ['TMT Bars Fe 500D', 'TMT Bars Fe 550D EQCR', 'DI Pipes', 'Pig Iron', 'Wire Rods'],
    certifications: ['BIS IS 1786', 'BIS IS 2896', 'ISO 9001'],
    brand_color: '#7C3AED',
    is_featured: true,
    sort_order: 9,
  },
  {
    id: 'brand_captain_steel',
    slug: 'captain-steel',
    name: 'Captain Steel',
    short_name: 'Captain',
    origin: 'regional',
    tagline: 'German Thermex TMT with 620 N/mm² yield and 16% elongation.',
    description:
      'Captain Steel, based in Kalyaneshwari, West Bengal, markets the Captain 600 EQR TMT bar made on German Thermex technology — 600 grade with a minimum yield of 620 N/mm² and minimum elongation of 16%. The range extends to Captain RustGuard fire-resistant TMT, Captain TMT Rings and Captain Wiro wire rod.',
    website: 'https://captainsteel.in',
    founded_year: 1999,
    headquarters: 'Kalyaneshwari, West Bengal',
    mill_locations: ['Kalyaneshwari, West Bengal', 'Rajnandgaon, Chhattisgarh'],
    capacity: '0.9 MTPA of TMT bars',
    product_lines: [
      'Captain 600 EQR TMT',
      'Captain RustGuard FBE',
      'Captain TMT Rings',
      'Captain Wiro',
    ],
    certifications: ['BIS IS 1786', 'German Thermex Technology', 'ISO 9001'],
    brand_color: '#DC2626',
    is_featured: true,
    sort_order: 10,
  },
  {
    id: 'brand_super_shakti',
    slug: 'super-shakti',
    name: 'Super Smelters (Super Shakti)',
    short_name: 'Super Shakti',
    origin: 'regional',
    tagline: 'Durgapur and Jamuria: Fe 550D, SD Super Ductile pipes, coils and structurals.',
    description:
      'Super Smelters operates integrated plants at Durgapur and Jamuria in West Bengal, producing Fe 550D TMT bars, SD Super Ductile MS pipes, hot-rolled coils and structural sections. The Jamuria plant is one of the closest integrated steel plants to Burrabazar.',
    website: 'https://supersmelters.com',
    founded_year: 1975,
    headquarters: 'Durgapur, West Bengal',
    mill_locations: ['Durgapur, West Bengal', 'Jamuria, West Bengal'],
    capacity: '0.7 MTPA of long and flat products',
    product_lines: ['TMT Bars Fe 550D', 'SD Super Ductile Pipes', 'HR Coils', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'BIS IS 9295', 'ISO 9001'],
    brand_color: '#059669',
    is_featured: true,
    sort_order: 11,
  },
  {
    id: 'brand_maithan_steel',
    slug: 'maithan-steel',
    name: 'Maithan Steel',
    short_name: 'Maithan',
    origin: 'regional',
    tagline: 'Eastern India’s high-strength TMT maker in Fe 500, 550D and 600.',
    description:
      'Maithan Steel’s integrated plant at Ghaziabad, Uttar Pradesh and its Bengal presence produce TMT bars in Fe 500, Fe 550D and Fe 600 grades for infrastructure and high-rise projects, with an established distribution network across the eastern region.',
    website: 'https://maithansteel.com',
    founded_year: 1996,
    headquarters: 'Ghaziabad, Uttar Pradesh',
    mill_locations: ['Ghaziabad, Uttar Pradesh'],
    capacity: '1.0 MTPA of TMT bars',
    product_lines: ['TMT Bars Fe 500', 'TMT Bars Fe 550D', 'TMT Bars Fe 600', 'Structural Steel'],
    certifications: ['BIS IS 1786', 'ISO 9001'],
    brand_color: '#0D9488',
    is_featured: false,
    sort_order: 12,
  },
  {
    id: 'brand_shyam_metalics',
    slug: 'shyam-metalics',
    name: 'Shyam Metalics (SEL Tiger)',
    short_name: 'SEL',
    origin: 'regional',
    tagline: 'Durgapur’s galvanised sheet, angle and channel specialist.',
    description:
      'Shyam Metalics, marketed as SEL Tiger, runs a plant at Durgapur producing galvanised sheets from 80 to 120 GSM, GI profile sheets, MS angles and channels, plus colour-coated options. It is a consistent bulk supplier for the eastern roofing and structural trade.',
    website: 'https://shyammetalics.com',
    founded_year: 1988,
    headquarters: 'Durgapur, West Bengal',
    mill_locations: ['Durgapur, West Bengal'],
    capacity: '0.4 MTPA of coated and long products',
    product_lines: ['Galvanised Sheets', 'GI Profile Sheets', 'MS Angles', 'MS Channels', 'Colour Coated Sheets'],
    certifications: ['BIS IS 277', 'BIS IS 2062', 'ISO 9001'],
    brand_color: '#CA8A04',
    is_featured: false,
    sort_order: 13,
  },
  {
    id: 'brand_apl_apollo',
    slug: 'apl-apollo',
    name: 'APL Apollo',
    short_name: 'APL Apollo',
    origin: 'national',
    tagline: 'Structurals and pipes from Raipur, Chhattisgarh.',
    description:
      'APL Apollo Tubes is a large Indian structural and pipe manufacturer with a Raipur plant producing MS angles, channels and square bars, plus a wide ERW pipe portfolio.',
    website: 'https://www.aplapollo.com',
    founded_year: 1969,
    headquarters: 'Raipur, Chhattisgarh',
    mill_locations: ['Raipur, Chhattisgarh'],
    capacity: '2 MTPA of pipes and structurals',
    product_lines: ['MS Angles', 'MS Channels', 'MS Square Bars', 'ERW Pipes'],
    certifications: ['BIS IS 2062', 'ISO 9001'],
    brand_color: '#475569',
    is_featured: false,
    sort_order: 14,
  },
  {
    id: 'brand_essar_steel',
    slug: 'essar-steel',
    name: 'Essar Steel',
    short_name: 'Essar',
    origin: 'national',
    tagline: 'Galvalume from the Bhilai complex.',
    description:
      'Essar Steel’s Bhilai plant in Chhattisgarh produces Al-Zn Galvalume coils and pre-coated colour-coated sheets under the Essar brand, marketed widely in eastern India for roofing applications.',
    website: 'https://www.essarsteel.com',
    founded_year: 1979,
    headquarters: 'Bhilai, Chhattisgarh',
    mill_locations: ['Bhilai, Chhattisgarh'],
    capacity: '1 MTPA of galvanised coils',
    product_lines: ['Galvalume Coils', 'Colour Coated Sheets', 'GI Sheets'],
    certifications: ['BIS IS 277', 'ISO 9001'],
    brand_color: '#64748B',
    is_featured: false,
    sort_order: 15,
  },
  {
    id: 'brand_akshay_mahan',
    slug: 'akshay-mahan',
    name: 'Akshay Mahan NMC',
    short_name: 'AM/NS',
    origin: 'regional',
    tagline: 'CR coils and colour-coated roofing for the eastern trade.',
    description:
      'Akshay Mahan produces cold-rolled coils, galvalume and colour-coated profile sheets under the AM/NS brand, supplying eastern India’s roofing and fabrication trade.',
    website: 'https://akshaymahan.com',
    founded_year: 2003,
    headquarters: 'Bihar / West Bengal',
    mill_locations: ['Bihar', 'West Bengal'],
    capacity: '0.3 MTPA of coated products',
    product_lines: ['CR Coils', 'PPGL Coils', 'PPGL Profile Sheets', 'Galvalume'],
    certifications: ['BIS IS 513', 'BIS IS 277', 'ISO 9001'],
    brand_color: '#9333EA',
    is_featured: false,
    sort_order: 16,
  },
  {
    id: 'brand_manaksia',
    slug: 'manaksia-steels',
    name: 'Manaksia Steels Limited',
    short_name: 'Manaksia',
    origin: 'regional',
    tagline: 'Value-added steel products including PPGI, GI sheets and Cold Rolled coils.',
    description:
      'Manaksia Steels Limited, part of the Manaksia Group, is a major producer of value-added steel products in India. Its product profile includes Cold Rolled Coils, Galvanised Steel Sheets, and Colour Coated (PPGI) coils and sheets. Based in Kolkata, it serves as a key supplier for construction, automotive, and consumer durable industries across West Bengal and international markets.',
    website: 'https://www.manaksiasteels.com',
    founded_year: 2001,
    headquarters: 'Kolkata, West Bengal',
    mill_locations: ['Haldia, West Bengal', 'Kutch, Gujarat'],
    capacity: '0.12 MTPA of coated products',
    product_lines: [
      'PPGI Coils & Sheets',
      'Galvanised Sheets (GI)',
      'Cold Rolled Coils (CR)',
      'GC Sheets',
    ],
    certifications: ['ISO 9001:2015', 'BIS Certified'],
    brand_color: '#B91C1C',
    is_featured: true,
    sort_order: 17,
  },
  {
    id: 'brand_surya_roshni',
    slug: 'surya-roshni',
    name: 'Surya Roshni Limited',
    short_name: 'Surya',
    origin: 'national',
    tagline: 'India’s leading manufacturer of GI, ERW Black and Hollow Sections.',
    description:
      'Surya Roshni is one of India’s largest manufacturers of steel pipes and tubes. Their comprehensive range includes ERW Black Pipes, Galvanised Steel Pipes (GI), and Structural Hollow Sections (SHS/RHS/CHS). They are a major exporter to over 50 countries and a trusted name in infrastructure and agriculture sectors.',
    website: 'https://surya.co.in',
    founded_year: 1973,
    headquarters: 'New Delhi',
    mill_locations: ['Bahadurgarh, Haryana', 'Gwalior, M.P.', 'Bhuj, Gujarat', 'Hindupur, A.P.'],
    capacity: '1.2 MTPA of pipes and tubes',
    product_lines: [
      'GI Pipes',
      'ERW Black Pipes',
      'Hollow Sections',
      'API Line Pipes',
      'CR Strips',
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'ISI', 'API 5L'],
    brand_color: '#FACC15',
    is_featured: true,
    sort_order: 18,
  },
  {
    id: 'brand_hitech_pipes',
    slug: 'hitech-pipes',
    name: 'Hi-Tech Pipes Limited',
    short_name: 'Hi-Tech',
    origin: 'national',
    tagline: 'Innovative steel piping solutions for infrastructure and solar energy.',
    description:
      'Hi-Tech Pipes Limited is a leading manufacturer of ERW steel tubes, hollow sections, and cold-rolled products. They specialize in innovative solutions like solar mounting structures and road crash barriers, alongside their core GI and Black pipe offerings. With multiple manufacturing units across India, they provide high-quality steel for diverse industrial applications.',
    website: 'https://hitechpipes.in',
    founded_year: 1985,
    headquarters: 'New Delhi',
    mill_locations: ['Sikandrabad, U.P.', 'Sanand, Gujarat', 'Hindupur, A.P.'],
    capacity: '0.58 MTPA',
    product_lines: [
      'ERW Steel Pipes',
      'Hollow Sections',
      'Solar Mounting Structures',
      'CR Coils',
      'GP Pipes',
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'BIS'],
    brand_color: '#1D4ED8',
    is_featured: false,
    sort_order: 19,
  },
  {
    id: 'brand_jindal_star',
    slug: 'jindal-star',
    name: 'Jindal Pipes Limited (Jindal Star)',
    short_name: 'Jindal Star',
    origin: 'national',
    tagline: 'Synonymous with high-quality GI and ERW pipes for over 50 years.',
    description:
      'Jindal Pipes Limited, marketed under the "Jindal Star" brand, is a flagship of the B.C. Jindal Group. They are pioneers in the manufacturing of ERW Black and Galvanised pipes, serving water supply, agriculture, and oil & gas sectors. Their pipes are recognized for durability and strict compliance with national and international standards.',
    website: 'https://jindalstar.in',
    founded_year: 1970,
    headquarters: 'New Delhi',
    mill_locations: ['Ghaziabad, U.P.', 'Nagothane, Maharashtra', 'Bellary, Karnataka'],
    capacity: '0.6 MTPA',
    product_lines: [
      'GI Pipes',
      'ERW Black Pipes',
      'Structural Hollow Sections',
      'Casing & Tubing',
    ],
    certifications: ['ISO 9001', 'ISI', 'API'],
    brand_color: '#1E3A8A',
    is_featured: true,
    sort_order: 20,
  },
  {
    id: 'brand_tata_pipes',
    slug: 'tata-pipes',
    name: 'Tata Pipes',
    short_name: 'Tata Pipes',
    origin: 'national',
    tagline: 'The most trusted brand for commercial and plumbing steel tubes.',
    description:
      'Tata Pipes, a division of Tata Steel, is India’s oldest and most trusted brand in the steel tube sector. Their range includes commercial tubes, structural tubes, and specialized agricultural pipes. Built on the legacy of Tata Steel, they offer unmatched quality, corrosion resistance, and longevity in plumbing and structural applications.',
    website: 'https://www.tatasteel.com',
    founded_year: 1912,
    headquarters: 'Kolkata, West Bengal',
    mill_locations: ['Jamshedpur, Jharkhand', 'Sahibabad, U.P.'],
    capacity: '0.5 MTPA',
    product_lines: [
      'Commercial Tubes (GI/Black)',
      'Structural Tubes',
      'Agricultural Pipes',
      'Precision Tubes',
    ],
    certifications: ['IS 1239', 'IS 1161', 'IS 4923', 'ISO 9001'],
    brand_color: '#2563EB',
    is_featured: true,
    sort_order: 21,
  },
  {
    id: 'brand_zenith_birla',
    slug: 'zenith-birla',
    name: 'Zenith Birla (India) Limited',
    short_name: 'Zenith',
    origin: 'national',
    tagline: 'Legacy manufacturers of premium GI and ERW pipes since 1960.',
    description:
      'Zenith Birla is one of India’s oldest manufacturers of steel pipes, known for its high-quality Galvanised (GI) and Black ERW pipes. Their products are widely used in firefighting systems, water transportation, and structural fabrication. Zenith remains a strong national player with a reputation for consistency and reliability.',
    website: 'https://zenithbirla.com',
    founded_year: 1960,
    headquarters: 'Mumbai, Maharashtra',
    mill_locations: ['Khopoli, Maharashtra'],
    capacity: '0.15 MTPA',
    product_lines: [
      'GI Pipes',
      'ERW Black Pipes',
      'Structural Tubes',
    ],
    certifications: ['ISO 9001', 'ISI'],
    brand_color: '#0F172A',
    is_featured: false,
    sort_order: 22,
  },
  {
    id: 'brand_nezone',
    slug: 'nezone-group',
    name: 'Nezone Group',
    short_name: 'Nezone',
    origin: 'regional',
    tagline: 'Specialists in GI pipes and hollow sections with a strong presence in East India.',
    description:
      'Nezone Group is a leading manufacturer of steel pipes and tubes, particularly strong in the North-East and Eastern Indian markets. Their portfolio features high-quality GI pipes and structural hollow sections used extensively in construction and infrastructure. They are known for regional accessibility and competitive pricing.',
    website: 'http://nezonegroup.com',
    founded_year: 1981,
    headquarters: 'Kolkata, West Bengal',
    mill_locations: ['Guwahati, Assam', 'Meghalaya', 'Kolkata, W.B.'],
    capacity: '0.3 MTPA',
    product_lines: [
      'GI Pipes',
      'Black Steel Pipes',
      'Hollow Sections (SHS/RHS)',
    ],
    certifications: ['ISO 9001', 'ISI'],
    brand_color: '#065F46',
    is_featured: false,
    sort_order: 23,
  },
];

// ===========================================================================
// Suppliers — mills, stockists and traders
// ===========================================================================

const SUPPLIERS = [
  {
    id: 'sup_singhi_enterprises',
    slug: 'singhi-enterprises',
    name: 'Singhi Enterprises',
    brand_id: null,
    supplier_type: 'trader',
    city: 'Kolkata',
    state: 'West Bengal',
    gstin: '19ABCPS1234A1Z5',
    phone: '+91 98830 51500',
    whatsapp: '919883051500',
    email: 'hello@steelsetu.com',
    website: 'https://steelsetu.com',
    address: 'Burrabazar, Kolkata, West Bengal 700001',
    rating: 4.8,
    review_count: 214,
    min_order_tons: 1,
    established_year: 1994,
    description:
      'The trading house behind Steelsetu, operating out of Burrabazar, Kolkata since 1994. We aggregate TMT, structural steel, HR coils, GI/PPGL roofing and plates from national and eastern regional mills, and deliver across West Bengal with our own fleet.',
    specialties: ['TMT Bars', 'Structural Steel', 'HR Coils', 'GI/PPGL Roofing', 'Steel Plates'],
    is_verified: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'sup_tata_jamshedpur',
    slug: 'tata-steel-jamshedpur',
    name: 'Tata Steel — Jamshedpur Works',
    brand_id: 'brand_tata_steel',
    supplier_type: 'mill',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gstin: '20AAACT7324C1ZS',
    phone: '+91 657 242 1000',
    whatsapp: '919883051500',
    email: 'sales@tatasteel.com',
    website: 'https://www.tatasteel.com',
    address: 'Jamshedpur, Jharkhand 831002',
    rating: 4.9,
    review_count: 512,
    min_order_tons: 20,
    established_year: 1912,
    description:
      'The original Tata Steel integrated works at Jamshedpur — Tiscon TMT, HR coils and structural steel, with a dealer network that reaches every major consuming centre in India.',
    specialties: ['Tata Tiscon TMT', 'HR Coils', 'Structural Sections', 'Wire Rods'],
    is_verified: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'sup_jindal_howrah',
    slug: 'jindal-howrah',
    name: 'Jindal (India) Ltd — Howrah Works',
    brand_id: 'brand_jindal_india',
    supplier_type: 'mill',
    city: 'Howrah',
    state: 'West Bengal',
    gstin: '19AAACJ2001F1Z8',
    phone: '+91 33 2643 8000',
    whatsapp: '919883051500',
    email: 'sales@jindalindia.com',
    website: 'https://www.jindalindia.com',
    address: 'Jangalpur & Ranihati, Howrah, West Bengal 711302',
    rating: 4.7,
    review_count: 288,
    min_order_tons: 15,
    established_year: 1988,
    description:
      'Jindal’s Jangalpur and Ranihati galvanising complex in Howrah — 350,000 MTPA of Galvalume, Jindalume, Sabrang pre-coated, Neucolor+ and IS 1239 pipe capacity, and the closest major mill to Burrabazar.',
    specialties: ['Jindalume Galvalume', 'Jindal Sabrang', 'Jindal Neucolor+', 'GI ERW Pipes'],
    is_verified: true,
    is_featured: true,
    sort_order: 3,
  },
  {
    id: 'sup_sail_bokaro',
    slug: 'sail-bokaro',
    name: 'SAIL — Bokaro Steel Plant',
    brand_id: 'brand_sail',
    supplier_type: 'mill',
    city: 'Bokaro',
    state: 'Jharkhand',
    gstin: '20AAACS7324C1ZP',
    phone: '+91 654 232 2111',
    whatsapp: '919883051500',
    email: 'secr_bsp@sail.co.in',
    website: 'https://sail.co.in',
    address: 'Bokaro Steel City, Bokaro, Jharkhand 827001',
    rating: 4.5,
    review_count: 341,
    min_order_tons: 25,
    established_year: 1965,
    description:
      'Bokaro Steel Plant — India’s largest integrated public-sector steelworks, producing SeQR TMT bars, HR coils and galvanised sheets with captive rail and structurals lines.',
    specialties: ['SAIL SeQR TMT', 'HR Coils', 'Galvanised Sheets', 'HR Plates'],
    is_verified: true,
    is_featured: true,
    sort_order: 4,
  },
  {
    id: 'sup_jsw_vijayanagar',
    slug: 'jsw-vijayanagar',
    name: 'JSW Steel — Vijayanagar',
    brand_id: 'brand_jsw_steel',
    supplier_type: 'mill',
    city: 'Ballari',
    state: 'Karnataka',
    gstin: '29AAACJ1955B1Z6',
    phone: '+91 8395 268 000',
    whatsapp: '919883051500',
    email: 'sales@jswsteel.in',
    website: 'https://www.jswsteel.in',
    address: 'Vijayanagar, Ballari, Karnataka 583154',
    rating: 4.6,
    review_count: 276,
    min_order_tons: 20,
    established_year: 2007,
    description:
      'JSW’s Vijayanagar complex — Neosteel TMT in Fe 550D, 600 and CRS, IS 808 structural sections and HR sheets, with the Vasanthapuram coated-coils plant feeding the roofing business.',
    specialties: ['JSW Neosteel TMT', 'IS 808 I-Beams', 'HR Sheets', 'One Helix Pipes'],
    is_verified: true,
    is_featured: true,
    sort_order: 5,
  },
  {
    id: 'sup_srmb_durgapur',
    slug: 'srmb-durgapur',
    name: 'SRMB Srijan — Durgapur Block Mill',
    brand_id: 'brand_srmb',
    supplier_type: 'mill',
    city: 'Durgapur',
    state: 'West Bengal',
    gstin: '19AADCS0621F1ZV',
    phone: '+91 343 255 8000',
    whatsapp: '919883051500',
    email: 'info@srmbsrijan.com',
    website: 'https://srmbgroup.com',
    address: 'Durgapur, West Bengal 713216',
    rating: 4.7,
    review_count: 198,
    min_order_tons: 10,
    established_year: 2007,
    description:
      'SRMB’s Durgapur block mill and Rourkela billet plant — Fe 550D and Fe 500D TMT on Belgian Tempcore lines with WinGrip ribs, plus RealEdge Galvalume and RealRoof.',
    specialties: ['SRMB RealRing TMT', 'SRMB RealEdge Galvalume', 'SRMB RealRoof', 'RealFabrica Hollow Sections'],
    is_verified: true,
    is_featured: true,
    sort_order: 6,
  },
  {
    id: 'sup_shyam_steel_durgapur',
    slug: 'shyam-steel-durgapur',
    name: 'Shyam Steel — Durgapur',
    brand_id: 'brand_shyam_steel',
    supplier_type: 'mill',
    city: 'Durgapur',
    state: 'West Bengal',
    gstin: '19AAECS1421K1ZT',
    phone: '+91 343 254 7000',
    whatsapp: '919883051500',
    email: 'sales@shyamsteel.com',
    website: 'https://shyamsteel.com',
    address: 'Durgapur, West Bengal 713216',
    rating: 4.4,
    review_count: 154,
    min_order_tons: 8,
    established_year: 1998,
    description:
      'Shyam Steel’s Durgapur plant — BIS IS 1786 certified Fe 500D and Fe 550D TMT with a strong Bengal dealer network and competitive landed rates.',
    specialties: ['Shyam Steel Fe 500D', 'Shyam Steel Fe 550D'],
    is_verified: true,
    is_featured: true,
    sort_order: 7,
  },
  {
    id: 'sup_rashmi_kharagpur',
    slug: 'rashmi-metaliks-kharagpur',
    name: 'Rashmi Metaliks — Kharagpur',
    brand_id: 'brand_rashmi_metaliks',
    supplier_type: 'mill',
    city: 'Kharagpur',
    state: 'West Bengal',
    gstin: '19AAACR5132M1Z8',
    phone: '+91 3220 255 001',
    whatsapp: '919883051500',
    email: 'info@rashmimetaliks.com',
    website: 'https://rashmimetaliks.com',
    address: 'Kharagpur, Paschim Medinipur, West Bengal 721103',
    rating: 4.6,
    review_count: 167,
    min_order_tons: 5,
    established_year: 1990,
    description:
      'Rashmi Metaliks’ 1.18 MTPA Kharagpur plant — EQCR TMT bars in Fe 500D and Fe 550D, ductile iron pipes, pig iron and AISI 200/300/400 wire rods, with same-day access to Kolkata.',
    specialties: ['Rashmi EQCR TMT', 'DI Pipes', 'Pig Iron', 'Wire Rods'],
    is_verified: true,
    is_featured: true,
    sort_order: 8,
  },
  {
    id: 'sup_captain_kalyaneshwari',
    slug: 'captain-steel-kalyaneshwari',
    name: 'Captain Steel — Kalyaneshwari',
    brand_id: 'brand_captain_steel',
    supplier_type: 'mill',
    city: 'Kalyaneshwari',
    state: 'West Bengal',
    gstin: '19AABCC4521E1ZT',
    phone: '+91 342 254 9000',
    whatsapp: '919883051500',
    email: 'sales@captainsteel.in',
    website: 'https://captainsteel.in',
    address: 'Kalyaneshwari, West Bengal 712146',
    rating: 4.5,
    review_count: 132,
    min_order_tons: 8,
    established_year: 1999,
    description:
      'Captain Steel’s German Thermex plant at Kalyaneshwari — Captain 600 EQR at 620 N/mm² yield with 16% minimum elongation, plus RustGuard fire-resistant TMT.',
    specialties: ['Captain 600 EQR TMT', 'Captain RustGuard FBE', 'Captain TMT Rings', 'Captain Wiro'],
    is_verified: true,
    is_featured: true,
    sort_order: 9,
  },
  {
    id: 'sup_super_jamuria',
    slug: 'super-smelters-jamuria',
    name: 'Super Smelters — Jamuria',
    brand_id: 'brand_super_shakti',
    supplier_type: 'mill',
    city: 'Jamuria',
    state: 'West Bengal',
    gstin: '19AAECS3210F1ZB',
    phone: '+91 351 225 4000',
    whatsapp: '919883051500',
    email: 'sales@supersmelters.com',
    website: 'https://supersmelters.com',
    address: 'Jamuria, Burdwan, West Bengal 713407',
    rating: 4.3,
    review_count: 98,
    min_order_tons: 10,
    established_year: 1975,
    description:
      'Super Smelters’ Jamuria and Durgapur works — Fe 550D TMT, SD Super Ductile MS pipes, hot-rolled coils and structural sections, among the closest integrated plants to Kolkata.',
    specialties: ['Super Shakti Fe 550D', 'SD Super Ductile Pipes', 'HR Coils', 'Structural Steel'],
    is_verified: true,
    is_featured: true,
    sort_order: 10,
  },
  {
    id: 'sup_jindal_raigarh',
    slug: 'jindal-panther-raigarh',
    name: 'Jindal Panther — Raigarh',
    brand_id: 'brand_jindal_panther',
    supplier_type: 'mill',
    city: 'Raigarh',
    state: 'Chhattisgarh',
    gstin: '22AACCJ7812D1Z4',
    phone: '+91 771 223 4000',
    whatsapp: '919883051500',
    email: 'sales@jindalpanther.com',
    website: 'https://www.jindalpanther.com',
    address: 'Raigarh, Chhattisgarh 496001',
    rating: 4.2,
    review_count: 87,
    min_order_tons: 20,
    established_year: 2008,
    description:
      'Jindal Panther’s Raigarh long-products plant — Fe 500D and Fe 550D TMT bars produced on modern lines with consistent rib geometry.',
    specialties: ['Jindal Panther Fe 500D', 'Jindal Panther Fe 550D'],
    is_verified: true,
    is_featured: false,
    sort_order: 11,
  },
  {
    id: 'sup_rinl_vizag',
    slug: 'rinl-vizag',
    name: 'RINL — Vizag Steel Plant',
    brand_id: 'brand_vizag_steel',
    supplier_type: 'mill',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    gstin: '37AAACR6771E1ZQ',
    phone: '+91 891 250 1000',
    whatsapp: '919883051500',
    email: 'sale@rinl.co.in',
    website: 'https://rinl.co.in',
    address: 'Visakhapatnam, Andhra Pradesh 530011',
    rating: 4.1,
    review_count: 64,
    min_order_tons: 25,
    established_year: 1963,
    description:
      'Rashtriya Ispat Nigam’s Vizag plant — Fe 500D and Fe 550D TMT bars from a public-sector long-products route, a recognised alternative mill in the east and south.',
    specialties: ['RINL Fe 500D', 'RINL Fe 550D'],
    is_verified: true,
    is_featured: false,
    sort_order: 12,
  },
  {
    id: 'sup_maithan_ghaziabad',
    slug: 'maithan-steel-ghaziabad',
    name: 'Maithan Steel — Ghaziabad',
    brand_id: 'brand_maithan_steel',
    supplier_type: 'mill',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    gstin: '09AAFCM1234D1ZQ',
    phone: '+91 120 417 1000',
    whatsapp: '919883051500',
    email: 'info@maithansteel.com',
    website: 'https://maithansteel.com',
    address: 'Ghaziabad, Uttar Pradesh 201001',
    rating: 4.2,
    review_count: 71,
    min_order_tons: 20,
    established_year: 1996,
    description:
      'Maithan Steel’s integrated Ghaziabad plant — Fe 500, Fe 550D and Fe 600 TMT bars serving infrastructure and high-rise projects across northern and eastern India.',
    specialties: ['Maithan Fe 550D', 'Maithan Fe 600'],
    is_verified: true,
    is_featured: false,
    sort_order: 13,
  },
  {
    id: 'sup_selm_durgapur',
    slug: 'shyam-metalics-durgapur',
    name: 'Shyam Metalics — Durgapur (SEL Tiger)',
    brand_id: 'brand_shyam_metalics',
    supplier_type: 'mill',
    city: 'Durgapur',
    state: 'West Bengal',
    gstin: '19AAGCS8821K1Z9',
    phone: '+91 343 258 3000',
    whatsapp: '919883051500',
    email: 'sales@shyammetalics.com',
    website: 'https://shyammetalics.com',
    address: 'Durgapur, West Bengal 713216',
    rating: 4.3,
    review_count: 112,
    min_order_tons: 5,
    established_year: 1988,
    description:
      'Shyam Metalics’ Durgapur works — galvanised sheets from 80 to 120 GSM, GI profile sheets, MS angles and channels, and colour-coated options under the SEL Tiger brand.',
    specialties: ['GI Sheets 80/120 GSM', 'GI Profile Sheets', 'MS Angles', 'MS Channels'],
    is_verified: true,
    is_featured: false,
    sort_order: 14,
  },
  {
    id: 'sup_apl_raipur',
    slug: 'apl-apollo-raipur',
    name: 'APL Apollo — Raipur',
    brand_id: 'brand_apl_apollo',
    supplier_type: 'mill',
    city: 'Raipur',
    state: 'Chhattisgarh',
    gstin: '22AAACA1234F1ZK',
    phone: '+91 771 223 4000',
    whatsapp: '919883051500',
    email: 'info@aplapollo.com',
    website: 'https://www.aplapollo.com',
    address: 'Raipur, Chhattisgarh 492001',
    rating: 4.2,
    review_count: 89,
    min_order_tons: 10,
    established_year: 1969,
    description:
      'APL Apollo’s Raipur plant — MS angles, channels and square bars in IS 2062 E250, alongside a broad ERW pipe portfolio.',
    specialties: ['MS Angles', 'MS Channels', 'MS Square Bars', 'ERW Pipes'],
    is_verified: true,
    is_featured: false,
    sort_order: 15,
  },
  {
    id: 'sup_essar_bhilai',
    slug: 'essar-steel-bhilai',
    name: 'Essar Steel — Bhilai',
    brand_id: 'brand_essar_steel',
    supplier_type: 'mill',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    gstin: '22AAACE7712M1ZD',
    phone: '+91 771 222 5000',
    whatsapp: '919883051500',
    email: 'sales@essarsteel.com',
    website: 'https://www.essarsteel.com',
    address: 'Bhilai, Chhattisgarh 490021',
    rating: 4.0,
    review_count: 58,
    min_order_tons: 15,
    established_year: 1979,
    description:
      'Essar Steel’s Bhilai complex — Al-Zn Galvalume coils and pre-coated colour-coated sheets for the eastern roofing market.',
    specialties: ['Galvalume Coils', 'Colour Coated Sheets'],
    is_verified: true,
    is_featured: false,
    sort_order: 16,
  },
  {
    id: 'sup_kolkata_stockist',
    slug: 'burrabazar-stockist',
    name: 'Burrabazar Stockist Network',
    brand_id: null,
    supplier_type: 'stockist',
    city: 'Kolkata',
    state: 'West Bengal',
    gstin: '19AAKCB5611H1ZP',
    phone: '+91 33 2235 4400',
    whatsapp: '919883051500',
    email: 'stock@steelsetu.com',
    address: 'Burrabazar, Kolkata, West Bengal 700001',
    rating: 4.4,
    review_count: 156,
    min_order_tons: 1,
    established_year: 1970,
    description:
      'A network of Burrabazar stockists holding TMT, structurals, coils and roofing sheet in ready stock for same-day pickup across Kolkata and Howrah.',
    specialties: ['Ready Stock', 'Small Lot Deliveries', 'All Categories'],
    is_verified: true,
    is_featured: true,
    sort_order: 17,
  },
  {
    id: 'sup_manaksia_sales',
    slug: 'manaksia-sales-network',
    name: 'Manaksia Sales & Distribution Corp',
    brand_id: 'brand_manaksia',
    supplier_type: 'mill',
    city: 'Kolkata',
    state: 'West Bengal',
    gstin: '19AABCC4521E1ZT',
    phone: '+91 342 254 9000',
    whatsapp: '919883051500',
    email: 'sales@manaksiasteels.com',
    website: 'https://www.manaksiasteels.com',
    address: 'Haldia Industrial Area, West Bengal 721602',
    rating: 4.6,
    review_count: 54,
    min_order_tons: 5,
    established_year: 2001,
    description: 'Manaksia Steels Limited works in Haldia — producing value-added PPGI, GI sheets and Cold Rolled coils with strict quality standards.',
    specialties: ['PPGI Coils', 'Galvanised Sheets (GI)', 'Cold Rolled Coils'],
    is_verified: true,
    is_featured: true,
    sort_order: 18,
  },
  {
    id: 'sup_surya_direct',
    slug: 'surya-roshni-direct',
    name: 'Surya Roshni Direct Supply Desk',
    brand_id: 'brand_surya_roshni',
    supplier_type: 'mill',
    city: 'Bahadurgarh',
    state: 'Haryana',
    gstin: '06AAACS8812K1Z8',
    phone: '+91 11 2681 4000',
    whatsapp: '919883051500',
    email: 'sales@surya.co.in',
    website: 'https://surya.co.in',
    address: 'Bahadurgarh, Haryana 124507',
    rating: 4.8,
    review_count: 140,
    min_order_tons: 10,
    established_year: 1973,
    description: 'Surya Roshni’s Bahadurgarh plant — one of India’s largest manufacturers of GI and ERW black pipes, structural hollow sections and API line pipes.',
    specialties: ['GI Pipes', 'ERW Black Pipes', 'Structural Hollow Sections', 'API Line Pipes'],
    is_verified: true,
    is_featured: true,
    sort_order: 19,
  },
  {
    id: 'sup_hitech_pipes',
    slug: 'hitech-pipes-distributors',
    name: 'Hi-Tech Industrial Pipes Hub',
    brand_id: 'brand_hitech_pipes',
    supplier_type: 'authorized_dealer',
    city: 'Sikandrabad',
    state: 'Uttar Pradesh',
    gstin: '09AAACH5671F1Z1',
    phone: '+91 11 4848 0000',
    whatsapp: '919883051500',
    email: 'info@hitechpipes.in',
    website: 'https://hitechpipes.in',
    address: 'Sikandrabad Industrial Area, U.P. 203205',
    rating: 4.7,
    review_count: 76,
    min_order_tons: 8,
    established_year: 1985,
    description: 'Hi-Tech Pipes Limited — specialized ERW steel tubes, hollow sections, solar mounting structures and precision cold-rolled strips.',
    specialties: ['ERW Steel Pipes', 'Hollow Sections', 'Solar Structures', 'CR Coils'],
    is_verified: true,
    is_featured: false,
    sort_order: 20,
  },
  {
    id: 'sup_jindal_star',
    slug: 'jindal-star-channel',
    name: 'Jindal Star National Agency',
    brand_id: 'brand_jindal_star',
    supplier_type: 'mill',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    gstin: '09AACCJ8921B1Z3',
    phone: '+91 120 271 2000',
    whatsapp: '919883051500',
    email: 'sales@jindalstar.in',
    website: 'https://jindalstar.in',
    address: 'Bulandshahr Road, Ghaziabad, U.P. 201001',
    rating: 4.8,
    review_count: 92,
    min_order_tons: 10,
    established_year: 1970,
    description: 'Jindal Pipes Limited (Jindal Star) — pioneers in ERW Black and Galvanised pipes with strict compliance and high durability.',
    specialties: ['GI Pipes', 'ERW Black Pipes', 'Structural Hollow Sections'],
    is_verified: true,
    is_featured: true,
    sort_order: 21,
  },
  {
    id: 'sup_tata_pipes',
    slug: 'tata-tubes-distributor',
    name: 'Tata Steel Tubes & Pipes Division',
    brand_id: 'brand_tata_pipes',
    supplier_type: 'mill',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gstin: '20AAACT1234A1Z9',
    phone: '+91 657 243 0000',
    whatsapp: '919883051500',
    email: 'sales@tatasteel.com',
    website: 'https://www.tatasteel.com',
    address: 'Jamshedpur Works, Jharkhand 831001',
    rating: 4.9,
    review_count: 215,
    min_order_tons: 5,
    established_year: 1912,
    description: 'Tata Pipes, a division of Tata Steel — India’s oldest and most trusted brand in steel tubes for plumbing, structural and agricultural use.',
    specialties: ['Commercial Tubes', 'Structural Tubes', 'Agricultural Pipes', 'Precision Tubes'],
    is_verified: true,
    is_featured: true,
    sort_order: 22,
  },
  {
    id: 'sup_zenith_birla',
    slug: 'zenith-steel-hub',
    name: 'Zenith Steel & Pipe Agencies',
    brand_id: 'brand_zenith_birla',
    supplier_type: 'authorized_dealer',
    city: 'Mumbai',
    state: 'Maharashtra',
    gstin: '27AAACZ3456F1Z5',
    phone: '+91 22 2284 1000',
    whatsapp: '919883051500',
    email: 'info@zenithbirla.com',
    website: 'https://zenithbirla.com',
    address: 'Khopoli Works, Maharashtra 410203',
    rating: 4.5,
    review_count: 48,
    min_order_tons: 5,
    established_year: 1960,
    description: 'Zenith Birla (India) Limited — legacy manufacturer of Galvanised and Black ERW pipes for firefighting and water transport.',
    specialties: ['GI Pipes', 'ERW Black Pipes', 'Structural Tubes'],
    is_verified: true,
    is_featured: false,
    sort_order: 23,
  },
  {
    id: 'sup_nezone',
    slug: 'nezone-east-distributor',
    name: 'Nezone Eastern Logistics & Supply',
    brand_id: 'brand_nezone',
    supplier_type: 'authorized_dealer',
    city: 'Guwahati',
    state: 'Assam',
    gstin: '18AAACN7890B1Z2',
    phone: '+91 361 245 0000',
    whatsapp: '919883051500',
    email: 'info@nezonegroup.com',
    website: 'http://nezonegroup.com',
    address: 'Byrnihat Industrial Area, Meghalaya 793101',
    rating: 4.6,
    review_count: 62,
    min_order_tons: 5,
    established_year: 1981,
    description: 'Nezone Group — leading manufacturer of GI pipes and structural hollow sections with primary focus on Eastern and North-Eastern India.',
    specialties: ['GI Pipes', 'Black Steel Pipes', 'Hollow Sections'],
    is_verified: true,
    is_featured: false,
    sort_order: 24,
  },
];

// ===========================================================================
// Market rates — the live ticker strip
// ===========================================================================

const MARKET_RATES = [
  { id: 'rate_tmt_fe500d', commodity: 'TMT Fe 500D', spec: '12 mm', grade: 'IS 1786 Fe 500D', price: 58500, change_pct: 1.2, city: 'Kolkata', display_order: 1 },
  { id: 'rate_tmt_fe550d', commodity: 'TMT Fe 550D', spec: '12 mm', grade: 'IS 1786 Fe 550D', price: 60500, change_pct: 0.8, city: 'Kolkata', display_order: 2 },
  { id: 'rate_ms_angle', commodity: 'MS Angle', spec: '50 x 50 x 6 mm', grade: 'IS 2062 E250', price: 54800, change_pct: -0.4, city: 'Kolkata', display_order: 3 },
  { id: 'rate_hr_coil', commodity: 'HR Coil', spec: '2.5 mm', grade: 'IS 2062 E250 BR', price: 54000, change_pct: 0.3, city: 'Kolkata', display_order: 4 },
  { id: 'rate_gp_sheet', commodity: 'GP Sheet 120 GSM', spec: '0.60 mm', grade: 'IS 513', price: 71000, change_pct: 0.6, city: 'Kolkata', display_order: 5 },
  { id: 'rate_ppgl_az150', commodity: 'PPGL Coil AZ-150', spec: '0.47 mm', grade: 'IS 277', price: 79000, change_pct: 1.5, city: 'Kolkata', display_order: 6 },
  { id: 'rate_wire_rod', commodity: 'Wire Rod', spec: '6.5 mm', grade: 'AISI 1006', price: 46500, change_pct: -0.9, city: 'Kolkata', display_order: 7 },
];

// ===========================================================================
// Community groups
// ===========================================================================

const COMMUNITY_GROUPS = [
  { id: 'cg_contractors', slug: 'contractors', name: 'Contractors & Site Engineers', description: 'Requirement sharing, site planning and vendor recommendations for active sites.', category: 'Trade', member_count: 4820, post_count: 1264, accent_color: '#2563EB', sort_order: 1 },
  { id: 'cg_fabricators', slug: 'fabricators', name: 'Fabricators & Structural Fabricators', description: 'Cut-and-bend coordination, section availability and job-work sourcing.', category: 'Trade', member_count: 3175, post_count: 902, accent_color: '#F97316', sort_order: 2 },
  { id: 'cg_buyers', slug: 'buyers', name: 'Procurement Buyers', description: 'Enterprise sourcing, tender readiness and rate benchmarking.', category: 'Trade', member_count: 2640, post_count: 718, accent_color: '#0EA5E9', sort_order: 3 },
  { id: 'cg_dealers', slug: 'dealers', name: 'Dealers & Stockists', description: 'Stock movement, territory enquiries and mill allocation.', category: 'Trade', member_count: 1980, post_count: 655, accent_color: '#7C3AED', sort_order: 4 },
  { id: 'cg_logistics', slug: 'logistics', name: 'Logistics & Transport', description: 'Fleet availability, freight rates and delivery coordination.', category: 'Trade', member_count: 860, post_count: 311, accent_color: '#059669', sort_order: 5 },
  { id: 'cg_qa', slug: 'quality', name: 'Quality & Testing', description: 'Mill test certificates, BIS verification and third-party inspection.', category: 'Knowledge', member_count: 640, post_count: 428, accent_color: '#CA8A04', sort_order: 6 },
];

// ===========================================================================
// Blog posts — SEO content for the brand directory
// ===========================================================================

const BLOG_POSTS = [
  {
    id: 'post_tata_steel_brand_guide',
    slug: 'tata-steel-brand-guide-tiscon-bluescope-astrum',
    title: 'Tata Steel: Tiscon, BlueScope and Astrum — Which Product to Specify',
    excerpt:
      'Tata Steel makes three distinct product families — Tiscon TMT, Tata BlueScope roofing and Astrum premium steel. Here is how to pick the right one for your project.',
    category: 'Brand Guide',
    tags: ['Tata Steel', 'Tiscon', 'BlueScope', 'TMT'],
    reading_time_minutes: 7,
    is_featured: true,
    published_at: '2026-01-14T09:00:00Z',
    content: `Tata Steel is the reference point almost every Indian steel conversation returns to. It matters less because Tata Steel is the biggest producer — it matters because Tiscon, Tata BlueScope and Tata Astrum have each become a *category* in their own right: a contractor asking for "Tiscon" is asking for a specific chemistry and a specific rib geometry, not a generic TMT bar.

## Tata Tiscon 550SD GreenPro

Tiscon is Tata Steel's TMT brand, and 550SD is the grade most specified for residential and mid-rise construction. The "SD" denotes the weldable, ductile variant within the 550 grade. GreenPro is Tata's low-carbon, high-recycled-content certification — bars carrying it are produced with a substantially lower embodied carbon footprint than the mill baseline.

Where it wins: multi-storey RCC frames, slab and beam work, and any application where a design calls for 550-grade yield with ductility. For Fe 500D, Tata's Tiscon 500D is the equivalent lower-carbon option for slabs, footings and non-seismic work.

The practical differentiator is certification. Every Tiscon bundle carries a mill test certificate traceable to the heat number. When a site engineer asks "is this really 550?", the answer should be a number on the certificate, not an opinion.

## Tata BlueScope AZ-150

Tata BlueScope is Tata Steel's downstream building-products arm, and its AZ-150 Galvalume is the reference product in Indian roofing. AZ-150 means 150 g/m² of aluminium-zinc alloy coating weight spread across the sheet. For comparison, standard AZ-150 versus AZ-200 is the difference between a roof that lasts and a roof that corrodes in a few monsoon seasons near the coast.

Tata BlueScope's range covers:

- **AZ-150 / AZ-200 Galvalume** — bare coils and pre-coated sheets for roofing and cladding
- **Colour-coated sheets** — RMP (resin-modified polyester) and SMP coatings in the full RAL palette
- **Sandwich panels and standing-seam systems** — the complete roofing envelope, not just the sheet
- **Tata BlueScope Zipsheet** — long-span roofing for industrial buildings

Colour-coated sheet is where the spec discipline matters. A 0.47 mm AZ-150 substrate in standard RMP coating is fine for a residential roof in inland Bengal; a coastal or industrial application should step up to a heavier zinc-aluminium or increased coating weight, because salt-laden air attacks the substrate through any coating breach.

## Tata Astrum

Astrum is Tata Steel's premium, alloyed bar range — Fe 550D and Fe 600 with copper-chromium micro-alloying and a refined rib pattern. It carries higher tensile and yield consistency than the standard Fe 500D/550D grades, and is specified for high-rise, bridge and infrastructure work.

Astrum is not a cost-effective substitute for Fe 500D on a residential slab. It is a cost-effective substitute for a higher grade that would otherwise need rebar design changes. The decision is about what the structural drawing actually calls for.

## A practical selection guide

| Requirement | Specify |
| --- | --- |
| Residential RCC, standard seismic | Tata Tiscon 550SD GreenPro |
| Slab, footing, non-seismic | Tata Tiscon 500D |
| Coastal or industrial roofing | Tata BlueScope AZ-200, colour-coated |
| Residential roofing, inland | Tata BlueScope AZ-150 colour-coated |
| High-rise, bridge, infrastructure | Tata Astrum Fe 550D / Fe 600 |

## What to ask the supplier

Two questions separate a genuine Tiscon bar from a rebadged one: ask for the **mill test certificate with the heat number**, and check the **brand and grade marking printed on the bar itself**. Legitimate Tata Tiscon bars carry the brand, the grade and the manufacturer's identification along the length. Bars with inconsistent or partial markings are a red flag, regardless of what the invoice says.

SteelSetu lists the current Tata Steel catalogue with live pricing and mill details — request a quotation on any SKU and it routes directly to the Bengaluru line.`,
  },
  {
    id: 'post_jindal_india_guide',
    slug: 'jindal-india-sabrang-neucolor-galvalume-pipes-guide',
    title: 'Jindal (India) Ltd: Sabrang, Neucolor+, Jindalume and API 5L Pipes',
    excerpt:
      'West Bengal’s 350,000 MTPA galvanising giant, and how to specify its pre-coated, colour-coated and pipe products correctly.',
    category: 'Brand Guide',
    tags: ['Jindal', 'Howrah', 'Galvalume', 'Pipes'],
    reading_time_minutes: 8,
    is_featured: true,
    published_at: '2026-01-28T09:00:00Z',
    content: `Jindal (India) Ltd is the most important steel supplier to know about if you buy in Bengal. Its Jangalpur and Ranihati complex in Howrah operates at roughly 350,000 tonnes per year of galvanised and colour-coated capacity, and the plant sits about an hour upstream of Burrabazar.

That proximity has a real commercial consequence: freight is short, lead times are measured in days rather than weeks, and a Jindal order can be consolidated with a Tata order on the same vehicle. For a regional buyer, Jindal is frequently the lowest *landed* cost even when the mill gate price is not the lowest on the list.

## Jindalume Al-Zn Galvalume

Jindalume is Jindal's Al-Zn coated product, and it is the single most important line in the range for roofing. The chemistry is an aluminium-zinc-silicon alloy that, unlike pure zinc galvanising, forms a protective aluminium oxide layer that is markedly more resistant to coastal salt and industrial atmosphere.

The specification language to watch:

- **AZ-70** — 70 g/m² coating, interior and covered applications
- **AZ-150** — 150 g/m², the general-purpose standard for roofing
- **AZ-200** — 200 g/m², coastal, industrial and heavily exposed sites

Grade follows **IS 277** for galvanised and pre-coated sheet, and **IS 513** for cold-rolled base material. Both appear in the catalogue and both matter — a sheet claiming IS 277 at 0.47 mm AZ150 is a materially different product from an IS 513 CR sheet that happens to be galvanised.

## Jindal Sabrang

Sabrang is Jindal's pre-coated sheet brand — colour-coated steel supplied in coils and cut sheets with a wide RAL palette. The coating systems available are:

- **RMP (Resin Modified Polyester)** — the standard colour-coated option, 15 µm total on each side
- **SMP (Sheen) / PVDF** — premium, for coastal and high-UV exposure
- **Aluminium-zinc substrate** — the substrate underneath, and the part that decides service life

Sabrang in RMP over AZ-150 is the right answer for most Bengal roofing. Sabrang in SMP over AZ-200 is the right answer for a coastal or chemical-exposed roof.

## Jindal Neucolor+

Neucolor+ is Jindal's colour-coated product line aimed at the mid-premium segment, with a broad colour range and consistent shade batching across coils. For a builder ordering a single project across multiple buildings, shade consistency matters more than most buyers realise — batch variation between coils is what makes a finished roof look patchy. Neucolor+ batches tightly.

## Jindalume and pipe products

The Howrah complex also runs pipe:

- **IS 1239** — black and galvanised ERW pipes for general structural and water applications
- **API 5L Grade HFW** — helical submerged arc welded line pipe for oil and gas transmission

If your project needs API 5L line pipe, Jindal's HFW grade comes with the full certification trail, which is what a pipeline client will audit. Do not substitute an IS 1239 ERW pipe into an API 5L line — the weld procedure, the radiographic testing regime and the documentation are not equivalent.

## Selection notes

| Application | Specify |
| --- | --- |
| Standard residential roofing | Jindalume AZ-150, IS 277 |
| Coastal / industrial roofing | Jindalume AZ-200, IS 277 |
| Colour-coated roofing | Jindal Sabrang RMP over AZ-150 |
| Premium coastal roofing | Sabrang SMP over AZ-200 |
| Water / structural ERW | Jindal IS 1239 GI ERW |
| Pipeline | Jindal API 5L Grade HFW |

## Ordering from West Bengal

Because Jindal is a Bengal mill, most of these grades can be supplied ex-stock in Kolkata with delivery inside 48 hours for full truckloads, and shorter for partial loads. Request a quotation with the grade, thickness, coating weight and colour specified separately — a quotation for "0.47mm colour sheet" without the coating weight and paint system is not a quotation you can compare.`,
  },
  {
    id: 'post_sail_seqr_guide',
    slug: 'sail-seqr-tmt-is2062-e250-hr-plates-guide',
    title: 'SAIL SeQR TMT and IS 2062 E250 HR Plates: The Public-Sector Workhorse',
    excerpt:
      'Copper-chromium SeQR TMT from Bokaro, and the E250 hot-rolled plate grade that shows up on every infrastructure tender.',
    category: 'Brand Guide',
    tags: ['SAIL', 'SeQR', 'TMT', 'HR Plate'],
    reading_time_minutes: 6,
    is_featured: false,
    published_at: '2026-02-05T09:00:00Z',
    content: `SAIL is the largest steelmaker in India by capacity and the largest public-sector steel producer in the world. Its relevance to a B2B buyer is simple: SAIL is where public infrastructure procurement starts, and its product specifications are the ones written into tender documents.

## SAIL SeQR — copper-chromium TMT

SeQR is SAIL's TMT brand. The name stands for **S**eismic **Q**uality **R**ebar, and the "QR" is the point: SeQR bars are copper-chromium alloyed.

Why copper-chromium? In a conventional Fe 500D/550D bar, the strengthening mechanism is carbon. In a copper-chromium bar, the micro-alloying contributes to precipitation hardening, which means **lower carbon content at the same strength**. The consequences that matter on site:

- **Weldability.** Lower carbon means a lower preheat requirement and a much smaller risk of hard, brittle weld zones. On a congested reinforcement cage, that is the difference between welding easily and calling a welder to a halt.
- **Corrosion resistance.** Copper and chromium both passivate. In chloride-laden soil or a coastal slab, corrosion resistance is not academic.
- **Ductility.** The elongation stays high, which is what makes the bar survive seismic cyclic loading rather than snapping at the weld.

SAIL's plants are at Bokaro, Rourkela, Durgapur, Burnpur and Bhilai. For Bengal buyers, the Durgapur plant and the Bokaro/Rourkela plants feeding through eastern dealers are the realistic sources.

## IS 2062 E250 HR plates

Hot-rolled plates under **IS 2062 E250** are the general structural plate grade across India. E250 means a minimum yield of 250 N/mm² with an elongation class — the most widely produced and most widely available structural plate grade in the country.

What E250 is used for:

- Base plates and gusset plates in structural steel connections
- Flange and web plates for built-up sections
- Tank and silo plates, pressure-vessel-adjacent work
- Bridge and infrastructure components where the drawing specifies a grade rather than a brand

The trap is that E250 is a *minimum*. An E250 plate from a mill with a proper grade-control regime will land near 260–280 N/mm²; a poor one lands at 250 exactly, which is within specification but leaves no margin for the fabrication stress. Always ask for the mill test certificate on the actual heat rather than a generic grade declaration.

## Selecting between SAIL and other mills

SAIL is the right choice when:

- The tender or drawing explicitly names SAIL or SeQR
- You need a mill test certificate traceable to a heat number for a public-sector client
- You are buying plate in E250 and price is the deciding factor at volume

Choose elsewhere when:

- You need a specific rebar brand the client has approved (Tata Tiscon, SRMB RealRing)
- You need a grade SAIL does not make — say Fe 600 or a specific alloyed bar

## What to specify

For a TMT order, specify **"SAIL SeQR, IS 1786 Fe 500D, Cu-Cr alloyed, 12 mm, with mill test certificate"**. That string gives you the brand, the grade, the chemistry class, the size and the documentation. Anything shorter and you are buying a bar, not a SeQR bar.

SteelSetu carries SAIL SeQR TMT and E250 HR coils and plates with live rates — request a quote and the enquiry routes straight to the Kolkata desk.`,
  },
  {
    id: 'post_jsw_neosteel_guide',
    slug: 'jsw-neosteel-550d-600-crs-structural-pipes-guide',
    title: 'JSW Neosteel: Fe 550D, 600, CRS and the IS 808 Structural Range',
    excerpt:
      'JSW’s Bangalore-grade TMT, the Fe 600 and CRS variants, and how the IS 808 structural range is specified in practice.',
    category: 'Brand Guide',
    tags: ['JSW', 'Neosteel', 'Structural', 'Pipes'],
    reading_time_minutes: 6,
    is_featured: false,
    published_at: '2026-02-17T09:00:00Z',
    content: `JSW Steel's flagship rebar brand is Neosteel, produced at Vijayanagar and Ballari in Karnataka. The coated business runs out of Vasanthapuram in Andhra Pradesh, and the pipe business under the One Helix name.

## Neosteel Fe 550D

Fe 550D is the workhorse grade of the Indian rebar market — 550 N/mm² yield with a minimum 5% elongation (the "D" denoting ductility). It is what a structural drawing specifies for beams, columns and slab work in a typical RCC frame.

Neosteel's differentiator is the rib pattern. A proper "T" or "l" rib arrangement with the correct rib angle and spacing gives the bar mechanical keying with concrete. Cheap bars with shallow or badly spaced ribs reduce bond stress, which shows up as slip and extra anchorage length rather than as an obvious failure.

## Neosteel 600 and CRS

**Fe 600** is a high-yield grade for heavy-section and high-rise work where the design calls for a smaller bar diameter to hit the same capacity.

**CRS — Cold Resistance Steel** — is a separate product family. CRS steel has a refined, low-carbon chemistry with a Charpy impact value specified down to low temperatures, and it is used where ductility under cold or shock loading matters: bridges, seismic zones with severe intensity, and industrial structures subject to dynamic loads. It is not simply "Fe 600"; it is a different chemistry and a different performance class.

Specify CRS where the drawing says so, and do not substitute Fe 550D for it.

## IS 808 structural sections

JSW produces structural sections to **IS 808** — I-beams (ISH), channels (ISMC), angles (ISA) and equal angles. The relevant part of the standard for a buyer is the tolerance class and the section mass, both of which affect the structural bill.

Two things to check when ordering:

1. **Section designation and mass.** ISMC 100 has a nominal mass of 11.9 kg/m; ISMC 125 is 16.4 kg/m. A mix-up here changes the tonnage of an entire order.
2. **Length.** Standard mill lengths are 6 m and 12 m. If your structural layout is fixed at, say, 5.8 m, buying 6 m stock means paying for offcut you may not be able to reuse.

## One Helix pipes

The One Helix brand covers ERW pipes for water, gas and general structural use, plus galvanised variants. Helical welding is the differentiator in this product: the weld is spiral rather than longitudinal, and the manufacturing route gives better formability and a consistent wall thickness under pressure.

## A note on supply geography

JSW is a Karnataka and Andhra producer. For Bengal buyers, freight is a real line item, and it is worth comparing the *landed* rate against a Bengal mill rather than the ex-mill rate. JSW's coated coils in particular compete with Jindal's, and the freight line can flip the order.

Request landed quotes from SteelSetu and the comparison is made for you — the same rate sheet includes freight to your pincode.`,
  },
  {
    id: 'post_srmb_bengal_guide',
    slug: 'srmb-srijan-belgian-tempcore-wingrip-realring-guide',
    title: 'SRMB Srijan: Belgian Tempcore, WinGrip Ribs and the RealRange',
    excerpt:
      'Bengal’s best-known TMT brand — what Belgian Tempcore actually changes, and where the RealRing, RealEdge, RealRoof and RealFabrica lines fit.',
    category: 'Brand Guide',
    tags: ['SRMB', 'Durgapur', 'TMT', 'Bengal'],
    reading_time_minutes: 6,
    is_featured: true,
    published_at: '2026-03-03T09:00:00Z',
    content: `SRMB Srijan is the brand most Bengal contractors ask for by name. Its Durgapur block mill and Rourkela billet plant produce Fe 550D and Fe 500D TMT bars using Belgian Tempcore technology with WinGrip rib geometry, and the downstream range is marketed under the Real family.

## Belgian Tempcore — what actually changes

Tempcore is a thermomechanical rolling process. In it, the steel is rolled below its recrystallisation temperature, so the deformation creates grain refinement rather than work-hardening. The practical results:

- **Higher strength at the same carbon level.** You reach Fe 550D strength without pushing carbon up, which is what keeps weldability intact.
- **Finer grain structure.** Finer grains mean a higher yield-to-tensile ratio and, more usefully, a **higher ductility** — the bar absorbs seismic cyclic loading instead of failing suddenly.
- **Tighter dimensional tolerance.** Because the material flows differently, the section size holds within tolerance more consistently across the length.

A Tempcore bar is not just a "better" bar. It is a bar that is easier to weld, more forgiving of site handling, and more predictable in the test house.

## WinGrip rib geometry

The rib is what grips the concrete. WinGrip is SRMB's rib profile — a specified rib angle, height and spacing, applied consistently along the bar.

Rib consistency is the thing to inspect on delivery. Bars that are properly ribbed develop bond stress in the concrete; bars with shallow, sparse or intermittently worn ribs develop slip. You can see this on site: look along the bar and the ribs should be continuous, sharp and evenly spaced, with the brand and grade marking legible between them.

## The Real product family

**SRMB RealRing** — the Fe 500D and Fe 550D TMT bars, the core of the business.

**SRMB RealEdge** — Al-Zn Galvalume coils and sheets, for roofing and cladding. Galvalume's aluminium-zinc alloy outperforms standard galvanising in corrosive atmospheres, which matters in Bengal's damp summers and in industrial Kolkata.

**SRMB RealRoof** — pre-coated colour-coated roofing sheets over the RealEdge substrate.

**SRMB RealFabrica** — hollow sections (RHS, SHS, CHS) for structural and industrial work.

## Why Bengal buyers gravitate to SRMB

The reason SRMB has this position in the market is not only quality — it is logistics. Durgapur is roughly three hours from Burrabazar. That means:

- A TMT order placed in the morning can be on site the same evening
- Lot sizes of 5–10 MT are practical, not a special request
- Cash-and-carry from a stockist is genuinely same-day

For a regional builder working on tight site schedules and variable order sizes, that is often worth more than a small difference in mill-gate price.

## What to specify

**"SRMB RealRing, IS 1786 Fe 550D, 10 mm, Belgian Tempcore, with mill test certificate"** is a complete specification. Add "WinGrip rib verified" if you want the rib pattern explicitly confirmed on delivery.

A short check on arrival: count the ribs. Standard rib spacing on a 10 mm bar is around 8–10 mm between rib peaks, and the bar marking should be legible along the full length. Bars with a smeared or partially erased marking are not Tiscon-grade authentic — they are almost always sub-standard.

SteelSetu lists SRMB RealRing and the full Real range with live Bengal rates — request a quotation and we will confirm the next dispatch from Durgapur.`,
  },
  {
    id: 'post_captain_600_eqr_guide',
    slug: 'captain-steel-600-eqr-thermex-rustguard-guide',
    title: 'Captain Steel: 600 EQR on German Thermex, and What RustGuard Adds',
    excerpt:
      'Captain 600 EQR delivers 620 N/mm² yield with 16% elongation. Here is what the grade actually means on site.',
    category: 'Brand Guide',
    tags: ['Captain Steel', 'Thermex', 'EQR', 'Fire Resistant'],
    reading_time_minutes: 5,
    is_featureed: false,
    published_at: '2026-03-16T09:00:00Z',
    content: `Captain Steel operates from Kalyaneshwari in West Bengal, with a second plant at Rajnandgaon in Chhattisgarh. The brand is best known for Captain 600 EQR — one of the highest-specification mainstream TMT bars sold in the Indian market.

## What EQR means

**EQR** stands for **Earthquake Resistant Quality**. It is not a marketing label; it is a defined performance class under IS 1786:2016, and it maps to a specific set of mechanical requirements.

For Captain 600 EQR the published specifications are:

| Property | Value |
| --- | --- |
| Yield strength | 620 N/mm² minimum |
| Tensile strength | 700 N/mm² minimum |
| Elongation | 16% minimum |
| Carbon content | 0.20% maximum |

Compare that to a Fe 500D bar: 500 N/mm² yield, 575 N/mm² tensile, 5% minimum elongation, 0.30% maximum carbon.

The 16% elongation figure is the headline. A 5% elongation bar is adequate for ordinary construction. A 16% elongation bar can undergo large plastic deformation before fracturing, which is exactly the behaviour a seismic frame needs — the structure yields and dissipates energy instead of snapping.

## German Thermex technology

Thermex is a thermomechanical processing route in which the steel is rolled at a controlled temperature so that the microstructure is refined and strengthened without relying on extra carbon. The results are the same family as Tempcore: higher strength at lower carbon, better ductility, tighter dimensional control.

The practical, site-visible difference is welding. With carbon capped at 0.20% rather than 0.30%, a 20 mm Captain 600 EQR bar can be welded with a standard procedure and low preheat. On a Fe 550D bar of the same diameter, you are often looking at preheat and controlled procedures.

## Captain RustGuard FBE

RustGuard is Captain's fire-resistant TMT. The bar is treated with a proprietary surface alloying process that delays the loss of strength at elevated temperature.

Why it matters: in a fire, the yield strength of conventional rebar falls off quickly, and the collapse of a slab depends on the steel's remaining capacity. A fire-resistant bar holds more of its strength for longer, which buys time for evacuation and for the fire service.

RustGuard is specified in high-rise, tunnel, metro and industrial structures where fire load is high. It is not a general-purpose substitution for ordinary rebar.

## Captain TMT Rings and Captain Wiro

**Captain TMT Rings** are stirrup and ring bars supplied in coil form, so a site can cut its own stirrups to length. This cuts waste on projects with unusual cage geometry, where cut-and-bend from a mill-cut bar leaves a lot of unusable offcut.

**Captain Wiro** is the wire rod business — AISI 1006/1018 and allied grades, feeding the binding wire, nails, and wire mesh trade.

## When to specify Captain

- The design calls for 600 or higher yield
- Seismic detailing requires high ductility
- You want a low-carbon bar that welds easily on a congested cage
- Fire resistance is a specified requirement (RustGuard)

Specify it as: **"Captain 600 EQR, IS 1786:2016 EQR, German Thermex, 16% elongation, with mill test certificate"**.

Request a quote for Captain 600 EQR from SteelSetu and the enquiry goes to the Kolkata desk for a same-day response.`,
  },
  {
    id: 'post_rashmi_metaliks_guide',
    slug: 'rashmi-metaliks-kharagpur-eqcr-di-pipes-wire-rod-guide',
    title: 'Rashmi Metaliks: EQCR TMT, DI Pipes and Wire Rod from Kharagpur',
    excerpt:
      'A 1.18 MTPA integrated plant an hour from Kolkata — TMT, ductile iron pipes, pig iron and AISI wire rod.',
    category: 'Brand Guide',
    tags: ['Rashmi', 'Kharagpur', 'DI Pipes', 'Wire Rod'],
    reading_time_minutes: 5,
    is_featured: false,
    published_at: '2026-03-28T09:00:00Z',
    content: `Rashmi Metaliks has an integrated plant at Kharagpur, West Bengal, with a nameplate capacity of around 1.18 MTPA. It is one of the closest integrated steel plants to Kolkata, and it makes a range that is unusual for a mill this size — TMT bars alongside ductile iron pipes, pig iron and wire rod.

## TMT bars: Rashmi EQCR

Rashmi's rebar is sold under an EQCR (Earthquake Resistant Quality) designation, in Fe 500D and Fe 550D. As with any EQR bar, the specification to demand is the elongation figure and the carbon cap, alongside the mill test certificate.

The commercial argument for Rashmi is straightforward: Kharagpur to Burrabazar is a short haul, so the freight component of a landed rate is small, and a 5 MT order is not an awkward minimum. For a contractor running two or three sites and consuming steel in staggered lots, that flexibility is genuinely valuable.

## Ductile iron pipes

Rashmi's DI pipe range is produced to **IS 2896**. Ductile iron pipe is used for water and sewerage networks, and its advantage over ordinary cast iron is the spheroidal graphite structure, which gives it greater strength, ductility and impact resistance.

For a buyer, the two things that matter are:

1. **The class of the pipe** — K7, K9 and K11, referring to working pressure in bars. K9 is the common municipal specification; K11 is used for higher-pressure or deeper installations.
2. **The coating** — zinc-aluminium, or a cement mortar lining for potable water, or a polyethylene sleeve for aggressive soil.

## Pig iron

Rashmi produces foundry-grade pig iron for downstream iron castings. If you are a casting or foundry buyer rather than a construction buyer, this is a supply line worth knowing.

## Wire rods

Rashmi's wire rod range covers AISI 200, 300 and 400 series. These feed:

- Binding wire for rebar cages
- Galvanised wire and chicken wire
- Nails and general wire products
- The wire drawing trade for smaller gauge products

AISI 1006/1018/1020 are the common low-carbon grades for general wire. AISI 1008 is used where higher strength is needed for binding wire.

## What this means for a Bengal buyer

Rashmi is the answer to "I need it in three days and I do not need a full truckload." Between the Durgapur mills and Kharagpur, a Bengal buyer has genuine short-lead options, and Rashmi is the one with the most diversified product set among them.

Specify as: **"Rashmi EQCR TMT, IS 1786 Fe 550D, with mill test certificate"** or **"Rashmi DI Pipe, IS 2896, K9 class, zinc-aluminium coated"**.

SteelSetu lists Rashmi products with live rates and same-region delivery — send the requirement and we will quote the landed rate to your site.`,
  },
  {
    id: 'post_jsp_rinl_guide',
    slug: 'jindal-panther-vizag-steel-fe500d-550d-guide',
    title: 'Jindal Panther and RINL: The Fe 500D and Fe 550D Long-Product Alternatives',
    excerpt:
      'When a dedicated TMT mill beats a diversified one — Panther and Vizag Steel compared on grade, availability and landed cost.',
    category: 'Brand Guide',
    tags: ['Jindal Panther', 'RINL', 'TMT', 'Comparison'],
    reading_time_minutes: 5,
    is_featured: false,
    published_at: '2026-04-08T09:00:00Z',
    content: `Not every TMT order needs a national brand's name on the mill certificate, and not every bar on the market is a general-purpose grade. Two mills that sit outside the headline brands have a distinct proposition: they make nothing but long products, and they compete hard on price.

## Jindal Panther (JSP)

Jindal Panther is a focused long-products producer with plants at Raigarh, Bokaro, Tisco and Mahasweta, and a nameplate of roughly 2.4 MTPA. It makes Fe 500D and Fe 550D bars on modern long-product lines.

The specialisation argument: a mill that only makes long products can optimise for it. There is no competition for rolling capacity from a flat-products line, quality parameters are tuned for bar rather than for coil, and the cost structure is a long-product cost structure. In practice that shows up as a competitive ex-mill rate.

**The catch** is availability. Panther's distribution footprint is thinner than Tata's or Jindal's, and in Bengal you are more likely to be buying from a stockist than direct from the mill. That adds a margin layer and a delivery variability. Ask for the ex-mill rate *and* the delivered rate.

## Vizag Steel Plant (RINL)

Rashtriya Ispat Nigam's Vizag Steel Plant operates an integrated blast-furnace and long-products route producing Fe 500D and Fe 550D bars at around 3 MTPA. RINL is a public-sector undertaking, and it participates in government supply schemes, which makes its presence in public tenders significant.

**The catch** here is geographic. Vizag is on the Andhra coast, roughly 1,600 km from Kolkata. The freight component on a 10 MT truck is substantial — frequently ₹6,000 to ₹9,000 per tonne. RINL competes in Bengal only when the ex-mill spread favours it, or when a government scheme is driving supply.

## A comparison that matters

| Factor | Jindal Panther | RINL Vizag |
| --- | --- | --- |
| Capacity | ~2.4 MTPA | ~3 MTPA |
| Grades | Fe 500D, Fe 550D | Fe 500D, Fe 550D |
| Eastern proximity | Good (Raigarh, Bokaro) | Poor (Andhra coast) |
| Freight to Kolkata | Low to moderate | High |
| Best use | Regional spot buys | Public tender supply |

## When to buy from them

Buy from Panther when you have a steady regional requirement, want a competitive rate, and can work with a stockist's lead time. Buy from RINL when a government scheme or a public tender is driving the requirement, or when a buyer in the south and east can share freight.

Do not buy either as a substitute for a specified brand on a project where the architect or client has named Tata Tiscon, SRMB RealRing or JSW Neosteel. Approved-brand clauses are not a formality — they are how the structural design is validated.

## The practical check for every bar

Brand aside, on delivery confirm:

1. Mill test certificate with a heat number that matches the bar marking
2. IS 1786 certification and the correct grade designation
3. Rib geometry — continuous, sharp, evenly spaced
4. For EQR grades, the elongation figure on the certificate

SteelSetu lists Panther, RINL and the full catalogue with delivered rates to your pincode — compare landed, not ex-mill.`,
  },
  {
    id: 'post_super_shakti_guide',
    slug: 'super-smelters-super-shakti-durgapur-jamuria-guide',
    title: 'Super Smelters: Fe 550D and SD Super Ductile from Durgapur & Jamuria',
    excerpt:
      'The closest integrated plant to Kolkata, and what SD Super Ductile MS pipe actually delivers over standard ERW.',
    category: 'Brand Guide',
    tags: ['Super Smelters', 'Super Shakti', 'Durgapur', 'Pipes'],
    reading_time_minutes: 4,
    is_featured: false,
    published_at: '2026-04-21T09:00:00Z',
    content: `Super Smelters runs integrated plants at Durgapur and Jamuria in West Bengal, producing Fe 550D TMT bars under the Super Shakti brand, SD Super Ductile MS pipes, hot-rolled coils and structural sections.

Jamuria is the significant location — it is one of the closest integrated steel plants to Burrabazar in the country, and that distance is what shapes the commercial proposition.

## Super Shakti Fe 550D

The bar is a standard IS 1786 Fe 550D product. What differentiates the supply is availability and lead time: this is a Bengal mill with a Bengal dealer network, so lot sizes of 5 MT are routine and delivery is measured in one to three days.

For a builder with three sites and staggered consumption, that predictability has a value that is hard to express in a per-tonne rate. The cost of holding steel you do not need yet, or of a delayed pour waiting for a bar, is real money.

## SD Super Ductile MS pipes

SD Super Ductile is the pipe brand. "SD" refers to the ductility grade — the pipes are manufactured to give improved ductility and formability over standard ERW, which means they can be bent, flanged and cut on site without the risk of brittle failure that a basic ERW pipe carries.

**IS 9295** is the governing standard for ERW steel pipes. Specify it explicitly.

The ductility advantage matters in practice for:

- Site fabrication of scaffolding, handrails and stanchions
- Bent and flanged pipework in water and fire lines
- Any application where the pipe will be cut or worked after delivery

## HR coils and structural sections

The HR coil output is to IS 2062 E250 BR, the general hot-rolled coil grade used for fabrication, roofing and further processing. Structural sections cover angles, channels and beams to IS 2062 E250.

## Where it fits

Super Shakti is the right source when:

- The requirement is in Bengal and the schedule is tight
- Lot size is small to medium
- You want a local mill with low freight and low lead time
- The grade required is ordinary Fe 550D or E250 — no specific approved brand is mandated

Specify as: **"Super Shakti TMT, IS 1786 Fe 550D"** or **"SD Super Ductile MS Pipe, IS 9295, with mill test certificate"**.

Request a quote from SteelSetu and we will price the delivery to your site in West Bengal with the freight shown separately, so you can compare Super Shakti against a national brand on a landed basis.`,
  },
  {
    id: 'post_shyam_steel_guide',
    slug: 'shyam-steel-durgapur-fe500d-550d-guide',
    title: 'Shyam Steel: Durgapur’s Fe 500D and Fe 550D Specialist',
    excerpt:
      'A compact Bengal mill with a strong regional footprint, and where it fits against the larger eastern producers.',
    category: 'Brand Guide',
    tags: ['Shyam Steel', 'Durgapur', 'TMT', 'Bengal'],
    reading_time_minutes: 4,
    is_featured: false,
    published_at: '2026-05-05T09:00:00Z',
    content: `Shyam Steel's plant sits in Durgapur, West Bengal, producing BIS IS 1786 certified Fe 500D and Fe 550D TMT bars at around 0.6 MTPA. It is a small mill by national standards, and that is exactly the point.

## The regional mill advantage

A 0.6 MTPA mill competes on a completely different basis from a 30 MTPA one. There is no national logistics network to maintain, no inter-plant transfer pricing, no multi-state overhead. What is left after that is a shorter cost base and a much closer relationship with the local dealer.

For a Bengal buyer, the arithmetic usually works:

- Durgapur to Burrabazar is roughly three hours
- Freight on a 10 MT load is often ₹1,200 to ₹1,800 per tonne, against ₹6,000+ from the coast
- A smaller lot minimum — often 5 MT — against 20 to 25 MT at a national mill

The ex-mill rate at a small Bengal mill is not always the lowest on the sheet. The *landed* rate frequently is.

## Where it fits

Shyam Steel is a strong choice for:

- Residential and mid-rise RCC frames in West Bengal
- Projects with staged consumption and 5–10 MT call-offs
- Buyers who need delivery flexibility more than they need a specific brand name
- Northern Bengal, where coastal freight is heavy and Durgapur is comparatively close

## What to check

Shyam Steel is a credible IS 1786-certified producer with a real mill and a real quality system. The checks that matter on delivery are the same as for any brand:

1. Mill test certificate with a heat number
2. Grade and brand marking legible along the bar
3. Rib geometry continuous and evenly spaced
4. Bar diameter and mass within BIS tolerance

If the mill test certificate is available and the heat number maps to the marking, you are buying a properly certified bar. The instruction that matters most: **do not accept "Shyam Steel" without the certificate**. Brand-only claims are the failure mode in the regional segment.

## Requesting a rate

Specify as **"Shyam Steel TMT, IS 1786 Fe 550D, 12 mm"** and ask for the delivered rate to your site. On a Bengal requirement, it is worth putting Shyam Steel, SRMB, Rashmi and Super Shakti side by side on landed cost — the spread between them on an ex-mill comparison is much wider than the spread on a delivered comparison.

SteelSetu lists all four with live rates, and the quotation is delivered to your pincode.`,
  },
  {
    id: 'post_maithan_selm_guide',
    slug: 'maithan-steel-shyam-metalics-sel-tiger-guide',
    title: 'Maithan Steel and Shyam Metalics (SEL Tiger): Two More Eastern Options',
    excerpt:
      'Maithan’s Fe 600 capability and SEL Tiger’s galvanising strength — a short guide to the rest of the eastern long- and flat-product market.',
    category: 'Brand Guide',
    tags: ['Maithan', 'SEL Tiger', 'Shyam Metalics', 'Comparison'],
    reading_time_minutes: 4,
    is_featured: false,
    published_at: '2026-05-19T09:00:00Z',
    content: `Two more brands complete the eastern market picture: Maithan Steel from Ghaziabad, and Shyam Metalics — marketed as SEL Tiger — from Durgapur.

## Maithan Steel

Maithan runs an integrated plant at Ghaziabad, Uttar Pradesh, with around 1 MTPA of TMT capacity, producing Fe 500, Fe 550D and Fe 600 grades.

**Fe 600 is the differentiator.** Fe 600 gives 600 N/mm² yield and 675 N/mm² tensile, letting a designer reduce bar diameter or reduce bar quantity on a heavily loaded member. For a high-rise column or a long-span transfer beam, that can cut the tonnage of steel on site, which is a bigger saving than any mill-rate negotiation.

Maithan has an established distribution presence across northern and eastern India, and it competes credibly in Bengal on a delivered basis from Ghaziabad.

Specify as: **"Maithan Steel TMT, IS 1786 Fe 600"** for high-strength work, or Fe 550D for general structural use.

## Shyam Metalics (SEL Tiger)

Shyam Metalics operates from Durgapur and produces galvanised sheets across the 80 to 120 GSM range, GI profile sheets, MS angles and channels, and colour-coated options under the SEL Tiger brand.

This is a different business from a rebar mill — it is a coated and long flat-products business. Its relevance to a roofing and structural buyer:

**Galvanised sheets to IS 277**, in 80, 100 and 120 GSM. GSM is the coating weight, and 120 GSM is the standard for general roofing, while 80 GSM suits interior or covered applications where corrosion exposure is minimal.

**GI profile sheets** — the corrugated and profiled form of the same substrate, in 0.40 mm to 0.60 mm.

**MS angles and channels to IS 2062 E250** — the same structural long products the bigger mills make, from a nearby source.

**Colour-coated sheets** — pre-coated options for the roofing trade.

SEL Tiger's advantage over a coastal mill is the same as Shyam Steel's: freight is small and lead time is short. Its limitation is the same too — it competes in ordinary coated and long products, not in high-spec alloyed or branded lines.

## The complete eastern shortlist

| Mill | Location | Core products |
| --- | --- | --- |
| Tata Steel | Jamshedpur / Kalinganagar | Tiscon TMT, BlueScope roofing, coils |
| Jindal (India) | Jangalpur, Howrah | Galvalume, pre-coated, GI/ERW pipes |
| SAIL | Bokaro / Rourkela / Durgapur | SeQR TMT, coils, plates |
| JSW Steel | Vijayanagar / Vasanthapuram | Neosteel, sections, coils |
| SRMB | Durgapur / Rourkela | RealRing TMT, RealEdge, RealRoof |
| Shyam Steel | Durgapur | Fe 500D / Fe 550D TMT |
| Rashmi Metaliks | Kharagpur | EQCR TMT, DI pipes, wire rod |
| Captain Steel | Kalyaneshwari | 600 EQR, RustGuard, TMT rings |
| Super Smelters | Durgapur / Jamuria | Fe 550D, SD Super Ductile pipes |
| Shyam Metalics | Durgapur | GI sheets, angles, channels |
| Jindal Panther | Raigarh / Bokaro | Fe 500D / Fe 550D TMT |
| RINL | Vizag | Fe 500D / Fe 550D TMT |

Request a landed quote across any of these from SteelSetu and the freight to your pincode is included, so the comparison is a real one.`,
  },
  {
    id: 'post_roofing_sheet_guide',
    slug: 'gi-vs-galvalume-vs-ppgl-roofing-sheet-guide',
    title: 'GI vs Galvalume vs PPGL: Choosing the Right Roofing Sheet',
    excerpt:
      'Three coated sheet options, three service lives. How to specify by weight, coating system and exposure — and avoid buying the wrong one.',
    category: 'Buying Guide',
    tags: ['Roofing', 'Galvalume', 'PPGL', 'GI'],
    reading_time_minutes: 7,
    is_featured: true,
    published_at: '2026-06-02T09:00:00Z',
    content: `Roofing sheet is where buyers most often get it wrong, and the mistake is expensive: the sheet is cheap relative to the building it protects, and a bad choice has to be lived with for years.

Three options dominate the Indian market. They are not interchangeable.

## GI — Galvanised Iron (zinc)

Standard zinc coating applied to cold-rolled steel, to **IS 277** for the base material. Zinc is sacrificial: it corrodes preferentially, protecting the steel underneath even where the coating is scratched. The coating weight is specified in GSM.

- **80 GSM** — interior, covered, minimal exposure
- **100 GSM** — standard internal applications
- **120 GSM** — general-purpose roofing, the market default
- **150+ GSM** — heavy exposure, cold-formed purlins

Zinc coating gives good protection in ordinary atmospheric conditions and holds a natural sacrificial mechanism. It is the least expensive of the three, and in mild, dry, sheltered conditions it is entirely adequate.

Where GI is the wrong answer: coastal atmosphere, industrial zones with high SO₂, and anywhere the roof gets standing water.

## Galvalume — Al-Zn alloy

A zinc-aluminium-silicon alloy coating, to **IS 277**, at coating weights of AZ-70, AZ-150 and AZ-200.

The mechanism is different from zinc. Aluminium forms a dense, self-healing oxide layer that is markedly more resistant to atmospheric corrosion than zinc alone. Practically, Galvalume has roughly **two to four times the coating life of standard zinc** in comparable exposure.

The catch: aluminium-zinc coating is softer, so it is more easily damaged during handling and installation. A scratched Galvalume sheet at a cut edge can corrode faster than the equivalent GI sheet. Careful handling at site is not optional.

| Exposure | Recommended |
| --- | --- |
| Inland, dry, residential | AZ-70 or AZ-150 |
| Humid, coastal | AZ-150 minimum, AZ-200 better |
| Industrial, high SO₂ | AZ-200 |
| Direct splash / extreme | AZ-200 with enhanced paint |

## PPGL — Pre-Painted Galvanised

A galvanised or Galvalume substrate with a baked colour coating on top, typically RMP (resin-modified polyester) at 15–20 µm each side, or SMP/PVDF for premium.

The colour is the obvious attraction, but the important part is what is underneath. A PPGL sheet is only as good as its substrate and its coating weight. The failure mode to avoid is buying "PPGL 0.47mm" and getting a thin zinc substrate with a thick-looking paint layer.

**Specify PPGL in full:** substrate (GI or Galvalume), substrate coating weight (GSM or AZ grade), paint system (RMP / SMP / PVDF), paint thickness in microns, and colour with the RAL or shade code.

## The specification checklist

Before you order roofing sheet, confirm all of these:

1. **Substrate grade** — IS 277 for galvanised/galvalume, IS 513 for CR base
2. **Substrate thickness** — 0.40, 0.47, 0.50, 0.60 mm, and what the *minimum* is
3. **Coating weight** — 80/100/120/150 GSM, or AZ-70/150/200
4. **Paint system and microns** — RMP 15 µm, SMP 25 µm, PVDF 35 µm
5. **Colour** — with a shade code, not just a name
6. **BIS marking** — every sheet should carry the BIS logo and grade mark

## Matching sheet to application

| Building | Specification |
| --- | --- |
| Residential, inland | Galvalume AZ-150, or PPGL RMP over AZ-150 |
| Industrial shed, inland | Galvalume AZ-200 |
| Coastal / humid | Galvalume AZ-200 with SMP paint |
| Site office / temporary | GI 80–100 GSM |
| Poultry, piggery, poultry sheds | AZ-200 — ammonia attacks zinc fast |
| Pre-engineered building | AZ-200 or heavier, as the PEB supplier specifies |

The last row matters: in a pre-engineered building, the roofing spec belongs to the PEB supplier, because the panel design assumes a specific gauge. Taking the PEB supplier's specification is safer than specifying independently.

## A common error worth naming

Buyers often specify "0.47mm" and receive a 0.40mm sheet. The nominal thickness of a coated sheet is measured before coating, and the tolerance band on IS 277 permits the delivered product to sit below nominal. Always specify the **minimum** thickness, and check a sheet with a vernier on delivery.

SteelSetu lists GI, Galvalume and PPGL in the exact gauges and coating weights above, with live rates. Send your specification and we will quote the delivered price.`,
  },
  {
    id: 'post_tmt_grade_guide',
    slug: 'tmt-bar-grades-fe500d-550d-600-explained',
    title: 'Fe 500D vs Fe 550D vs Fe 600: Choosing the Right TMT Grade',
    excerpt:
      'What the grade number means, what the D actually means, and how to pick the grade the structural drawing is really asking for.',
    category: 'Buying Guide',
    tags: ['TMT', 'IS 1786', 'Grades'],
    reading_time_minutes: 6,
    is_featured: false,
    published_at: '2026-06-16T09:00:00Z',
    content: `TMT grade selection is one of the most common places a construction project quietly loses money, because the grade is often inherited from a previous project rather than derived from the drawing.

## Reading the grade

The number is the **minimum yield strength in N/mm²**. Fe 500D means the bar must yield at 500 N/mm² or more. Fe 550D means 550. Fe 600 means 600.

Underneath the number, two letters carry information:

**"D" for ductility.** Under **IS 1786:2016**, a "D" grade has a minimum elongation of 5% and a maximum carbon of 0.30% — the "B" (mild, non-ductile) grades of the old standard have been withdrawn for general construction. "D" is not optional any more; if a mill test certificate says "B", the bar is from the withdrawn standard and should be rejected.

**"L" for low carbon** (up to 0.27%). "EQR" (earthquake resistant quality) is the higher ductility class, typically 12% or 16% elongation with a tighter carbon cap.

## The three grades side by side

| Grade | Yield (MPa) | Tensile (MPa) | Min elongation | Max carbon |
| --- | --- | --- | --- | --- |
| Fe 500D | 500 | 575 | 5% | 0.30% |
| Fe 550D | 550 | 635 | 5% | 0.30% |
| EQR 550 | 550 | 635 | 12–16% | 0.20–0.25% |
| Fe 600 | 600 | 675 | 5% (EQR higher) | 0.30% |
| Fe 650 | 650 | — | — | — |

## Which grade the drawing actually calls for

**Fe 500D** — slabs, footings, foundations, non-seismic residential frames, and any member where the demand is low. It is the most ductile-friendly of the ordinary grades and the cheapest.

**Fe 550D** — beams, columns, shear walls in mid-rise RCC frames, and general commercial construction. This is the default for a modern RCC building and the most specified grade in India.

**Fe 600** — heavy sections, high-rise columns, transfer beams, and members where a designer wants to reduce bar diameter or the number of bars. Sometimes specified under IS 13920 for ductile detailing.

**EQR / CRS** — seismic zones of intensity IX and X, and moderate-to-high seismic intensity structures per IS 13920, where the ductility requirement of the reinforcement is a design safety requirement rather than a preference. Bridges, tall chimneys, and structures in high seismic zones also.

Note the important detail: **IS 13920 applies to the reinforcement, and the drawing governs.** In a high seismic zone, Fe 500D may be perfectly adequate if the drawing says so — what matters is that the specified grade meets the drawing, and that the mill test certificate confirms it.

## The four properties that matter beyond the grade

**Carbon content** is the number that controls weldability. Above 0.30% you need controlled procedures and often preheat on heavy bars. EQR and Thermex routes keep carbon low while raising strength, which is why they cost more per tonne and weld more easily.

**Elongation** is the number that controls seismic performance. A 5% bar and a 16% bar are both "Fe 550D" in most specifications; only the second survives a severe cyclic load with ductility.

**Rib geometry** controls bond. Shallow or irregular ribs mean slip and longer anchorage, and it is a hidden cost because the drawing's anchorage length assumes proper bond.

**Weldability and fatigue** matter for structures in corrosive or cyclic environments. Corrosion-resistant rebar and CRS exist for these cases.

## A procurement rule of thumb

Specify a grade, then specify the properties you actually need. A complete rebar specification looks like:

> **"TMT, IS 1786:2016, Fe 550D, 12 mm, 12 m lengths, with mill test certificate showing heat number, yield strength, elongation and carbon content."**

Adding "EQR, 16% elongation" if the site is seismic. Adding "brand" only where the client has approved a specific one.

## Checking on delivery

1. Mill test certificate, heat number, and the bar marking agree
2. The marking is legible along the full length — brand, grade, diameter
3. Ribs are continuous, sharp and evenly spaced
4. A diametrometer confirms the diameter
5. A weighing check on a bundle confirms the mass

That last one is worth doing occasionally. A 12 mm bar weighs 0.888 kg/m. A bundle of 10 lengths of 12 m should weigh about 106.6 kg. If it is materially lighter, the section is undersized.

SteelSetu lists TMT across every grade and brand above, with live rates. Send the grade and quantity and we will quote the delivered rate.`,
  },
  {
    id: 'post_structural_steel_guide',
    slug: 'structural-steel-sections-is-808-ibc-guide',
    title: 'IS 808 Structural Sections and the Indian Standard Beam Code',
    excerpt:
      'What IS 808 covers, what IBC adds, and how to order sections without making a section-designation mistake.',
    category: 'Buying Guide',
    tags: ['Structural', 'IS 808', 'IBC', 'Sections'],
    reading_time_minutes: 6,
    is_featured: false,
    published_at: '2026-06-30T09:00:00Z',
    content: `Structural steel in India sits across two standards, and confusing them is the source of most ordering errors.

## IS 808 — the section standard

**IS 808:1989** is the Indian Standard Specification for Cold-Formed Sections, and it covers the rolled section designations used across India: ISMB beams, ISMC channels, ISA angles, ISMC sections and hollow sections.

The designation encodes the geometry:

- **ISMB 200** — an Indian Standard Medium Beam with 200 mm depth and 150 mm flange width, at 20.4 kg/m
- **ISMC 100** — a Medium Channel, 100 mm depth, 50 mm flange, at 11.9 kg/m
- **ISA 50 x 50 x 6** — an equal angle, 50 mm legs, 6 mm thick, at 4.43 kg/m
- **ISA 100 x 75 x 8** — an unequal angle, 100 mm and 75 mm legs, 8 mm thick, at 13.1 kg/m

**The single most common ordering error is mixing up ISMC 100 and ISMC 125**, or specifying "100 x 50" for a channel when you meant "100 x 50 x 6" as an angle. The section masses differ materially — 11.9 kg/m versus 16.4 kg/m — and a mistake there changes the tonnage of an entire order.

## The Indian Building Code

**IS 800:2007 (LSD)** is the Indian Standard Specification for the Design of Steel Structures. It is what most Indian structural engineers work to. Its provisions on material, design, and member design are the reference for a working drawing.

Two points a buyer will encounter:

**Design strength is a factored strength.** IS 800 uses partial safety factors on material strength. The design yield strength of a grade with 250 N/mm² yield is not 250 — it is 250/1.1. Compare this against AISC, where the design strength is 0.9 × Fy, and against EN 1993, where the yield is divided by 1.0 or 1.15 depending on the thickness class.

**Buckling and member length classes matter.** A section's capacity depends on its length class (short, intermediate, long) and the buckling resistance of the compression element. Two sections of identical mass and identical yield can have very different compressive capacity depending on the flange and web proportions.

## IS 2062 E250 — the material grade

Most structural sections in India are produced to **IS 2062 E250**, the general structural steel grade:

| Property | E250 |
| --- | --- |
| Yield strength | 250 N/mm² minimum |
| Tensile strength | 410–510 N/mm² |
| Elongation | 23% minimum |

Other grades exist: **E350** for higher-capacity structural work, and **IS 2062 E250 BR** for the boiler-grade variant used in pressure parts.

## Ordering sections properly

Always give the buyer six things:

1. **Full designation** — ISMB 250, ISMC 100, ISA 75 x 75 x 8
2. **Grade** — IS 2062 E250 or E250 BR
3. **Length** — 6 m or 12 m mill lengths, and cut lengths if needed
4. **Quantity in tonnes** (and pieces, ideally)
5. **Mill** — or approved mill list
6. **Mill test certificate** required

**Mill length versus cut length.** A structural layout with 5.8 m members means 6 m stock with 200 mm offcut per length, and unless those offcuts are usable on secondary members, you are paying for steel that leaves the site as scrap. Where the fabricator can take the cut lengths, order cut lengths and lose the mill-length premium but gain much better material yield. A good fabricator will tell you their yield assumption — ask for it, and compare it against your own.

## Structural steel in the Bengal market

JSW, SAIL, Tata, APL Apollo, Shyam Metalics and Super Shakti all produce IS 808 sections in this region. For a Kolkata buyer the coastal mills (JSW at Vijayanagar, Tata at Jamshedpur) carry a freight premium that Durgapur-based and Howrah-based mills do not.

SteelSetu lists the full structural range with delivered rates — send the designation and tonnage and we will price it to your site.`,
  },
];

// ===========================================================================
// Product enrichment — brand links, featured flags, city, supplier, colour
// ===========================================================================

/**
 * Maps each existing SKU to its brand row and the extra catalogue fields the
 * marketing layer needs (city, supplier, colour, featured flag, price band,
 * lead time).
 */
const PRODUCT_ENRICHMENT = {
  'TMT-012-FE500D': {
    brand_slug: 'tata-steel',
    city: 'Jamshedpur',
    supplier: 'Tata Steel — Jamshedpur Works',
    colour: 'Grey',
    featured: true,
    lead_time_days: 4,
  },
  'TMT-016-FE550D': {
    brand_slug: 'sail',
    city: 'Bokaro',
    supplier: 'SAIL — Bokaro Steel Plant',
    colour: 'Grey',
    featured: true,
    lead_time_days: 5,
  },
  'HR-CL-025-E250': {
    brand_slug: 'tata-steel',
    city: 'Jamshedpur',
    supplier: 'Tata Steel — Jamshedpur Works',
    colour: 'Black Mill Scale',
    featured: true,
    lead_time_days: 5,
  },
  'HR-CL-030-E250': {
    brand_slug: 'jsw-steel',
    city: 'Ballari',
    supplier: 'JSW Steel — Vijayanagar',
    colour: 'Black Mill Scale',
    featured: false,
    lead_time_days: 6,
  },
  'HR-CL-016-E350': {
    brand_slug: 'sail',
    city: 'Rourkela',
    supplier: 'SAIL — Bokaro Steel Plant',
    colour: 'Black Mill Scale',
    featured: false,
    lead_time_days: 6,
  },
  'MS-CH-100-50': {
    brand_slug: 'jsw-steel',
    city: 'Ballari',
    supplier: 'JSW Steel — Vijayanagar',
    colour: 'Black',
    featured: true,
    lead_time_days: 6,
  },
  'MS-SQ-025-6': {
    brand_slug: 'apl-apollo',
    city: 'Raipur',
    supplier: 'APL Apollo — Raipur',
    colour: 'Black',
    featured: false,
    lead_time_days: 7,
  },
  'MS-ANG-50-50-6': {
    brand_slug: 'shyam-metalics',
    city: 'Durgapur',
    supplier: 'Shyam Metalics — Durgapur (SEL Tiger)',
    colour: 'Black',
    featured: true,
    lead_time_days: 3,
  },
  'GI-PLAIN-060-120GSM': {
    brand_slug: 'sail',
    city: 'Bokaro',
    supplier: 'SAIL — Bokaro Steel Plant',
    colour: 'Spangled Grey',
    featured: true,
    lead_time_days: 5,
  },
  'GI-047-080GSM': {
    brand_slug: 'shyam-metalics',
    city: 'Durgapur',
    supplier: 'Shyam Metalics — Durgapur (SEL Tiger)',
    colour: 'Spangled Grey',
    featured: false,
    lead_time_days: 3,
  },
  'GI-PRF-050-120GSM': {
    brand_slug: 'shyam-metalics',
    city: 'Durgapur',
    supplier: 'Shyam Metalics — Durgapur (SEL Tiger)',
    colour: 'Spangled Grey',
    featured: true,
    lead_time_days: 3,
  },
  'GI-040-120GSM-REG': {
    brand_slug: 'tata-steel',
    city: 'Jamshedpur',
    supplier: 'Tata Steel — Jamshedpur Works',
    colour: 'Spangled Grey',
    featured: true,
    lead_time_days: 4,
  },
  'PPGL-CL-035-AZ70': {
    brand_slug: 'akshay-mahan',
    city: 'Kolkata',
    supplier: 'Akshay Mahan NMC',
    colour: 'Bare Galvanised',
    featured: false,
    lead_time_days: 3,
  },
  'PPGL-047-AZ150-GRY': {
    brand_slug: 'akshay-mahan',
    city: 'Kolkata',
    supplier: 'Akshay Mahan NMC',
    colour: 'Silver Grey',
    featured: true,
    lead_time_days: 3,
  },
  'PPGL-CL-047-AZ150': {
    brand_slug: 'jsw-steel',
    city: 'Vasanthapuram',
    supplier: 'JSW Steel — Vijayanagar',
    colour: 'Silver Grey',
    featured: true,
    lead_time_days: 6,
  },
  'PPGL-060-AZ150-RED': {
    brand_slug: 'jsw-steel',
    city: 'Vasanthapuram',
    supplier: 'JSW Steel — Vijayanagar',
    colour: 'Red Oxide',
    featured: true,
    lead_time_days: 6,
  },
  'PPGL-050-AZ150-BLU': {
    brand_slug: 'tata-steel',
    city: 'Kalinganagar',
    supplier: 'Tata Steel — Jamshedpur Works',
    colour: 'Castle Blue',
    featured: true,
    lead_time_days: 4,
  },
  'GL-COIL-060-AZ150': {
    brand_slug: 'essar-steel',
    city: 'Bhilai',
    supplier: 'Essar Steel — Bhilai',
    colour: 'Bare Galvalume',
    featured: false,
    lead_time_days: 7,
  },
  'GL-COIL-045-AZ70': {
    brand_slug: 'jindal-india',
    city: 'Howrah',
    supplier: 'Jindal (India) Ltd — Howrah Works',
    colour: 'Bare Galvalume',
    featured: true,
    lead_time_days: 2,
  },
  'CR-CL-100-IS513': {
    brand_slug: 'akshay-mahan',
    city: 'Kolkata',
    supplier: 'Akshay Mahan NMC',
    colour: 'Bright Annealed',
    featured: false,
    lead_time_days: 3,
  },
  'CR-CL-060-IS513': {
    brand_slug: 'apl-apollo',
    city: 'Raipur',
    supplier: 'APL Apollo — Raipur',
    colour: 'Bright Annealed',
    featured: false,
    lead_time_days: 7,
  },
};

// ===========================================================================
// Runner
// ===========================================================================

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  await client.connect();

  try {
    await client.query('BEGIN');

    // --- brands ------------------------------------------------------------
    for (const b of BRANDS) {
      await client.query(
        `INSERT INTO public.brands
           (id, slug, name, short_name, origin, tagline, description, website,
            founded_year, headquarters, mill_locations, capacity, product_lines,
            certifications, brand_color, is_featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, name = EXCLUDED.name, short_name = EXCLUDED.short_name,
           origin = EXCLUDED.origin, tagline = EXCLUDED.tagline,
           description = EXCLUDED.description, website = EXCLUDED.website,
           founded_year = EXCLUDED.founded_year, headquarters = EXCLUDED.headquarters,
           mill_locations = EXCLUDED.mill_locations, capacity = EXCLUDED.capacity,
           product_lines = EXCLUDED.product_lines, certifications = EXCLUDED.certifications,
           brand_color = EXCLUDED.brand_color, is_featured = EXCLUDED.is_featured,
           sort_order = EXCLUDED.sort_order`,
        [
          b.id, b.slug, b.name, b.short_name, b.origin, b.tagline, b.description,
          b.website, b.founded_year, b.headquarters, b.mill_locations, b.capacity,
          b.product_lines, b.certifications, b.brand_color, b.is_featured, b.sort_order,
        ]
      );
    }
    console.log(`  ✓ ${BRANDS.length} brands`);

    // --- suppliers ---------------------------------------------------------
    for (const s of SUPPLIERS) {
      await client.query(
        `INSERT INTO public.suppliers
           (id, slug, name, brand_id, supplier_type, city, state, country, gstin,
            phone, whatsapp, email, website, address, rating, review_count,
            min_order_tons, established_year, description, specialties,
            is_verified, is_featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, name = EXCLUDED.name, brand_id = EXCLUDED.brand_id,
           supplier_type = EXCLUDED.supplier_type, city = EXCLUDED.city,
           state = EXCLUDED.state, country = EXCLUDED.country, gstin = EXCLUDED.gstin,
           phone = EXCLUDED.phone, whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email,
           website = EXCLUDED.website, address = EXCLUDED.address, rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count, min_order_tons = EXCLUDED.min_order_tons,
           established_year = EXCLUDED.established_year, description = EXCLUDED.description,
           specialties = EXCLUDED.specialties, is_verified = EXCLUDED.is_verified,
           is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order`,
        [
          s.id, s.slug, s.name, s.brand_id, s.supplier_type, s.city, s.state,
          s.country || 'India', s.gstin, s.phone, s.whatsapp, s.email, s.website,
          s.address, s.rating, s.review_count, s.min_order_tons, s.established_year,
          s.description, s.specialties, s.is_verified, s.is_featured, s.sort_order,
        ]
      );
    }
    console.log(`  ✓ ${SUPPLIERS.length} suppliers`);

    // --- market rates ------------------------------------------------------
    for (const r of MARKET_RATES) {
      await client.query(
        `INSERT INTO public.market_rates
           (id, commodity, spec, grade, unit, price, change_pct, city, display_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           commodity = EXCLUDED.commodity, spec = EXCLUDED.spec, grade = EXCLUDED.grade,
           unit = EXCLUDED.unit, price = EXCLUDED.price, change_pct = EXCLUDED.change_pct,
           city = EXCLUDED.city, display_order = EXCLUDED.display_order`,
        [r.id, r.commodity, r.spec, r.grade, r.unit || 'MT', r.price, r.change_pct, r.city, r.display_order]
      );
    }
    console.log(`  ✓ ${MARKET_RATES.length} market rates`);

    // --- community groups --------------------------------------------------
    for (const g of COMMUNITY_GROUPS) {
      await client.query(
        `INSERT INTO public.community_groups
           (id, slug, name, description, category, member_count, post_count,
            accent_color, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, name = EXCLUDED.name, description = EXCLUDED.description,
           category = EXCLUDED.category, member_count = EXCLUDED.member_count,
           post_count = EXCLUDED.post_count, accent_color = EXCLUDED.accent_color,
           sort_order = EXCLUDED.sort_order`,
        [g.id, g.slug, g.name, g.description, g.category, g.member_count, g.post_count, g.accent_color, g.sort_order]
      );
    }
    console.log(`  ✓ ${COMMUNITY_GROUPS.length} community groups`);

    // --- blog posts --------------------------------------------------------
    for (const p of BLOG_POSTS) {
      await client.query(
        `INSERT INTO public.blog_posts
           (id, slug, title, excerpt, content, author, category, tags,
            reading_time_minutes, is_featured, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content, author = EXCLUDED.author,
           category = EXCLUDED.category, tags = EXCLUDED.tags,
           reading_time_minutes = EXCLUDED.reading_time_minutes,
           is_featured = EXCLUDED.is_featured, published_at = EXCLUDED.published_at,
           updated_at = now()`,
        [
          p.id, p.slug, p.title, p.excerpt, p.content,
          p.author || 'Steelsetu Editorial', p.category, p.tags,
          p.reading_time_minutes, p.is_featured ?? false, p.published_at,
        ]
      );
    }
    console.log(`  ✓ ${BLOG_POSTS.length} blog posts`);

    // --- product enrichment ------------------------------------------------
    let enriched = 0;
    for (const [sku, meta] of Object.entries(PRODUCT_ENRICHMENT)) {
      const { rows } = await client.query(
        `SELECT p.id, p.price_per_ton_inr, b.id AS brand_id
           FROM public.products p
           LEFT JOIN public.brands b ON b.slug = $2
          WHERE p.sku = $1`,
        [sku, meta.brand_slug]
      );
      if (rows.length === 0) {
        console.warn(`    ! SKU not found, skipped: ${sku}`);
        continue;
      }
      const row = rows[0];
      const price = Number(row.price_per_ton_inr);
      // A price band of ±4% gives the card a range without inventing a number
      // that contradicts the single authoritative rate.
      const band = Math.round((price * 0.04) / 100) * 100;

      await client.query(
        `UPDATE public.products SET
           brand_id = $2, city = $3, supplier_name = $4, colour = $5,
           is_featured = $6, is_verified = true,
           price_range_min_per_ton_inr = $7, price_range_max_per_ton_inr = $8,
           lead_time_days = $9
         WHERE id = $1`,
        [
          row.id, row.brand_id, meta.city, meta.supplier, meta.colour,
          meta.featured, price - band, price + band, meta.lead_time_days,
        ]
      );

      // Link the product to its brand in the junction table.
      if (row.brand_id) {
        await client.query(
          `INSERT INTO public.brand_products (id, brand_id, product_id, is_primary)
           VALUES ($1,$2,$3,true)
           ON CONFLICT (brand_id, product_id) DO UPDATE SET is_primary = true`,
          [`bp_${row.brand_id}_${row.id}`, row.brand_id, row.id]
        );
      }
      enriched += 1;
    }
    console.log(`  ✓ ${enriched} products enriched and linked to brands`);

    await client.query('COMMIT');
    console.log('\n✓ Platform seed complete.\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n✗ Seed failed:', err.message, '\n');
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
