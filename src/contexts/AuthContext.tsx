/**
 * CONTEXTO DE AUTENTICACIÓN - HUBMEX MVP
 * 
 * Contexto global para manejar el estado de autenticación
 * Proporciona acceso al usuario, perfil y funciones de auth en toda la app
 * 
 * Basado en:
 * - src/lib/api/auth.ts (funciones de API)
 * - src/types/supabase.ts (tipos de usuario)
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import * as authApi from '@/lib/api/auth';
import type { User } from '@supabase/supabase-js';
import type { User as UserProfile } from '@/types/supabase';
import type { SignUpData, SignInData } from '@/lib/api/auth';

// =========================================================================
// INTERFACES
// =========================================================================

export interface AuthContextType {
  // Estado
  user: User | null;
  userProfile: UserProfile | null;
  userProfileId: string | undefined;
  loading: boolean;
  
  // Funciones de autenticación
  signIn: (email: string, password: string) => Promise<authApi.AuthResponse>;
  signUp: (data: SignUpData) => Promise<authApi.AuthResponse>;
  signOut: () => Promise<authApi.AuthResponse>;
  
  // Funciones de perfil
  refreshUserProfile: () => Promise<void>;
}

// =========================================================================
// CONTEXTO
// =========================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================================================================
// PROVIDER
// =========================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // =======================================================================
  // FUNCIONES DE AUTENTICACIÓN
  // =======================================================================

  /**
   * Iniciar sesión
   */
  const signIn = async (email: string, password: string): Promise<authApi.AuthResponse> => {
    const result = await authApi.signIn({ email, password });
    
    if (result.success) {
      setUser(result.user);
      // El listener de auth detectará el cambio y cargará el perfil
    }
    
    return result;
  };

  /**
   * Registrar nuevo usuario
   */
  const signUp = async (data: SignUpData): Promise<authApi.AuthResponse> => {
    const result = await authApi.signUp(data);
    
    if (result.success) {
      setUser(result.user);
      // El listener de auth detectará el cambio y cargará el perfil
    }
    
    return result;
  };

  /**
   * Cerrar sesión
   */
  const signOut = async (): Promise<authApi.AuthResponse> => {
    const result = await authApi.signOut();
    
    if (result.success) {
      setUser(null);
      setUserProfile(null);
    }
    
    return result;
  };

  /**
   * Refrescar perfil de usuario desde la base de datos
   */
  const refreshUserProfile = async (): Promise<void> => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await authApi.getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refrescando perfil:', error);
      setUserProfile(null);
    }
  };

  // =======================================================================
  // LISTENER DE AUTENTICACIÓN
  // =======================================================================

  useEffect(() => {
    let mounted = true;

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Cargar perfil si hay usuario
            const profile = await authApi.getUserProfile(session.user.id);
            setUserProfile(profile);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error obteniendo sesión inicial:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        setUser(session?.user ?? null);

        if (session?.user) {
          // Cargar perfil cuando hay un usuario
          try {
            const profile = await authApi.getUserProfile(session.user.email || '');
            setUserProfile(profile);
          } catch (error) {
            console.error('Error cargando perfil:', error);
            setUserProfile(null);
          }
        } else {
          // Limpiar perfil cuando no hay usuario
          setUserProfile(null);
        }

        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  // =======================================================================
  // VALOR DEL CONTEXTO
  // =======================================================================

  const value: AuthContextType = {
    user,
    userProfile,
    userProfileId: userProfile?.id, // Nuevo campo
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================================
// EXPORTS
// =========================================================================

export { AuthContext };
