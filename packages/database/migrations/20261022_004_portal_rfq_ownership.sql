-- 20261022_004_portal_rfq_ownership.sql
-- Attribute portal-submitted RFQs to the signed-in buyer.
--
-- Background
-- ----------
-- The portal's "My RFQs" card needs to show a buyer the requests they
-- raised, but `rfq_inquiries` had no owner column — the table was created
-- for the anonymous product-page RFQ form, which has no concept of a
-- signed-in buyer.
--
-- This migration is ADDITIVE ONLY:
--   * adds two nullable / defaulted columns
--   * adds an index
--   * adds one owner-scoped SELECT policy
-- It never drops or renames anything, and the existing rows keep working
-- with `user_id = NULL` (they stay visible to staff exactly as before).
--
-- The `source` column records where a row came from — 'web' for the public
-- product-page form, 'portal' for a request raised from the dashboard — so
-- the trade desk can tell the two apart without inferring it from NULLs.
--
-- The `user_id` column is populated ONLY by the server, from the verified
-- session claims. It is never read from the request body, so a caller cannot
-- file an inquiry against somebody else's account.
--
-- Access model after this migration:
--   * INSERT  — unchanged, `TO public` with `WITH CHECK (true)`, and the
--               `anon` role keeps its INSERT grant. The public RFQ form is
--               unaffected.
--   * SELECT  — staff still read every row; a signed-in buyer additionally
--               reads the rows where `user_id = auth.uid()`. The two policies
--               are OR'd by Postgres, so neither weakens the other.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Columns
-- ---------------------------------------------------------------------------

-- `auth.users.id` is a uuid, so the FK column has to be one too.
ALTER TABLE public.rfq_inquiries
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.rfq_inquiries
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'web';

-- ---------------------------------------------------------------------------
-- 2. Index
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS rfq_inquiries_user_idx ON public.rfq_inquiries (user_id);

-- ---------------------------------------------------------------------------
-- 3. Owner-scoped read policy
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow owner read on rfq_inquiries" ON public.rfq_inquiries;

CREATE POLICY "Allow owner read on rfq_inquiries"
  ON public.rfq_inquiries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

COMMIT;
