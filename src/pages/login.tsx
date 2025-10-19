/**
 * PÁGINA DE LOGIN - HUBMEX MVP
 * 
 * Permite a los usuarios iniciar sesión en la plataforma
 */

'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/forms/LoginForm';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn(data.email, data.password);

      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión');
      }
      // Si success, el AuthContext ya redirige a /dashboard
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-soft">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // No mostrar el form si ya está autenticado (está redirigiendo)
  if (user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión - HUBMEX</title>
        <meta name="description" content="Inicia sesión en HUBMEX para acceder a tu cuenta" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="text-4xl font-bold text-gradient mb-2">
                HUBMEX
              </div>
            </Link>
            <p className="text-text-soft">
              Conectando fabricantes mexicanos con el mundo
            </p>
          </div>

          {/* Card con el formulario */}
          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-alert bg-opacity-20 border border-alert rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-alert mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-alert text-sm">{error}</span>
                </div>
              </div>
            )}

            <LoginForm onSubmit={handleLogin} loading={isSubmitting} />
          </div>

          {/* Links adicionales */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-text-soft hover:text-primary transition-colors text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}








