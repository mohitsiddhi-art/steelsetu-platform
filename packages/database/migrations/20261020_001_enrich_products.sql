-- 20261020_001_enrich_products.sql
-- Additive migration: enrich the flat `products` table with catalog metadata
-- needed by the /products catalog page (brands, grades, HSN codes, specs).
--
-- This is deliberately ADDITIVE. The live Supabase schema is flat + snake_case
-- and does NOT match packages/database/prisma/schema.prisma, so we never run
-- `prisma db push` against it. See migrations/README.md.

BEGIN;

-- Mill / manufacturer brand (Tata Steel, JSW, SAIL, AM/NS, Essar, Jindal...)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS brand text;

-- IS specification grade (IS 277, IS 2062 E250, IS 1786 Fe500D...)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS grade text;

-- Harmonised System of Nomenclature code for customs/ GST classification
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS hsn_code text;

-- Free-form structured attributes (yield strength, coating g/m2, surface finish...)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS specifications jsonb;

-- Catalogue artwork
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url text;

-- Human-readable marketing description for the product detail page
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description text;

-- Mill name (distinct from consumer-facing brand)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS mill_name text;

-- Minimum order quantity unit (MT / KG / PCS)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS uom text NOT NULL DEFAULT 'MT';

-- Last stock refresh timestamp
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_updated_at timestamptz;

-- Who last touched the row (seed script or admin id)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS updated_by text;

-- Indexes that back the catalog filters
CREATE INDEX IF NOT EXISTS products_category_idx   ON products (category);
CREATE INDEX IF NOT EXISTS products_brand_idx      ON products (brand);
CREATE INDEX IF NOT EXISTS products_grade_idx      ON products (grade);
CREATE INDEX IF NOT EXISTS products_price_idx      ON products (price_per_ton_inr);
CREATE INDEX IF NOT EXISTS products_in_stock_idx   ON products (is_in_stock);
CREATE INDEX IF NOT EXISTS products_specs_gin_idx  ON products USING gin (specifications);

-- Text search over name + sku + brand, for the catalog search box
CREATE INDEX IF NOT EXISTS products_search_idx
  ON products
  USING gin (
    to_tsvector('simple',
      coalesce(name, '') || ' ' || coalesce(sku, '') || ' ' || coalesce(brand, '')
    )
  );

COMMIT;
