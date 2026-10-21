import { supabaseServer } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { Database } from '@/types/supabase';

/**
 * Trade desk inquiry data access.
 *
 * Inquiries live in the flat `rfq_inquiries` table (see
 * packages/database/migrations/README.md).
 *
 * The table has two policies, and they pull in opposite directions:
 *   - INSERT is allowed for `public`, so an anonymous buyer can submit an
 *     inquiry with nothing but the anon key.
 *   - SELECT is allowed only for staff (`auth.jwt() -> 'app_metadata' ->
 *     'staff'`), so the ledger cannot be read by an anonymous visitor.
 *
 * That asymmetry is the whole point, and it dictates the shape of the two
 * functions below:
 *
 *   - `getAllRfqs` must use a **session-bound** client. The plain anon client
 *     would arrive at PostgREST as the `anon` role and be refused by the
 *     staff-only SELECT policy, silently returning an empty ledger.
 *
 *   - `addRfq` must **not** ask for the inserted row back. A `.select()` turns
 *     the insert into `INSERT ... RETURNING`, which PostgREST serves under
 *     SELECT privilege — and the anon role has no SELECT policy on this
 *     table, so the insert would fail with an RLS error even though the
 *     insert itself is permitted. The caller already knows every field it
 *     wrote, so the stored record is echoed back from the request.
 *
 * `product_id` is a FK to `products(id)` ON DELETE SET NULL, so a deleted
 * product leaves the inquiry intact with a null product reference.
 */

export type RfqStatus = 'PENDING' | 'ALLOCATED' | 'REJECTED';

export interface StoredRFQ {
  referenceId: string;
  buyerName: string;
  companyName: string;
  gstNumber: string;
  tons: number;
  productId: string | null;
  productName: string | null;
  pincode: string;
  status: RfqStatus;
  timestamp: string;
}

/** Row shape as returned by the typed Supabase client. */
type RfqDbRow = Database['public']['Tables']['rfq_inquiries']['Row'];

function toRfq(row: RfqDbRow): StoredRFQ {
  return {
    referenceId: row.reference_id,
    buyerName: row.buyer_name,
    companyName: row.company_name,
    gstNumber: row.gst_number,
    tons: Number(row.tons) || 0,
    productId: row.product_id,
    productName: row.product_name,
    pincode: row.delivery_pincode,
    status: row.status as RfqStatus,
    timestamp: row.created_at ?? new Date().toISOString(),
  };
}

/**
 * Every inquiry, newest first.
 *
 * Uses a session-bound client so PostgREST evaluates the query as the
 * signed-in `authenticated` role. Only a staff session clears the SELECT
 * policy, so this returns an empty list for anyone else — the caller is
 * expected to have checked the session already.
 */
export async function getAllRfqs(): Promise<StoredRFQ[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('rfq_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[rfqService] getAllRfqs failed:', error.message);
    return [];
  }

  return (data ?? []).map(toRfq);
}

/**
 * Persist a new inquiry.
 *
 * Public path — the anon key is enough, because the INSERT policy allows
 * `public`. No `.select()` is used on purpose; see the note at the top of
 * this file for why asking for the row back would break the insert.
 *
 * Returns the stored record so the caller can confirm what was logged.
 */
export async function addRfq(
  item: Omit<StoredRFQ, 'timestamp'> & { timestamp?: string }
): Promise<StoredRFQ | null> {
  const timestamp = item.timestamp ?? new Date().toISOString();

  const { error } = await supabaseServer.from('rfq_inquiries').insert({
    reference_id: item.referenceId,
    buyer_name: item.buyerName,
    company_name: item.companyName,
    gst_number: item.gstNumber,
    product_id: item.productId,
    product_name: item.productName,
    tons: item.tons,
    delivery_pincode: item.pincode,
    status: item.status,
    created_at: timestamp,
  });

  if (error) {
    console.error('[rfqService] addRfq failed:', error.message);
    return null;
  }

  return {
    referenceId: item.referenceId,
    buyerName: item.buyerName,
    companyName: item.companyName,
    gstNumber: item.gstNumber,
    tons: item.tons,
    productId: item.productId,
    productName: item.productName,
    pincode: item.pincode,
    status: item.status,
    timestamp,
  };
}
