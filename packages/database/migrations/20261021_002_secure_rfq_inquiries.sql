-- 20261021_002_secure_rfq_inquiries.sql
-- Lock down the RFQ inquiry table for the staff-only trade desk.
--
-- The live Supabase schema is flat + snake_case and does NOT match
-- packages/database/prisma/schema.prisma, so we never run `prisma db push`
-- against it. See migrations/README.md.
--
-- Background
-- ----------
-- `rfq_inquiries` holds buyer names, enterprise names, GSTINs, quantities and
-- delivery pincodes. That is commercially sensitive, so the table needs two
-- different access rules that pull in opposite directions:
--
--   * INSERT for `public`  — anonymous buyers submit inquiries from the
--     product pages with nothing but the anon key. This must be preserved.
--   * SELECT for staff only — the trade desk ledger and GET /api/rfq are
--     staff-only surfaces.
--
-- Staff-ness is one flag: `app_metadata.staff = true` in the user's access
-- token, set by an admin in `auth.users.raw_app_meta_data`. The database
-- reads it with `auth.jwt()`, and the app reads the same claim from the
-- verified token, so the app check and the database check share one source of
-- truth and cannot drift apart.
--
-- This migration is idempotent: every statement is safe to re-run.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.rfq_inquiries ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Staff-scoped read policy
-- ---------------------------------------------------------------------------

-- Drop any earlier version of this policy by name so the definition below is
-- the single source of truth. `IF EXISTS` keeps re-runs clean.
DROP POLICY IF EXISTS "Allow staff read on rfq_inquiries" ON public.rfq_inquiries;

CREATE POLICY "Allow staff read on rfq_inquiries"
  ON public.rfq_inquiries
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');

-- ---------------------------------------------------------------------------
-- 3. Public insert policy — preserved
-- ---------------------------------------------------------------------------

-- The public submission path depends on this. It is recreated only if it went
-- missing, so re-running this migration never removes the ability for an
-- anonymous buyer to submit an RFQ.
DROP POLICY IF EXISTS "Allow public insert on rfq_inquiries" ON public.rfq_inquiries;

CREATE POLICY "Allow public insert on rfq_inquiries"
  ON public.rfq_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. Trim the blanket grants
-- ---------------------------------------------------------------------------

-- Supabase's default privileges give `anon` and `authenticated` full DML on
-- every table in `public`. RLS is what actually protects the rows, but a
-- principle-of-least-privilege grant means an accidental `FOR ALL` policy
-- elsewhere cannot open the door. The app only ever needs:
--
--   anon         → SELECT on products, INSERT on rfq_inquiries
--   authenticated → SELECT on products and rfq_inquiries
--
-- Note: `anon` keeps INSERT on rfq_inquiries, because the public RFQ form
-- posts with the anon key. It keeps no SELECT, which is what makes the
-- ledger unreadable without a session.

REVOKE ALL ON public.rfq_inquiries FROM anon, authenticated;
GRANT INSERT ON public.rfq_inquiries TO anon;
GRANT SELECT ON public.rfq_inquiries TO authenticated;

-- The catalogue is public by design — it is the shop window. Reads only.
REVOKE ALL ON public.products FROM anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;

-- The company profile table is not read by the app at all, and it holds the
-- business's own GSTIN and address. No client role needs it.
REVOKE ALL ON public."Company" FROM anon, authenticated;

-- The migration bookkeeping table is infrastructure, not application data.
-- RLS was never enabled on it while `anon` held full DML, which meant anyone
-- with the publishable key could rewrite the migration history.
REVOKE ALL ON public.schema_migrations FROM anon, authenticated;

COMMIT;
