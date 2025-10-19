/**
 * API DE LISTINGS (PUBLICACIONES) - HUBMEX MVP
 * 
 * CRUD completo para productos y servicios
 * 
 * Basado en:
 * - taskmaster/database.txt (tabla listings líneas 56-74)
 * - Campos: id, user_id, titulo, descripcion, categoria, subcategoria,
 *           tipo, precio, ubicacion, tiempo_entrega, capacidad, moq, imagenes
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type {
  ListingInsert,
  ListingUpdate,
  Listing,
  ListingType,
  ListingExploreView,
} from '@/types/supabase';

// =========================================================================
// INTERFACES
// =========================================================================

export interface CreateListingData {
  titulo: string;
  descripcion?: string;
  tipo: ListingType;
  categoria?: string;
  subcategoria?: string;
  precio?: number;
  ubicacion?: string;
  tiempo_entrega?: string;
  capacidad?: string;
  moq?: string;
  imagenes?: string[];
}

export interface UpdateListingData {
  titulo?: string;
  descripcion?: string;
  tipo?: ListingType;
  categoria?: string;
  subcategoria?: string;
  precio?: number;
  ubicacion?: string;
  tiempo_entrega?: string;
  capacidad?: string;
  moq?: string;
  imagenes?: string[];
}

export interface ListingFilters {
  tipo?: ListingType | ListingType[];
  categoria?: string | string[];
  ubicacion?: string | string[];
  priceMin?: number;
  priceMax?: number;
  searchQuery?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const SUPABASE_CONFIG_ERROR =
  'Supabase no está configurado. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.';

function ensureSupabaseConfigured<T>(): ApiResponse<T> | null {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: SUPABASE_CONFIG_ERROR,
    };
  }

  return null;
}

// =========================================================================
// FORMATO PARA CARD ITEM
// =========================================================================

export interface CardItemListing {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tipo: ListingType;
  precio?: number;
  ubicacion: string;
  imagenes: string[];
  proveedor: {
    id: string;
    nombre: string;
    avatar_url?: string;
  };
  created_at: string;
}

export function formatListingForCardItem(listing: ListingExploreView): CardItemListing {
  return {
    id: listing.id,
    titulo: listing.titulo,
    descripcion: listing.descripcion || '',
    categoria: listing.categoria || 'Sin categoría',
    tipo: listing.tipo,
    precio: listing.precio ?? undefined,
    ubicacion: listing.ubicacion || listing.proveedor_ubicacion || '',
    imagenes: listing.imagenes || [],
    proveedor: {
      id: listing.proveedor_id,
      nombre: listing.proveedor_nombre || 'Proveedor',
      avatar_url: listing.proveedor_avatar || undefined,
    },
    created_at: listing.created_at,
  };
}

// =========================================================================
// FUNCIONES CRUD
// =========================================================================

/**
 * Crear nueva publicación
 * 
 * Campos según database.txt líneas 56-74
 * 
 * @param userId ID del usuario dueño
 * @param data Datos de la publicación
 * @returns Resultado con la publicación creada
 */
