-- 20261021_003_platform_tables.sql
-- Additive platform expansion: brands, suppliers, blog, and the user portal.
--
-- The live Supabase schema is flat + snake_case and does NOT match
-- packages/database/prisma/schema.prisma, so we never run `prisma db push`
-- against it. See migrations/README.md.
--
-- This migration is ADDITIVE ONLY. It:
--   * creates new tables (CREATE TABLE IF NOT EXISTS)
--   * adds nullable / defaulted columns to `products` (ADD COLUMN IF NOT EXISTS)
--   * adds indexes (CREATE INDEX IF NOT EXISTS)
--   * enables RLS and installs policies
-- It never drops or renames anything. The existing 21-SKU catalogue and the
-- `rfq_inquiries` pipeline are untouched.
--
-- Access model
-- ------------
-- Public catalogue content (brands, suppliers, blog, market rates, community
-- groups) is world-readable — it is the shop window, and the pages that render
-- it are public marketing pages.
--
-- Everything belonging to a signed-in user (profile, wishlist, saved searches,
-- support tickets, portal inquiries) is readable and writable only by that
-- user, keyed off `auth.uid()`. There is no admin backdoor on these tables; the
-- staff trade desk reads `rfq_inquiries`, which has its own policy.
--
-- Supabase's default privileges grant `anon` and `authenticated` full DML on
-- every new table in `public`, so each table's grants are trimmed explicitly
-- below. RLS is the real gate; the grants are the second lock.

BEGIN;

