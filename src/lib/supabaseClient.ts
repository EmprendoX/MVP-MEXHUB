/**
 * SUPABASE CLIENT - HUBMEX MVP
 * 
 * Cliente de Supabase configurado para HUBMEX.COM
 * Proporciona acceso a la base de datos, autenticación y storage.
 * 
 * Basado en:
 * - taskmaster/database.txt (esquema SQL)
 * - @/types/supabase.ts (tipos TypeScript)
 * - .env.local (credenciales)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// =========================================================================
// VALIDACIÓN DE VARIABLES DE ENTORNO
// =========================================================================

const envSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL ||
  '';

const envSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabaseUrl = envSupabaseUrl.trim() || undefined;
const supabaseAnonKey = envSupabaseAnonKey.trim() || undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cGxhY2Vob2xkZXI.uc2lnbmF0dXJl';

let hasLoggedMissingConfig = false;

if (!isSupabaseConfigured && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️ Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar la base de datos.'
  );
  hasLoggedMissingConfig = true;
}

// =========================================================================
// CLIENTE DE SUPABASE
// =========================================================================

/**
 * Cliente de Supabase tipado para HUBMEX
 * Usa los tipos generados desde database.txt
 */
export const supabase = createClient<Database>(
  supabaseUrl || PLACEHOLDER_SUPABASE_URL,
  supabaseAnonKey || PLACEHOLDER_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true, // Mantener sesión en localStorage
      autoRefreshToken: true, // Refrescar token automáticamente
      detectSessionInUrl: true, // Detectar sesión en URL (para magic links)
      storageKey: 'hubmex-auth-token', // Key personalizada para localStorage
    },
  }
);

export function logSupabaseMissingConfig(context?: string) {
  if (isSupabaseConfigured) {
    return;
  }

  if (!hasLoggedMissingConfig) {
    console.warn(
      '⚠️ Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar la base de datos.'
    );
    hasLoggedMissingConfig = true;
  }

  if (context) {
    console.warn(`⚠️ Operación omitida por falta de configuración Supabase (${context}).`);
  }
}

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Obtener el usuario actualmente autenticado
 * @returns Usuario de Supabase Auth o null si no hay sesión
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Error obteniendo usuario:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('❌ Error inesperado en getCurrentUser:', err);
    return null;
  }
};

/**
 * Obtener la sesión actual
 * @returns Sesión activa o null
 */
export const getSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Error obteniendo sesión:', error.message);
      return null;
    }

    return session;
  } catch (err) {
    console.error('❌ Error inesperado en getSession:', err);
    return null;
  }
};

/**
 * Verificar si hay un usuario autenticado
 * @returns true si hay sesión activa, false si no
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return session !== null;
};

/**
 * Cerrar sesión del usuario actual
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error al cerrar sesión:', error.message);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('❌ Error inesperado en signOut:', err);
    return { success: false, error: err };
  }
};

// =========================================================================
// EXPORTS
// =========================================================================

// Export tipos para uso en otros archivos
export type { Database } from '@/types/supabase';
export type {
  User,
  UserInsert,
  UserUpdate,
  Listing,
  ListingInsert,
  ListingUpdate,
  Message,
  MessageInsert,
  MessageUpdate,
  ListingExploreView,
  UserType,
  ListingType,
} from '@/types/supabase';

// =========================================================================
// NOTAS DE USO
// =========================================================================

/**
 * EJEMPLOS DE USO:
 * 
 * // 1. Query básico de users
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 *   .eq('tipo', 'proveedor');
 * 
 * // 2. Insert de listing
 * const { data, error } = await supabase
 *   .from('listings')
 *   .insert({
 *     user_id: userId,
 *     titulo: 'Maquinaria CNC',
 *     tipo: 'producto',
 *     categoria: 'Maquinaria Industrial'
 *   });
 * 
 * // 3. Query con vista v_listings_explore
 * const { data, error } = await supabase
 *   .from('v_listings_explore')
 *   .select('*')
 *   .limit(10);
 * 
 * // 4. Búsqueda Full-Text
 * const { data, error } = await supabase
 *   .from('listings')
 *   .select('*')
 *   .textSearch('fts', 'maquinaria');
 * 
 * // 5. Obtener usuario actual
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('Usuario autenticado:', user.email);
 * }
 */