export async function createListing(
  userId: string,
  data: CreateListingData
): Promise<ApiResponse<Listing>> {
  const configError = ensureSupabaseConfigured<Listing>();
  if (configError) {
    return configError;
  }

  try {
    // Validar que el título no esté vacío (NOT NULL en BD)
    if (!data.titulo || !data.titulo.trim()) {
      return {
        success: false,
        error: 'El título es obligatorio',
      };
    }

    // Validar tipo (NOT NULL en BD)
    if (!data.tipo) {
      return {
        success: false,
        error: 'El tipo (producto/servicio) es obligatorio',
      };
    }

    // Validar máximo 5 imágenes (constraint en BD)
    if (data.imagenes && data.imagenes.length > 5) {
      return {
        success: false,
        error: 'Máximo 5 imágenes permitidas',
      };
    }

    // Preparar datos para insertar (coincide exactamente con database.txt)
    const listingData: ListingInsert = {
      user_id: userId,
      titulo: data.titulo.trim(),
      descripcion: data.descripcion?.trim() || null,
      categoria: data.categoria || null,
      subcategoria: data.subcategoria || null,
      tipo: data.tipo,
      precio: data.precio || null,
      ubicacion: data.ubicacion || null,
      tiempo_entrega: data.tiempo_entrega || null,
      capacidad: data.capacidad || null,
      moq: data.moq || null,
      imagenes: data.imagenes || null,
    };

    const { data: listing, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando listing:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Listing creado exitosamente:', listing.id);

    return {
      success: true,
      data: listing,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en createListing:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al crear publicación',
    };
  }
}

/**
 * Obtener todas las publicaciones con filtros opcionales
 * 
 * @param filters Filtros opcionales
 * @param limit Límite de resultados (default: 50)
 * @param offset Offset para paginación (default: 0)
 * @returns Lista de publicaciones
 */
export async function getListings(
  filters?: ListingFilters,
  limit: number = 50,
  offset: number = 0
): Promise<ApiResponse<Listing[]>> {
  const configError = ensureSupabaseConfigured<Listing[]>();
  if (configError) {
    return configError;
  }

  try {
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters) {
      // Filtro por tipo
      if (filters.tipo) {
        if (Array.isArray(filters.tipo)) {
          query = query.in('tipo', filters.tipo);
        } else {
          query = query.eq('tipo', filters.tipo);
        }
      }

      // Filtro por categoría
      if (filters.categoria) {
        if (Array.isArray(filters.categoria)) {
          query = query.in('categoria', filters.categoria);
        } else {
          query = query.eq('categoria', filters.categoria);
        }
      }

      // Filtro por ubicación
      if (filters.ubicacion) {
        if (Array.isArray(filters.ubicacion)) {
          // Buscar si la ubicación contiene alguno de los valores
          const orConditions = filters.ubicacion
            .map(loc => `ubicacion.ilike.%${loc}%`)
            .join(',');
          query = query.or(orConditions);
        } else {
          query = query.ilike('ubicacion', `%${filters.ubicacion}%`);
        }
      }

      // Filtro por rango de precio
      if (filters.priceMin !== undefined) {
        query = query.gte('precio', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('precio', filters.priceMax);
      }

      // Búsqueda full-text (usa la columna fts generada)
      if (filters.searchQuery && filters.searchQuery.trim()) {
        query = query.textSearch('fts', filters.searchQuery.trim(), {
          type: 'plain',
          config: 'spanish',
        });
      }
    }

    // Aplicar limit y offset para paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo listings:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getListings:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al obtener publicaciones',
    };
  }
}

/**
 * Obtener publicaciones usando la vista v_listings_explore
 * Esta vista ya incluye datos del proveedor (JOIN con users)
 * 
 * @param filters Filtros opcionales
 * @param limit Límite de resultados
 * @param offset Offset para paginación
 * @returns Lista de publicaciones con datos del proveedor
 */
export async function getListingsWithProvider(
  filters?: ListingFilters,
  limit: number = 50,
  offset: number = 0
): Promise<ApiResponse<ListingExploreView[]>> {
  const configError = ensureSupabaseConfigured<ListingExploreView[]>();
  if (configError) {
    return configError;
  }

  try {
    let query = supabase
      .from('v_listings_explore')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar los mismos filtros que getListings
    if (filters) {
      if (filters.tipo) {
        if (Array.isArray(filters.tipo)) {
          query = query.in('tipo', filters.tipo);
        } else {
          query = query.eq('tipo', filters.tipo);
        }
      }

      if (filters.categoria) {
        if (Array.isArray(filters.categoria)) {
          query = query.in('categoria', filters.categoria);
        } else {
          query = query.eq('categoria', filters.categoria);
        }
      }

      if (filters.ubicacion) {
        if (Array.isArray(filters.ubicacion)) {
          const orConditions = filters.ubicacion
            .map(loc => `ubicacion.ilike.%${loc}%`)
            .join(',');
          query = query.or(orConditions);
        } else {
          query = query.ilike('ubicacion', `%${filters.ubicacion}%`);
        }
      }

      if (filters.priceMin !== undefined) {
        query = query.gte('precio', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('precio', filters.priceMax);
      }

      // Full-Text Search en español
      if (filters.searchQuery && filters.searchQuery.trim()) {
        query = query.textSearch('fts', filters.searchQuery.trim(), {
          type: 'plain',
          config: 'spanish',
        });
      }
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo listings con proveedor:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data as ListingExploreView[]) || [],
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getListingsWithProvider:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
    };
  }
}