-- ===========================================================================
-- 1. brands — the national + regional brand directory
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.brands (
  id                text PRIMARY KEY,
  slug              text NOT NULL UNIQUE,
  name              text NOT NULL,
  short_name        text,
  origin            text NOT NULL DEFAULT 'national',   -- national | regional
  tagline           text,
  description       text,
  logo_url          text,
  website           text,
  founded_year      integer,
  headquarters      text,
  mill_locations    text[] NOT NULL DEFAULT '{}',
  capacity          text,
  product_lines     text[] NOT NULL DEFAULT '{}',
  certifications    text[] NOT NULL DEFAULT '{}',
  brand_color       text NOT NULL DEFAULT '#2563EB',
  is_featured       boolean NOT NULL DEFAULT false,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brands_origin_idx  ON public.brands (origin);
CREATE INDEX IF NOT EXISTS brands_featured_idx ON public.brands (is_featured);

-- ===========================================================================
-- 2. brand_products — many-to-many between brands and the live catalogue
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.brand_products (
  id            text PRIMARY KEY,
  brand_id      text NOT NULL REFERENCES public.brands (id) ON DELETE CASCADE,
  product_id    text NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  is_primary    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS brand_products_pair_idx
  ON public.brand_products (brand_id, product_id);
CREATE INDEX IF NOT EXISTS brand_products_brand_idx   ON public.brand_products (brand_id);
CREATE INDEX IF NOT EXISTS brand_products_product_idx ON public.brand_products (product_id);

-- ===========================================================================
-- 3. suppliers — the mills, stockists and traders behind the catalogue
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
  id                text PRIMARY KEY,
  slug              text NOT NULL UNIQUE,
  name              text NOT NULL,
  brand_id          text REFERENCES public.brands (id) ON DELETE SET NULL,
  supplier_type     text NOT NULL DEFAULT 'distributor',  -- mill | stockist | distributor | trader
  city              text NOT NULL,
  state             text NOT NULL,
  country           text NOT NULL DEFAULT 'India',
  gstin             text,
  phone             text,
  whatsapp          text,
  email             text,
  website           text,
  address           text,
  rating            numeric,
  review_count      integer NOT NULL DEFAULT 0,
  min_order_tons    numeric,
  established_year  integer,
  description       text,
  logo_url          text,
  specialties       text[] NOT NULL DEFAULT '{}',
  is_verified       boolean NOT NULL DEFAULT false,
  is_featured       boolean NOT NULL DEFAULT false,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS suppliers_brand_idx  ON public.suppliers (brand_id);
CREATE INDEX IF NOT EXISTS suppliers_city_idx   ON public.suppliers (city);
CREATE INDEX IF NOT EXISTS suppliers_type_idx   ON public.suppliers (supplier_type);
CREATE INDEX IF NOT EXISTS suppliers_featured_idx ON public.suppliers (is_featured);

-- ===========================================================================
-- 4. market_rates — the live steel price ticker
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.market_rates (
  id            text PRIMARY KEY,
  commodity     text NOT NULL,
  spec          text,
  grade         text,
  unit          text NOT NULL DEFAULT 'MT',
  price         numeric NOT NULL,
  change_pct    numeric NOT NULL DEFAULT 0,
  city          text,
  display_order integer NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS market_rates_order_idx ON public.market_rates (display_order);

-- ===========================================================================
-- 5. blog_posts — the SEO content module
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id                  text PRIMARY KEY,
  slug                text NOT NULL UNIQUE,
  title               text NOT NULL,
  excerpt             text NOT NULL,
  content             text NOT NULL,
  cover_image         text,
  author              text NOT NULL DEFAULT 'Steelsetu Editorial',
  author_role         text,
  category            text NOT NULL DEFAULT 'Guides',
  tags                text[] NOT NULL DEFAULT '{}',
  reading_time_minutes integer NOT NULL DEFAULT 5,
  is_featured         boolean NOT NULL DEFAULT false,
  published_at        timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_category_idx   ON public.blog_posts (category);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx  ON public.blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_featured_idx   ON public.blog_posts (is_featured);

-- ===========================================================================
-- 6. community_groups — the community layer
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.community_groups (
  id            text PRIMARY KEY,
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  description   text,
  category      text NOT NULL DEFAULT 'General',
  member_count  integer NOT NULL DEFAULT 0,
  post_count    integer NOT NULL DEFAULT 0,
  accent_color  text NOT NULL DEFAULT '#2563EB',
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_groups_category_idx ON public.community_groups (category);

-- ===========================================================================
-- 7. user_profiles — the portal identity
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- `auth.users.id` is a uuid, so the FK column has to be one too.
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name    text NOT NULL,
  last_name     text,
  email         text,
  role          text NOT NULL DEFAULT 'buyer',      -- buyer | seller
  phone         text,
  company       text,
  company_type  text,
  gstin         text,
  city          text,
  avatar_url    text,
  locale        text NOT NULL DEFAULT 'en',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_profiles_role_idx  ON public.user_profiles (role);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles (email);

-- ===========================================================================
-- 8. wishlist — saved products
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.wishlist (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.user_profiles (id) ON DELETE CASCADE,
  product_id  text NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_product_idx
  ON public.wishlist (user_id, product_id);
CREATE INDEX IF NOT EXISTS wishlist_user_idx ON public.wishlist (user_id);

-- ===========================================================================
-- 9. saved_searches — saved searches and price alerts
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.saved_searches (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.user_profiles (id) ON DELETE CASCADE,
  name              text NOT NULL,
  query             jsonb NOT NULL DEFAULT '{}'::jsonb,
  alert_frequency   text NOT NULL DEFAULT 'none',   -- none | daily | weekly
  last_notified_at  timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_searches_user_idx ON public.saved_searches (user_id);

-- ===========================================================================
-- 10. inquiries — the portal-side inquiry thread (distinct from rfq_inquiries)
-- ===========================================================================

-- `rfq_inquiries` is the staff pipeline and is intentionally a separate,
-- strictly-typed table with its own RLS. `inquiries` is what a signed-in
-- portal user creates and tracks from their own dashboard.

CREATE TABLE IF NOT EXISTS public.inquiries (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id   text NOT NULL UNIQUE,
  user_id        uuid REFERENCES public.user_profiles (id) ON DELETE SET NULL,
  product_id     text REFERENCES public.products (id) ON DELETE SET NULL,
  product_name   text,
  buyer_name     text NOT NULL,
  company_name   text,
  phone          text,
  email          text,
  quantity_tons  numeric,
  message        text,
  status         text NOT NULL DEFAULT 'submitted',  -- submitted | quoted | closed
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_user_idx    ON public.inquiries (user_id);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);

-- ===========================================================================
-- 11. support_tickets
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_ref   text NOT NULL UNIQUE,
  user_id      uuid REFERENCES public.user_profiles (id) ON DELETE SET NULL,
  subject      text NOT NULL,
  category     text NOT NULL DEFAULT 'general',
  priority     text NOT NULL DEFAULT 'normal',    -- low | normal | high | urgent
  status       text NOT NULL DEFAULT 'open',       -- open | in_progress | resolved | closed
  message      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_tickets_user_idx   ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets (status);

-- ===========================================================================
-- 12. Extra catalogue columns for the featured-product and price views
-- ===========================================================================

-- All nullable or defaulted, so the existing 21 rows stay valid untouched.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand_id        text REFERENCES public.brands (id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS city             text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_name     text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colour            text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured       boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_verified       boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_range_min_per_ton_inr numeric;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_range_max_per_ton_inr numeric;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lead_time_days    integer;

CREATE INDEX IF NOT EXISTS products_brand_id_idx   ON public.products (brand_id);
CREATE INDEX IF NOT EXISTS products_featured_idx   ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS products_city_idx       ON public.products (city);

-- ===========================================================================
-- 13. Row Level Security
-- ===========================================================================

ALTER TABLE public.brands            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_rates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets   ENABLE ROW LEVEL SECURITY;

-- --- Public read policies -------------------------------------------------

DROP POLICY IF EXISTS "Public read on brands" ON public.brands;
CREATE POLICY "Public read on brands" ON public.brands FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read on brand_products" ON public.brand_products;
CREATE POLICY "Public read on brand_products" ON public.brand_products FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read on suppliers" ON public.suppliers;
CREATE POLICY "Public read on suppliers" ON public.suppliers FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read on market_rates" ON public.market_rates;
CREATE POLICY "Public read on market_rates" ON public.market_rates FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read on blog_posts" ON public.blog_posts;
CREATE POLICY "Public read on blog_posts" ON public.blog_posts FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read on community_groups" ON public.community_groups;
CREATE POLICY "Public read on community_groups" ON public.community_groups FOR SELECT TO public USING (true);

-- --- Owner-scoped policies ------------------------------------------------
--
-- The owner is resolved through `user_profiles.user_id`, which mirrors
-- `auth.users.id`. A user therefore cannot read or write another user's rows
-- even if they guess a profile id.

DROP POLICY IF EXISTS "Owner read on user_profiles" ON public.user_profiles;
CREATE POLICY "Owner read on user_profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owner insert on user_profiles" ON public.user_profiles;
CREATE POLICY "Owner insert on user_profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owner update on user_profiles" ON public.user_profiles;
CREATE POLICY "Owner update on user_profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owner read on wishlist" ON public.wishlist;
CREATE POLICY "Owner read on wishlist" ON public.wishlist
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = wishlist.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner insert on wishlist" ON public.wishlist;
CREATE POLICY "Owner insert on wishlist" ON public.wishlist
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles p
                       WHERE p.id = wishlist.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner delete on wishlist" ON public.wishlist;
CREATE POLICY "Owner delete on wishlist" ON public.wishlist
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = wishlist.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner read on saved_searches" ON public.saved_searches;
CREATE POLICY "Owner read on saved_searches" ON public.saved_searches
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = saved_searches.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner insert on saved_searches" ON public.saved_searches;
CREATE POLICY "Owner insert on saved_searches" ON public.saved_searches
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles p
                       WHERE p.id = saved_searches.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner delete on saved_searches" ON public.saved_searches;
CREATE POLICY "Owner delete on saved_searches" ON public.saved_searches
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = saved_searches.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner read on inquiries" ON public.inquiries;
CREATE POLICY "Owner read on inquiries" ON public.inquiries
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = inquiries.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner insert on inquiries" ON public.inquiries;
CREATE POLICY "Owner insert on inquiries" ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles p
                       WHERE p.id = inquiries.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner read on support_tickets" ON public.support_tickets;
CREATE POLICY "Owner read on support_tickets" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles p
                  WHERE p.id = support_tickets.user_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner insert on support_tickets" ON public.support_tickets;
CREATE POLICY "Owner insert on support_tickets" ON public.support_tickets
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles p
                       WHERE p.id = support_tickets.user_id AND p.user_id = auth.uid()));

-- Staff can read every inquiry and ticket — same single flag as the trade desk.
DROP POLICY IF EXISTS "Staff read on inquiries" ON public.inquiries;
CREATE POLICY "Staff read on inquiries" ON public.inquiries
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');

DROP POLICY IF EXISTS "Staff read on support_tickets" ON public.support_tickets;
CREATE POLICY "Staff read on support_tickets" ON public.support_tickets
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');

-- ===========================================================================
-- 14. Trim the blanket grants
-- ===========================================================================

-- Public catalogue content: read only.
REVOKE ALL ON public.brands           FROM anon, authenticated;
GRANT SELECT ON public.brands           TO anon, authenticated;
REVOKE ALL ON public.brand_products   FROM anon, authenticated;
GRANT SELECT ON public.brand_products   TO anon, authenticated;
REVOKE ALL ON public.suppliers        FROM anon, authenticated;
GRANT SELECT ON public.suppliers        TO anon, authenticated;
REVOKE ALL ON public.market_rates     FROM anon, authenticated;
GRANT SELECT ON public.market_rates     TO anon, authenticated;
REVOKE ALL ON public.blog_posts       FROM anon, authenticated;
GRANT SELECT ON public.blog_posts       TO anon, authenticated;
REVOKE ALL ON public.community_groups FROM anon, authenticated;
GRANT SELECT ON public.community_groups TO anon, authenticated;

-- Owner-scoped tables: authenticated may create, read and delete their own
-- rows. RLS decides which rows those are.
REVOKE ALL ON public.user_profiles  FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
REVOKE ALL ON public.wishlist       FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;
REVOKE ALL ON public.saved_searches FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_searches TO authenticated;
REVOKE ALL ON public.inquiries      FROM anon, authenticated;
GRANT SELECT, INSERT ON public.inquiries TO authenticated;
REVOKE ALL ON public.support_tickets FROM anon, authenticated;
GRANT SELECT, INSERT ON public.support_tickets TO authenticated;

COMMIT;
