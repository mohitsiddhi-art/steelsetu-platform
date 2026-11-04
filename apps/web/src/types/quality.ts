import { Database } from '@/types/supabase';

export type QualityClaim = Database['public']['Tables']['quality_claims']['Row'];

export type ClaimStatus =
  | 'pending_verification'
  | 'verified_open_public'
  | 'supplier_responded'
  | 'settled_credit_note'
  | 'settled_replacement'
  | 'settled_mutual'
  | 'rejected_unverified';

export type IssueCategory =
  | 'under_gauge_thickness'
  | 'weight_shortage_kanta'
  | 'seconds_mixed_for_prime'
  | 'coating_rust_defect'
  | 'transit_damage'
  | 'advance_payment_delay'
  | 'mtc_mismatch';
