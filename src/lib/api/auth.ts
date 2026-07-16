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
    // Usar el mismo ID de auth.users para sincronización
    const userProfile: UserInsert = {
      id: authData.user.id, // Usar el mismo ID de auth.users
      nombre: data.nombre,
      email: data.email,
      tipo: data.tipo,
      ubicacion: data.ubicacion,
      telefono: data.telefono || null,
      website: data.website || null,
      descripcion: data.descripcion || null,
      avatar_url: null, // Se sube después desde el dashboard
    };

    console.log('📝 Intentando crear perfil en public.users con ID:', authData.user.id);
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert(userProfile)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil en public.users:', {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint
      });
      
      // Intentar eliminar el usuario de auth si falló la creación del perfil
      // para evitar usuarios huérfanos (opcional, puede comentarse si no se quiere)
      try {
        // Nota: Esto requiere permisos especiales, puede no funcionar desde el cliente
        console.warn('⚠️ Usuario de auth creado pero perfil falló. Usuario ID:', authData.user.id);
      } catch (cleanupError) {
        console.error('❌ No se pudo limpiar usuario huérfano:', cleanupError);
      }
      
      // Retornar error descriptivo
      let errorMessage = 'Error al crear el perfil del usuario.';
      
      // Mensajes más específicos según el tipo de error
      if (profileError.code === '23505') {
        errorMessage = 'El email ya está registrado en el sistema.';
      } else if (profileError.code === '23503') {
        errorMessage = 'Error de referencia en la base de datos. Contacta al administrador.';
      } else if (profileError.code === '42501') {
        errorMessage = 'Error de permisos. Verifica la configuración de la base de datos.';
      } else if (profileError.message) {
        errorMessage = `Error al crear perfil: ${profileError.message}`;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Verificar que el perfil se creó exitosamente
    if (!profileData || !profileData.id) {
      console.error('❌ Perfil creado pero datos no retornados correctamente');
      return {
        success: false,
        error: 'Error: El perfil se creó pero no se pudo verificar. Por favor, intenta iniciar sesión.',
      };
    }

    console.log('✅ Usuario y perfil registrados exitosamente:', {
      email: authData.user.email,
      userId: authData.user.id,
      profileId: profileData.id
    });

    return {
      success: true,
      user: authData.user,
      profileId: profileData.id,
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
export async function getUserProfile(userId: string) {
  try {
    console.log('🔍 Buscando perfil para ID:', userId);
    
    // Primero buscar por ID
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      console.log('✅ Perfil encontrado por ID:', data);
      return data;
    }

    // Si no encuentra por ID, buscar por email del usuario autenticado
    console.log('🔍 No encontrado por ID, buscando por email...');
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
      console.error('❌ No hay usuario autenticado');
      return null;
    }

    if (userData.user.email) {
      const { data: emailData, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.user.email)
        .single();

      if (emailData) {
        console.log('✅ Perfil encontrado por email:', emailData);
        return emailData;
      }
    }

    // Si no existe el perfil pero el usuario está autenticado, intentar crearlo automáticamente
    console.warn('⚠️ Perfil no encontrado. Intentando crear perfil automáticamente...');
    
    if (userData.user.id === userId && userData.user.email) {
      // Obtener metadata del usuario de auth para crear el perfil
      const userMetadata = userData.user.user_metadata || {};
      
      // Crear perfil mínimo basado en metadata de auth
      const autoProfile: UserInsert = {
        id: userId,
        nombre: userMetadata.nombre || userMetadata.full_name || userData.user.email.split('@')[0],
        email: userData.user.email,
        tipo: userMetadata.tipo || 'comprador', // Default a comprador si no se especifica
        ubicacion: userMetadata.ubicacion || null,
        telefono: userMetadata.telefono || null,
        website: userMetadata.website || null,
        descripcion: userMetadata.descripcion || null,
        avatar_url: userMetadata.avatar_url || null,
      };

      console.log('📝 Creando perfil automáticamente:', autoProfile);
      
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert(autoProfile)
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creando perfil automáticamente:', {
          message: createError.message,
          code: createError.code,
          details: createError.details
        });
        return null;
      }

      if (newProfile) {
        console.log('✅ Perfil creado automáticamente:', newProfile);
        return newProfile;
      }
    }

    console.error('❌ Perfil no encontrado ni por ID ni por email, y no se pudo crear automáticamente');
    return null;
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


