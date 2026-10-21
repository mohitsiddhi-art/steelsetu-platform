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
          status: string;
          created_at: string | null;
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
          status?: string;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['rfq_inquiries']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
