/**
 * Platform-layer domain types.
 *
 * These mirror the additive tables created by
 * `packages/database/migrations/20261021_003_platform_tables.sql`: the brand
 * directory, the supplier directory, the live rate ticker, the blog module,
 * the community groups and the user portal tables.
 */

/** A mill or brand in the national + regional directory. */
export interface SteelBrand {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  /** `national` for pan-India brands, `regional` for eastern-focused mills. */
  origin: 'national' | 'regional';
  tagline?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  headquarters?: string;
  millLocations: string[];
  capacity?: string;
  productLines: string[];
  certifications: string[];
  brandColor: string;
  isFeatured: boolean;
  sortOrder: number;
}

/** A mill, stockist or trader behind the catalogue. */
export interface SteelSupplier {
  id: string;
  slug: string;
  name: string;
  brandId?: string;
  brandName?: string;
  /** `mill` | `stockist` | `distributor` | `trader` */
  supplierType: 'mill' | 'stockist' | 'distributor' | 'trader';
  city: string;
  state: string;
  country: string;
  gstin?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  rating?: number;
  reviewCount: number;
  minOrderTons?: number;
  establishedYear?: number;
  description?: string;
  specialties: string[];
  isVerified: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

/** One line in the live price ticker. */
export interface MarketRate {
  id: string;
  commodity: string;
  spec?: string;
  grade?: string;
  unit: string;
  price: number;
  changePct: number;
  city?: string;
  displayOrder: number;
}

/** A published article in the SEO blog module. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  isFeatured: boolean;
  publishedAt: string;
}

/** A community space on the community layer. */
export interface CommunityGroup {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  memberCount: number;
  postCount: number;
  accentColor: string;
  sortOrder: number;
}

/** A signed-in portal user. */
export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  /** `buyer` or `seller` — drives the dashboard route. */
  role: 'buyer' | 'seller';
  phone?: string;
  company?: string;
  companyType?: string;
  gstin?: string;
  city?: string;
  avatarUrl?: string;
  locale: string;
  createdAt: string;
}

/** A saved product on the user's wishlist. */
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

/** A saved search with an optional price alert. */
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: Record<string, unknown>;
  alertFrequency: 'none' | 'daily' | 'weekly';
  createdAt: string;
}

/** An inquiry raised from the portal. */
export interface PortalInquiry {
  id: string;
  referenceId: string;
  productName?: string;
  buyerName: string;
  companyName?: string;
  quantityTons?: number;
  message?: string;
  status: 'submitted' | 'quoted' | 'closed';
  createdAt: string;
}

/** A support ticket raised from the portal. */
export interface SupportTicket {
  id: string;
  ticketRef: string;
  subject: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  message: string;
  createdAt: string;
}

/**
 * The eight sections of the post-login dashboard.
 *
 * The set is fixed by the spec, and each one has a real backing table or
 * route behind it — a tile that goes nowhere is worse than no tile at all.
 */
export type DashboardSection =
  | 'wishlist'
  | 'inquiries'
  | 'rfqs'
  | 'chat'
  | 'community'
  | 'tickets'
  | 'searches'
  | 'settings';

/** The eight dashboard cards shown after sign-in. */
export interface DashboardCard {
  key: DashboardSection;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  accent: string;
}
