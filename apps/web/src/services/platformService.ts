import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import {
  BlogPost,
  CommunityGroup,
  MarketRate,
  SteelBrand,
  SteelSupplier,
} from '@/types/platform';

/**
 * Platform-layer data access.
 *
 * Covers the additive tables from
 * `packages/database/migrations/20261021_003_platform_tables.sql` — the brand
 * directory, the supplier directory, the live rate ticker, the blog module
 * and the community groups.
 *
 * Every function here reads *public* content, so the anon key is sufficient
 * and the RLS policies on these tables allow `SELECT` to `public`. The
 * user-owned tables (profile, wishlist, saved searches, inquiries, tickets)
 * live in `userService.ts` — they need a session.
 *
 * Like `catalogService`, this module is imported from server components only.
 */

type BrandRow = Database['public']['Tables']['brands']['Row'];
type SupplierRow = Database['public']['Tables']['suppliers']['Row'];
type RateRow = Database['public']['Tables']['market_rates']['Row'];
type BlogRow = Database['public']['Tables']['blog_posts']['Row'];
type GroupRow = Database['public']['Tables']['community_groups']['Row'];

const num = (v: number | string | null | undefined, fallback = 0): number => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

const str = (v: string | null | undefined): string | undefined =>
  v === null || v === undefined || v === '' ? undefined : v;

const list = (v: string[] | null | undefined): string[] => (Array.isArray(v) ? v : []);

/** Map a `brands` row onto the app's `SteelBrand` shape. */
function toBrand(row: BrandRow): SteelBrand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: str(row.short_name),
    origin: (row.origin === 'regional' ? 'regional' : 'national'),
    tagline: str(row.tagline),
    description: str(row.description),
    website: str(row.website),
    foundedYear: row.founded_year ?? undefined,
    headquarters: str(row.headquarters),
    millLocations: list(row.mill_locations),
    capacity: str(row.capacity),
    productLines: list(row.product_lines),
    certifications: list(row.certifications),
    brandColor: row.brand_color || '#2563EB',
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

/** Map a `suppliers` row onto the app's `SteelSupplier` shape. */
function toSupplier(row: SupplierRow, brandNames: Map<string, string>): SteelSupplier {
  const type = row.supplier_type;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandId: str(row.brand_id),
    brandName: row.brand_id ? brandNames.get(row.brand_id) : undefined,
    supplierType:
      type === 'mill' || type === 'stockist' || type === 'distributor' || type === 'trader'
        ? type
        : 'distributor',
    city: row.city,
    state: row.state,
    country: row.country || 'India',
    gstin: str(row.gstin),
    phone: str(row.phone),
    whatsapp: str(row.whatsapp),
    email: str(row.email),
    website: str(row.website),
    address: str(row.address),
    rating: row.rating === null ? undefined : num(row.rating),
    reviewCount: row.review_count,
    minOrderTons: row.min_order_tons === null ? undefined : num(row.min_order_tons),
    establishedYear: row.established_year ?? undefined,
    description: str(row.description),
    specialties: list(row.specialties),
    isVerified: row.is_verified,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

/** Map a `market_rates` row onto the app's `MarketRate` shape. */
function toRate(row: RateRow): MarketRate {
  return {
    id: row.id,
    commodity: row.commodity,
    spec: str(row.spec),
    grade: str(row.grade),
    unit: row.unit || 'MT',
    price: num(row.price),
    changePct: num(row.change_pct),
    city: str(row.city),
    displayOrder: row.display_order,
  };
}

/** Map a `blog_posts` row onto the app's `BlogPost` shape. */
function toPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: str(row.cover_image),
    author: row.author || 'Steelsetu Editorial',
    category: row.category,
    tags: list(row.tags),
    readingTimeMinutes: row.reading_time_minutes,
    isFeatured: row.is_featured,
    publishedAt: row.published_at,
  };
}

/** Map a `community_groups` row onto the app's `CommunityGroup` shape. */
function toGroup(row: GroupRow): CommunityGroup {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: str(row.description),
    category: row.category,
    memberCount: row.member_count,
    postCount: row.post_count,
    accentColor: row.accent_color || '#2563EB',
    sortOrder: row.sort_order,
  };
}

// ===========================================================================
// Brands
// ===========================================================================

/** All brands, in display order. */
export async function getBrands(): Promise<SteelBrand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[platformService] getBrands failed:', error.message);
    return [];
  }
  return (data ?? []).map(toBrand);
}

/** Featured brands only — the homepage showcase. */
export async function getFeaturedBrands(): Promise<SteelBrand[]> {
  const all = await getBrands();
  return all.filter((b) => b.isFeatured);
}

/** A single brand by its slug. */
export async function getBrandBySlug(slug: string): Promise<SteelBrand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[platformService] getBrandBySlug failed:', error.message);
    return null;
  }
  return data ? toBrand(data) : null;
}

// ===========================================================================
// Suppliers
// ===========================================================================

/** All suppliers, in display order, with their brand names resolved. */
export async function getSuppliers(): Promise<SteelSupplier[]> {
  const [{ data: supplierRows, error }, { data: brandRows }] = await Promise.all([
    supabase.from('suppliers').select('*').order('sort_order', { ascending: true }),
    supabase.from('brands').select('id, name'),
  ]);

  if (error) {
    console.error('[platformService] getSuppliers failed:', error.message);
    return [];
  }

  const brandNames = new Map<string, string>();
  for (const row of brandRows ?? []) {
    brandNames.set(row.id, row.name);
  }

  return (supplierRows ?? []).map((row) => toSupplier(row, brandNames));
}

/** A single supplier by its slug. */
export async function getSupplierBySlug(slug: string): Promise<SteelSupplier | null> {
  const all = await getSuppliers();
  return all.find((s) => s.slug === slug) ?? null;
}

// ===========================================================================
// Market rates
// ===========================================================================

/** The live ticker rows, in display order. */
export async function getMarketRates(): Promise<MarketRate[]> {
  const { data, error } = await supabase
    .from('market_rates')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[platformService] getMarketRates failed:', error.message);
    return [];
  }
  return (data ?? []).map(toRate);
}

// ===========================================================================
// Blog
// ===========================================================================

/** All published posts, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[platformService] getBlogPosts failed:', error.message);
    return [];
  }
  return (data ?? []).map(toPost);
}

/** A single post by its slug. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[platformService] getBlogPostBySlug failed:', error.message);
    return null;
  }
  return data ? toPost(data) : null;
}

/** The distinct blog categories, with post counts. */
export async function getBlogCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await getBlogPosts();
  const buckets = new Map<string, number>();
  for (const post of posts) {
    buckets.set(post.category, (buckets.get(post.category) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ===========================================================================
// Community groups
// ===========================================================================

/** All active community groups, in display order. */
export async function getCommunityGroups(): Promise<CommunityGroup[]> {
  const { data, error } = await supabase
    .from('community_groups')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[platformService] getCommunityGroups failed:', error.message);
    return [];
  }
  return (data ?? []).map(toGroup);
}
