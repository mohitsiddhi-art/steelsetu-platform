BEGIN;
CREATE TABLE IF NOT EXISTS public.quality_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_ref text UNIQUE NOT NULL,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  against_entity_type text NOT NULL,
  against_entity_name text NOT NULL,
  supplier_id text REFERENCES public.suppliers(id) ON DELETE SET NULL,
  brand_id text REFERENCES public.brands(id) ON DELETE SET NULL,
  product_id text REFERENCES public.products(id) ON DELETE SET NULL,
  rfq_reference_id text,
  invoice_or_batch_no text NOT NULL,
  reporter_role text NOT NULL,
  issue_category text NOT NULL,
  measured_vs_billed_spec text,
  description text NOT NULL,
  is_verified_original boolean NOT NULL DEFAULT false,
  resolution_status text NOT NULL DEFAULT 'pending_verification',
  settlement_type text,
  credit_note_or_settlement_ref text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS qc_verified_idx ON public.quality_claims(is_verified_original);
CREATE INDEX IF NOT EXISTS qc_user_idx ON public.quality_claims(user_id);
CREATE INDEX IF NOT EXISTS qc_ref_idx ON public.quality_claims(claim_ref);
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_claim_ref_format CHECK (claim_ref ~ '^CLM-[A-Z0-9]{5,}$');
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_entity_type_check CHECK (against_entity_type IN ('brand_mill','distributor','wholesaler','dealer','retailer'));
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_reporter_check CHECK (reporter_role IN ('contractor','wholesaler','distributor','retailer'));
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_issue_check CHECK (issue_category IN ('under_gauge_thickness','weight_shortage_kanta','seconds_mixed_for_prime','coating_rust_defect','transit_damage','advance_payment_delay','mtc_mismatch'));
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_resolution_check CHECK (resolution_status IN ('pending_verification','verified_open_public','supplier_responded','settled_credit_note','settled_replacement','settled_mutual','rejected_unverified'));
ALTER TABLE public.quality_claims ADD CONSTRAINT qc_settlement_check CHECK (settlement_type IN ('credit_note','replacement','rate_adjustment','mutual_understanding') OR settlement_type IS NULL);
COMMIT;
