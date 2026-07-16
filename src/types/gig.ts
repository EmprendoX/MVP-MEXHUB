/**
 * Tipos del dominio "Gig" (estilo Fiverr) para el frontend.
 * Diseñados para mapear 1:1 con las tablas futuras en Supabase:
 *   - listings (+ campo `paquetes jsonb`)
 *   - users (seller)
 *   - reviews
 *   - orders
 *
 * Cuando conectemos Supabase, el shape queda igual: solo cambia
 * la fuente en `src/lib/mock/gigs.ts` por una llamada a la API.
 */

export type PackageTier = 'basico' | 'estandar' | 'premium';

export interface GigPackage {
  tier: PackageTier;
  nombre: string;
  descripcion: string;
  precio: number;
  dias_entrega: number;
  revisiones: number | 'ilimitadas';
  features: string[];
}

export interface GigFaq {
  pregunta: string;
  respuesta: string;
}

export interface GigReview {
  id: string;
  autor_nombre: string;
  autor_avatar?: string;
  autor_pais?: string;
  rating: number;
  comentario: string;
  fecha: string;
  paquete?: PackageTier;
}

export interface GigSeller {
  id: string;
  nombre: string;
  avatar_url?: string;
  ubicacion: string;
  nivel: 'nuevo' | 'nivel_1' | 'nivel_2' | 'top_rated';
  rating: number;
  total_reviews: number;
  idiomas: string[];
  responde_en: string;
  ultima_entrega?: string;
  miembro_desde: string;
  descripcion?: string;
}

export interface Gig {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  tags: string[];
  imagenes: string[];
  video_url?: string;
  paquetes: {
    basico: GigPackage;
    estandar: GigPackage;
    premium: GigPackage;
  };
  faq: GigFaq[];
  reviews: GigReview[];
  seller: GigSeller;
  rating: number;
  total_reviews: number;
  total_ordenes: number;
  precio_desde: number;
  dias_entrega_min: number;
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'in_revision';

export interface OrderTimelineEvent {
  estado: OrderStatus | 'created' | 'message' | 'review';
  fecha: string;
  titulo: string;
  descripcion?: string;
}

export interface Order {
  id: string;
  gig_id: string;
  gig_titulo: string;
  gig_imagen: string;
  buyer_id: string;
  buyer_nombre: string;
  buyer_avatar?: string;
  seller_id: string;
  seller_nombre: string;
  seller_avatar?: string;
  paquete: PackageTier;
  precio: number;
  estado: OrderStatus;
  fecha_creacion: string;
  fecha_entrega_estimada: string;
  requerimientos?: string;
  timeline: OrderTimelineEvent[];
}
