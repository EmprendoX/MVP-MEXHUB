/**
 * API DE AUTENTICACIÓN - HUBMEX MVP
 * 
 * Funciones para manejar autenticación con Supabase Auth
 * y sincronización con la tabla public.users
 * 
 * Basado en:
 * - taskmaster/database.txt (tabla users líneas 31-45)
 * - Supabase Auth documentation
 */

import { supabase } from '@/lib/supabaseClient';
import type { UserInsert, UserType } from '@/types/supabase';

// =========================================================================
// INTERFACES
// =========================================================================

export interface SignUpData {
  email: string;
  password: string;
  nombre: string;
  tipo: UserType;
  ubicacion: string;
  telefono?: string;
  website?: string;
  descripcion?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
  profileId?: string;
}

// =========================================================================
// FUNCIONES DE AUTENTICACIÓN
// =========================================================================

/**
 * Registrar nuevo usuario
 * 
 * Proceso:
 * 1. Crear cuenta en Supabase Auth (auth.users)
 * 2. Crear perfil en public.users con el mismo ID
 * 
 * @param data Datos del registro
 * @returns Resultado de la operación
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    // PASO 1: Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nombre: data.nombre,
          tipo: data.tipo,
        },
      },
    });

    if (authError) {
      console.error('❌ Error en Auth signUp:', authError.message);
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'No se pudo crear el usuario',
      };
    }

    // PASO 2: Crear perfil en public.users
    // El id se genera automáticamente por gen_random_uuid() según database.txt
    const userProfile: UserInsert = {
      nombre: data.nombre,
      email: data.email,
      tipo: data.tipo,
      ubicacion: data.ubicacion,
      telefono: data.telefono || null,
      website: data.website || null,
      descripcion: data.descripcion || null,
      avatar_url: null, // Se sube después desde el dashboard
    };

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert(userProfile)
      .select()
      .single();

    const profileId = profileData?.id;

    if (profileError) {
      console.error('❌ Error creando perfil en public.users:', profileError.message);
      
      return {
        success: false,
        error: 'Error al crear el perfil. Por favor, intenta de nuevo.',
      };
    }

    console.log('✅ Usuario registrado exitosamente:', authData.user.email);

    return {
      success: true,
      user: authData.user,
      profileId: profileId, // Nuevo campo
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en signUp:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al registrar',
    };
  }
}

/**
 * Iniciar sesión
 * 
 * @param data Email y contraseña
 * @returns Resultado de la operación
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('❌ Error en signIn:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Login exitoso:', authData.user?.email);

    return {
      success: true,
      user: authData.user,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en signIn:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al iniciar sesión',
    };
  }
}

/**
 * Cerrar sesión
 * 
 * @returns Resultado de la operación
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Error en signOut:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Sesión cerrada exitosamente');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en signOut:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al cerrar sesión',
    };
  }
}

/**
 * Recuperar contraseña
 * 
 * @param email Email del usuario
 * @returns Resultado de la operación
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('❌ Error en resetPassword:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Email de recuperación enviado a:', email);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en resetPassword:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al recuperar contraseña',
    };
  }
}

/**
 * Actualizar perfil de usuario
 * 
 * Solo actualiza campos de public.users, NO de auth.users
 * 
 * @param userId ID del usuario
 * @param data Datos a actualizar
 * @returns Resultado de la operación
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<{
    nombre: string;
    tipo: UserType;
    ubicacion: string;
    descripcion: string;
    avatar_url: string;
    telefono: string;
    website: string;
  }>
): Promise<AuthResponse> {
  try {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId);

    if (error) {
      console.error('❌ Error actualizando perfil:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Perfil actualizado exitosamente');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en updateUserProfile:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al actualizar perfil',
    };
  }
}

/**
 * Obtener perfil de usuario desde public.users
 * 
 * @param userId ID del usuario
 * @returns Perfil del usuario o null
 */
export async function getUserProfile(userEmail: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (error) {
      console.error('❌ Error obteniendo perfil:', error.message);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error('❌ Error inesperado en getUserProfile:', error);
    return null;
  }
}

// =========================================================================
// EXPORTS
// =========================================================================

export default {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updateUserProfile,
  getUserProfile,
};


