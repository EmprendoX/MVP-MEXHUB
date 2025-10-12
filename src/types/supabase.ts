/**
 * TIPOS TYPESCRIPT PARA SUPABASE - HUBMEX MVP
 * Generado basado en: taskmaster/database.txt
 * 
 * Tablas:
 * - public.users
 * - public.listings
 * - public.messages
 * - public.v_listings_explore (vista)
 * 
 * Enums:
 * - user_type: 'proveedor' | 'comprador' | 'freelancer'
 * - listing_type: 'producto' | 'servicio'
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
      // ===================================================================
      // TABLA: users
      // Definición en database.txt líneas 31-45
      // ===================================================================
      users: {
        Row: {
          id: string;                                           // uuid primary key
          nombre: string | null;                                // text
          email: string | null;                                 // text
          tipo: 'proveedor' | 'comprador' | 'freelancer';      // user_type enum NOT NULL
          ubicacion: string | null;                             // text
          descripcion: string | null;                           // text
          avatar_url: string | null;                            // text
          telefono: string | null;                              // text
          website: string | null;                               // text
          created_at: string;                                   // timestamptz NOT NULL default now()
        };
        Insert: {
          id?: string;                                          // default gen_random_uuid()
          nombre?: string | null;
          email?: string | null;
          tipo: 'proveedor' | 'comprador' | 'freelancer';      // NOT NULL
          ubicacion?: string | null;
          descripcion?: string | null;
          avatar_url?: string | null;
          telefono?: string | null;
          website?: string | null;
          created_at?: string;                                  // default now()
        };
        Update: {
          id?: string;
          nombre?: string | null;
          email?: string | null;
          tipo?: 'proveedor' | 'comprador' | 'freelancer';
          ubicacion?: string | null;
          descripcion?: string | null;
          avatar_url?: string | null;
          telefono?: string | null;
          website?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ===================================================================
      // TABLA: listings
      // Definición en database.txt líneas 56-74
      // ===================================================================
      listings: {
        Row: {
          id: string;                                           // uuid primary key
          user_id: string;                                      // uuid NOT NULL references users(id)
          titulo: string;                                       // text NOT NULL
          descripcion: string | null;                           // text
          categoria: string | null;                             // text
          subcategoria: string | null;                          // text
          tipo: 'producto' | 'servicio';                       // listing_type enum NOT NULL
          precio: number | null;                                // numeric
          ubicacion: string | null;                             // text
          tiempo_entrega: string | null;                        // text
          capacidad: string | null;                             // text
          moq: string | null;                                   // text (Minimum Order Quantity)
          imagenes: string[] | null;                            // text[] (max 5)
          created_at: string;                                   // timestamptz NOT NULL default now()
          fts: unknown | null;                                  // tsvector generated column
        };
        Insert: {
          id?: string;                                          // default gen_random_uuid()
          user_id: string;                                      // NOT NULL
          titulo: string;                                       // NOT NULL
          descripcion?: string | null;
          categoria?: string | null;
          subcategoria?: string | null;
          tipo: 'producto' | 'servicio';                       // NOT NULL
          precio?: number | null;
          ubicacion?: string | null;
          tiempo_entrega?: string | null;
          capacidad?: string | null;
          moq?: string | null;
          imagenes?: string[] | null;                           // constraint: max 5 items
          created_at?: string;                                  // default now()
          fts?: never;                                          // generated column, can't insert
        };
        Update: {
          id?: string;
          user_id?: string;
          titulo?: string;
          descripcion?: string | null;
          categoria?: string | null;
          subcategoria?: string | null;
          tipo?: 'producto' | 'servicio';
          precio?: number | null;
          ubicacion?: string | null;
          tiempo_entrega?: string | null;
          capacidad?: string | null;
          moq?: string | null;
          imagenes?: string[] | null;
          created_at?: string;
          fts?: never;                                          // generated column, can't update
        };
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ===================================================================
      // TABLA: messages
      // Definición en database.txt líneas 93-99
      // ===================================================================
      messages: {
        Row: {
          id: string;                                           // uuid primary key
          sender_id: string;                                    // uuid NOT NULL references users(id)
          receiver_id: string;                                  // uuid NOT NULL references users(id)
          contenido: string;                                    // text NOT NULL
          created_at: string;                                   // timestamptz NOT NULL default now()
        };
        Insert: {
          id?: string;                                          // default gen_random_uuid()
          sender_id: string;                                    // NOT NULL
          receiver_id: string;                                  // NOT NULL
          contenido: string;                                    // NOT NULL
          created_at?: string;                                  // default now()
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          contenido?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    // =====================================================================
    // VISTA: v_listings_explore
    // Definición en database.txt líneas 109-125
    // =====================================================================
    Views: {
      v_listings_explore: {
        Row: {
          // Campos de listings
          id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string | null;
          tipo: 'producto' | 'servicio';
          precio: number | null;
          ubicacion: string | null;
          imagenes: string[] | null;
          created_at: string;
          // Campos de users (proveedor)
          proveedor_id: string;
          proveedor_nombre: string | null;
          proveedor_ubicacion: string | null;
          proveedor_avatar: string | null;
        };
        Insert: never;  // Views are not insertable
        Update: never;  // Views are not updatable
        Relationships: [];
      };
    };

    Functions: {
      // No hay funciones definidas en database.txt
    };

    Enums: {
      // ENUM: user_type (líneas 14-17)
      user_type: 'proveedor' | 'comprador' | 'freelancer';
      
      // ENUM: listing_type (líneas 20-23)
      listing_type: 'producto' | 'servicio';
    };

    CompositeTypes: {
      // No hay composite types definidos
    };
  };
}

// =========================================================================
// TIPOS HELPERS PARA USO EN LA APLICACIÓN
// =========================================================================

// Tipo para User Row
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// Tipo para Listing Row
export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingInsert = Database['public']['Tables']['listings']['Insert'];
export type ListingUpdate = Database['public']['Tables']['listings']['Update'];

// Tipo para Message Row
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

// Tipo para la vista v_listings_explore
export type ListingExploreView = Database['public']['Views']['v_listings_explore']['Row'];

// Tipo para user_type enum
export type UserType = Database['public']['Enums']['user_type'];

// Tipo para listing_type enum
export type ListingType = Database['public']['Enums']['listing_type'];

// =========================================================================
// VALIDACIÓN: Este archivo coincide 100% con taskmaster/database.txt
// Última sincronización: 2025-10-10
// =========================================================================

