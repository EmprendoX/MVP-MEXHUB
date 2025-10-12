/**
 * HOOK DE AUTENTICACIÓN - HUBMEX MVP
 * 
 * Custom hook para manejar autenticación con Supabase
 * Proporciona acceso al contexto de autenticación global
 * 
 * Basado en:
 * - src/contexts/AuthContext.tsx (contexto global)
 * - src/lib/api/auth.ts (funciones de API)
 */

'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook para acceder al estado de autenticación
 * 
 * @returns Objeto con usuario, perfil, loading y funciones de auth
 * @throws Error si se usa fuera del AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, userProfile, loading, signIn, signUp, signOut } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth debe usarse dentro de AuthProvider. ' +
      'Asegúrate de que el componente esté envuelto en <AuthProvider>.'
    );
  }
  
  return context;
}

// Export del tipo para uso en otros archivos
export type { AuthContextType } from '@/contexts/AuthContext';
