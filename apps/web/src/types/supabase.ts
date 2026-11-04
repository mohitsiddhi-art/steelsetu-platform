/**
 * Hand-written Supabase `Database` type.
 *
 * Mirrors the live flat, snake_case schema in the SteelSetu Supabase project.
 * The Prisma schema in packages/database/prisma/schema.prisma describes an
 * aspirational platform and does NOT match the deployed tables — see
 * packages/database/migrations/README.md. This file is the source of truth for
 * the web app.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          category: string;
          thickness_mm: number;
          width_mm: number;
          length_mm: number | null;
          coating: string;
          price_per_ton_inr: number;
          minimum_order_tons: number;
          inventory_tons: number;
          is_in_stock: boolean | null;
          created_at: string | null;
          brand: string | null;
          grade: string | null;
          hsn_code: string | null;
          specifications: Json | null;
          image_url: string | null;
          description: string | null;
          mill_name: string | null;
          uom: string;
          stock_updated_at: string | null;
          updated_by: string | null;
          brand_id: string | null;
          city: string | null;
          supplier_name: string | null;
          colour: string | null;
          is_featured: boolean;
          is_verified: boolean;
          price_range_min_per_ton_inr: number | null;
          price_range_max_per_ton_inr: number | null;
          lead_time_days: number | null;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          category: string;
          thickness_mm: number;
          width_mm: number;
          length_mm?: number | null;
          coating: string;
          price_per_ton_inr: number;
          minimum_order_tons: number;
          inventory_tons: number;
          is_in_stock?: boolean | null;
          created_at?: string | null;
          brand?: string | null;
          grade?: string | null;
          hsn_code?: string | null;
          specifications?: Json | null;
          image_url?: string | null;
          description?: string | null;
          mill_name?: string | null;
          uom?: string;
          stock_updated_at?: string | null;
          updated_by?: string | null;
          brand_id?: string | null;
          city?: string | null;
          supplier_name?: string | null;
          colour?: string | null;
          is_featured?: boolean;
          is_verified?: boolean;
          price_range_min_per_ton_inr?: number | null;
          price_range_max_per_ton_inr?: number | null;
          lead_time_days?: number | null;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };
      rfq_inquiries: {
        Row: {
          id: string;
          reference_id: string;
          buyer_name: string;
          company_name: string;
          gst_number: string;
          product_id: string | null;
          product_name: string | null;
          tons: number;
          delivery_pincode: string;
          custom_specs: string | null;
          status: string;
          created_at: string | null;
          user_id: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          reference_id: string;
          buyer_name: string;
          company_name: string;
          gst_number: string;
          product_id?: string | null;
          product_name?: string | null;
          tons: number;
          delivery_pincode: string;
          custom_specs?: string | null;
          status?: string;
          created_at?: string | null;
          user_id?: string | null;
          source?: string;
        };
        Update: Partial<Database['public']['Tables']['rfq_inquiries']['Insert']>;
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string | null;
          origin: string;
          tagline: string | null;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          founded_year: number | null;
          headquarters: string | null;
          mill_locations: string[];
          capacity: string | null;
          product_lines: string[];
          certifications: string[];
          brand_color: string;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['brands']['Row']> & {
          id: string;
          slug: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['brands']['Insert']>;
        Relationships: [];
      };
      brand_products: {
        Row: {
          id: string;
          brand_id: string;
          product_id: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['brand_products']['Row']> & {
          id: string;
          brand_id: string;
          product_id: string;
        };
        Update: Partial<Database['public']['Tables']['brand_products']['Insert']>;
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand_id: string | null;
          supplier_type: string;
          city: string;
          state: string;
          country: string;
          gstin: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          website: string | null;
          address: string | null;
          rating: number | null;
          review_count: number;
          min_order_tons: number | null;
          established_year: number | null;
          description: string | null;
          logo_url: string | null;
          specialties: string[];
          is_verified: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['suppliers']['Row']> & {
          id: string;
          slug: string;
          name: string;
          city: string;
          state: string;
        };
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>;
        Relationships: [];
      };
      market_rates: {
        Row: {
          id: string;
          commodity: string;
          spec: string | null;
          grade: string | null;
          unit: string;
          price: number;
          change_pct: number;
          city: string | null;
          display_order: number;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['market_rates']['Row']> & {
          id: string;
          commodity: string;
          price: number;
        };
        Update: Partial<Database['public']['Tables']['market_rates']['Insert']>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          author: string;
          author_role: string | null;
          category: string;
          tags: string[];
          reading_time_minutes: number;
          is_featured: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
        Relationships: [];
      };
      community_groups: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: string;
          member_count: number;
          post_count: number;
          accent_color: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['community_groups']['Row']> & {
          id: string;
          slug: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['community_groups']['Insert']>;
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string | null;
          email: string | null;
          role: string;
          phone: string | null;
          company: string | null;
          company_type: string | null;
          gstin: string | null;
          city: string | null;
          avatar_url: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['user_profiles']['Row']> & {
          user_id: string;
          first_name: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
        Relationships: [];
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['wishlist']['Row']> & {
          user_id: string;
          product_id: string;
        };
        Update: Partial<Database['public']['Tables']['wishlist']['Insert']>;
        Relationships: [];
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          query: Json;
          alert_frequency: string;
          last_notified_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['saved_searches']['Row']> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['saved_searches']['Insert']>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          reference_id: string;
          user_id: string | null;
          product_id: string | null;
          product_name: string | null;
          buyer_name: string;
          company_name: string | null;
          phone: string | null;
          email: string | null;
          quantity_tons: number | null;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['inquiries']['Row']> & {
          reference_id: string;
          buyer_name: string;
        };
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>;
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_ref: string;
          user_id: string | null;
          subject: string;
          category: string;
          priority: string;
          status: string;
          message: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['support_tickets']['Row']> & {
          ticket_ref: string;
          subject: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>;
        Relationships: [];
      };
      quality_claims: {
        Row: {
          id: string;
          claim_ref: string;
          user_id: string | null;
          against_entity_type: string;
          against_entity_name: string;
          supplier_id: string | null;
          brand_id: string | null;
          product_id: string | null;
          rfq_reference_id: string | null;
          invoice_or_batch_no: string;
          reporter_role: string;
          issue_category: string;
          measured_vs_billed_spec: string | null;
          description: string;
          is_verified_original: boolean;
          resolution_status: string;
          settlement_type: string | null;
          credit_note_or_settlement_ref: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['quality_claims']['Row']> & {
          claim_ref: string;
          against_entity_type: string;
          against_entity_name: string;
          invoice_or_batch_no: string;
          reporter_role: string;
          issue_category: string;
          description: string;
        };
        Update: Partial<Database['public']['Tables']['quality_claims']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