/**
 * Obtener publicaciones destacadas y formatearlas para CardItem
 * Actualmente utiliza los listados más recientes como destacados
 *
 * @param limit Número de elementos destacados a obtener
 * @returns Lista formateada lista para CardItem
 */
export async function getFeaturedListingsForCards(
  limit: number = 6
): Promise<ApiResponse<CardItemListing[]>> {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no está configurado. Retornando destacados vacíos.');
    return {
      success: true,
      data: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from('v_listings_explore')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error obteniendo productos destacados:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    const formatted = ((data as ListingExploreView[]) || []).map(formatListingForCardItem);

    return {
      success: true,
      data: formatted,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getFeaturedListingsForCards:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al obtener destacados',
    };
  }
}

/**
 * Obtener una publicación por ID
 * 
 * @param id ID de la publicación
 * @returns Publicación encontrada o null
 */
export async function getListingById(id: string): Promise<ApiResponse<Listing>> {
  const configError = ensureSupabaseConfigured<Listing>();
  if (configError) {
    return configError;
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error obteniendo listing:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getListingById:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
    };
  }
}

/**
 * Obtener publicaciones de un usuario específico
 * 
 * @param userId ID del usuario
 * @returns Lista de publicaciones del usuario
 */
export async function getUserListings(userId: string): Promise<ApiResponse<Listing[]>> {
  const configError = ensureSupabaseConfigured<Listing[]>();
  if (configError) {
    return configError;
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo listings del usuario:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getUserListings:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
    };
  }
}

/**
 * Actualizar una publicación
 * 
 * Solo el dueño puede actualizar (validado por RLS cuando se active)
 * 
 * @param id ID de la publicación
 * @param userId ID del usuario (para verificar ownership)
 * @param data Datos a actualizar
 * @returns Publicación actualizada
 */
export async function updateListing(
  id: string,
  userId: string,
  data: UpdateListingData
): Promise<ApiResponse<Listing>> {
  const configError = ensureSupabaseConfigured<Listing>();
  if (configError) {
    return configError;
  }

  try {
    // Validar máximo 5 imágenes si se están actualizando
    if (data.imagenes && data.imagenes.length > 5) {
      return {
        success: false,
        error: 'Máximo 5 imágenes permitidas',
      };
    }

    // Preparar datos para actualizar (solo campos que existen en database.txt)
    const updateData: ListingUpdate = {};
    
    if (data.titulo !== undefined) updateData.titulo = data.titulo.trim();
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion?.trim() || null;
    if (data.categoria !== undefined) updateData.categoria = data.categoria || null;
    if (data.subcategoria !== undefined) updateData.subcategoria = data.subcategoria || null;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.precio !== undefined) updateData.precio = data.precio || null;
    if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion || null;
    if (data.tiempo_entrega !== undefined) updateData.tiempo_entrega = data.tiempo_entrega || null;
    if (data.capacidad !== undefined) updateData.capacidad = data.capacidad || null;
    if (data.moq !== undefined) updateData.moq = data.moq || null;
    if (data.imagenes !== undefined) updateData.imagenes = data.imagenes || null;

    const { data: listing, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId) // Solo el dueño puede actualizar
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando listing:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!listing) {
      return {
        success: false,
        error: 'Publicación no encontrada o no tienes permiso para editarla',
      };
    }

    console.log('✅ Listing actualizado exitosamente:', listing.id);

    return {
      success: true,
      data: listing,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en updateListing:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al actualizar publicación',
    };
  }
}

/**
 * Eliminar una publicación
 * 
 * Solo el dueño puede eliminar (validado por RLS cuando se active)
 * 
 * @param id ID de la publicación
 * @param userId ID del usuario (para verificar ownership)
 * @returns Resultado de la operación
 */
export async function deleteListing(
  id: string,
  userId: string
): Promise<ApiResponse> {
  const configError = ensureSupabaseConfigured();
  if (configError) {
    return configError;
  }

  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Solo el dueño puede eliminar

    if (error) {
      console.error('❌ Error eliminando listing:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Listing eliminado exitosamente:', id);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en deleteListing:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al eliminar publicación',
    };
  }
}

/**
 * Buscar publicaciones por texto completo
 * Usa la columna fts (Full-Text Search) de database.txt líneas 81-89
 * 
 * @param searchQuery Texto a buscar
 * @param limit Límite de resultados
 * @returns Lista de publicaciones que coinciden
 */
