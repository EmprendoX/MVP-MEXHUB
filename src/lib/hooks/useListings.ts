/**
 * HOOK DE LISTINGS - HUBMEX MVP
 * 
 * Custom hook para manejar publicaciones (productos/servicios)
 * Proporciona CRUD completo y filtros
 * 
 * Basado en:
 * - taskmaster/database.txt (tabla listings)
 * - src/lib/api/listings.ts (funciones CRUD)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import * as listingsApi from '@/lib/api/listings';
import type { Listing, ListingType } from '@/types/supabase';

// =========================================================================
// INTERFACES
// =========================================================================

export interface UseListingsOptions {
  userId?: string;                // Filtrar por usuario específico
  tipo?: ListingType | ListingType[];
  categoria?: string | string[];
  ubicacion?: string | string[];
  priceMin?: number;
  priceMax?: number;
  searchQuery?: string;
  autoFetch?: boolean;            // Cargar automáticamente al montar (default: true)
  limit?: number;                 // Límite de resultados (default: 50)
}

export interface UseListingsReturn {
  // Estado
  listings: Listing[];
  loading: boolean;
  error: string | null;
  count: number;
  
  // Funciones CRUD
  createListing: (data: listingsApi.CreateListingData) => Promise<listingsApi.ApiResponse<Listing>>;
  updateListing: (id: string, data: listingsApi.UpdateListingData) => Promise<listingsApi.ApiResponse<Listing>>;
  deleteListing: (id: string) => Promise<listingsApi.ApiResponse>;
  refreshListings: () => Promise<void>;
  
  // Funciones de búsqueda
  searchListings: (query: string) => Promise<void>;
  
  // Upload de imágenes
  uploadImage: (file: File) => Promise<listingsApi.ApiResponse<string>>;
}

// =========================================================================
// HOOK
// =========================================================================

/**
 * Hook para manejar listings con filtros y CRUD
 * 
 * @param options Opciones de filtros y configuración
 * @returns Estado y funciones para manejar listings
 */
export function useListings(options: UseListingsOptions = {}): UseListingsReturn {
  const {
    userId,
    tipo,
    categoria,
    ubicacion,
    priceMin,
    priceMax,
    searchQuery: initialSearchQuery,
    autoFetch = true,
    limit = 50,
  } = options;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  /**
   * Cargar listings con filtros
   */
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result;

      // Si hay userId específico, obtener solo sus listings
      if (userId) {
        result = await listingsApi.getUserListings(userId);
      } else {
        // Caso general: obtener con filtros
        const filters: listingsApi.ListingFilters = {
          tipo,
          categoria,
          ubicacion,
          priceMin,
          priceMax,
          searchQuery,
        };

        result = await listingsApi.getListings(filters, limit);
      }

      if (result.success) {
        setListings(result.data || []);
        
        // También obtener el count
        const countResult = await listingsApi.countListings({
          tipo,
          categoria,
          ubicacion,
          priceMin,
          priceMax,
          searchQuery,
        });
        
        if (countResult.success) {
          setCount(countResult.data || 0);
        }
      } else {
        setError(result.error || 'Error al cargar publicaciones');
        setListings([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [userId, tipo, categoria, ubicacion, priceMin, priceMax, searchQuery, limit]);

  /**
   * Cargar automáticamente al montar o cuando cambien los filtros
   */
  useEffect(() => {
    if (autoFetch) {
      fetchListings();
    }
  }, [autoFetch, fetchListings]);

  /**
   * Crear nueva publicación
   */
  const createListing = async (
    data: listingsApi.CreateListingData
  ): Promise<listingsApi.ApiResponse<Listing>> => {
    if (!userId) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    setLoading(true);
    const result = await listingsApi.createListing(userId, data);
    setLoading(false);

    if (result.success) {
      // Refrescar lista después de crear
      await fetchListings();
    }

    return result;
  };

  /**
   * Actualizar publicación existente
   */
  const updateListing = async (
    id: string,
    data: listingsApi.UpdateListingData
  ): Promise<listingsApi.ApiResponse<Listing>> => {
    if (!userId) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    setLoading(true);
    const result = await listingsApi.updateListing(id, userId, data);
    setLoading(false);

    if (result.success) {
      // Refrescar lista después de actualizar
      await fetchListings();
    }

    return result;
  };

  /**
   * Eliminar publicación
   */
  const deleteListing = async (id: string): Promise<listingsApi.ApiResponse> => {
    if (!userId) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    setLoading(true);
    const result = await listingsApi.deleteListing(id, userId);
    setLoading(false);

    if (result.success) {
      // Refrescar lista después de eliminar
      await fetchListings();
    }

    return result;
  };

  /**
   * Buscar publicaciones
   */
  const searchListingsHandler = async (query: string) => {
    setSearchQuery(query);
    // El useEffect se encargará de refrescar con el nuevo query
  };

  /**
   * Refrescar listings manualmente
   */
  const refreshListings = async () => {
    await fetchListings();
  };

  /**
   * Subir imagen
   */
  const uploadImage = async (file: File): Promise<listingsApi.ApiResponse<string>> => {
    if (!userId) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    return await listingsApi.uploadListingImage(file, userId);
  };

  return {
    listings,
    loading,
    error,
    count,
    createListing,
    updateListing,
    deleteListing,
    refreshListings,
    searchListings: searchListingsHandler,
    uploadImage,
  };
}

export default useListings;


