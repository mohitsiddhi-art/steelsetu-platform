import { supabaseServer } from '@/lib/supabase';
import { QualityClaim } from '@/types/quality';

export async function getQualityClaims(): Promise<QualityClaim[]> {
  const { data, error } = await supabaseServer
    .from('quality_claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[qualityService] getQualityClaims failed:', error.message);
    return [];
  }

  return data ?? [];
}

export async function createQualityClaim(
  claim: Omit<QualityClaim, 'id' | 'created_at' | 'resolved_at' | 'is_verified_original' | 'resolution_status'>
): Promise<QualityClaim | null> {
  const { data, error } = await supabaseServer
    .from('quality_claims')
    .insert([claim])
    .select()
    .single();

  if (error) {
    console.error('[qualityService] createQualityClaim failed:', error.message);
    return null;
  }

  return data;
}