export async function searchListings(
  searchQuery: string,
  limit: number = 50
): Promise<ApiResponse<Listing[]>> {
  const configError = ensureSupabaseConfigured<Listing[]>();
  if (configError) {
    return configError;
  }

  try {
    if (!searchQuery || !searchQuery.trim()) {
      return {
        success: true,
        data: [],
      };
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .textSearch('fts', searchQuery.trim(), {
        type: 'plain',
        config: 'spanish',
      })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error buscando listings:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en searchListings:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado en búsqueda',
    };
  }
}

/**
 * Contar total de publicaciones (con filtros opcionales)
 * 
 * @param filters Filtros opcionales
 * @returns Cantidad de publicaciones
 */
export async function countListings(
  filters?: ListingFilters
): Promise<ApiResponse<number>> {
  const configError = ensureSupabaseConfigured<number>();
  if (configError) {
    return configError;
  }

  try {
    let query = supabase
      .from('listings')
      .select('id', { count: 'exact', head: true });

    // Aplicar filtros (mismo que getListings)
    if (filters) {
      if (filters.tipo) {
        if (Array.isArray(filters.tipo)) {
          query = query.in('tipo', filters.tipo);
        } else {
          query = query.eq('tipo', filters.tipo);
        }
      }

      if (filters.categoria) {
        if (Array.isArray(filters.categoria)) {
          query = query.in('categoria', filters.categoria);
        } else {
          query = query.eq('categoria', filters.categoria);
        }
      }

      if (filters.ubicacion) {
        if (Array.isArray(filters.ubicacion)) {
          const orConditions = filters.ubicacion
            .map(loc => `ubicacion.ilike.%${loc}%`)
            .join(',');
          query = query.or(orConditions);
        } else {
          query = query.ilike('ubicacion', `%${filters.ubicacion}%`);
        }
      }

      if (filters.priceMin !== undefined) {
        query = query.gte('precio', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('precio', filters.priceMax);
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        query = query.textSearch('fts', filters.searchQuery.trim(), {
          type: 'plain',
          config: 'spanish',
        });
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('❌ Error contando listings:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: count || 0,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en countListings:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
    };
  }
}

// =========================================================================
// FUNCIONES DE STORAGE (para imágenes)
// =========================================================================

/**
 * Subir imagen a Supabase Storage
 * 
 * @param file Archivo de imagen
 * @param userId ID del usuario (para organizar en carpetas)
 * @returns URL pública de la imagen subida
 */
export async function uploadListingImage(
  file: File,
  userId: string
): Promise<ApiResponse<string>> {
  const configError = ensureSupabaseConfigured<string>();
  if (configError) {
    return configError;
  }

  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen',
      };
    }

    // Validar tamaño (máx 5MB según PRD)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'La imagen no debe superar 5MB',
      };
    }

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}-${randomString}.${fileExt}`;

    // Subir a bucket 'listings'
    const { data, error } = await supabase.storage
      .from('listings')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Error subiendo imagen:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('listings')
      .getPublicUrl(fileName);

    console.log('✅ Imagen subida exitosamente:', publicUrlData.publicUrl);

    return {
      success: true,
      data: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en uploadListingImage:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al subir imagen',
    };
  }
}

/**
 * Eliminar imagen de Supabase Storage
 * 
 * @param imageUrl URL de la imagen a eliminar
 * @returns Resultado de la operación
 */
export async function deleteListingImage(imageUrl: string): Promise<ApiResponse> {
  const configError = ensureSupabaseConfigured();
  if (configError) {
    return configError;
  }

  try {
    // Extraer el path del archivo desde la URL
    const urlParts = imageUrl.split('/listings/');
    if (urlParts.length < 2) {
      return {
        success: false,
        error: 'URL de imagen inválida',
      };
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('listings')
      .remove([filePath]);

    if (error) {
      console.error('❌ Error eliminando imagen:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Imagen eliminada exitosamente');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en deleteListingImage:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al eliminar imagen',
    };
  }
}

// =========================================================================
// EXPORTS
// =========================================================================

export default {
  createListing,
  getListings,
  getListingsWithProvider,
  getFeaturedListingsForCards,
  getListingById,
  getUserListings,
  updateListing,
  deleteListing,
  searchListings,
  countListings,
  uploadListingImage,
  deleteListingImage,
  formatListingForCardItem,
};


