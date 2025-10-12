/**
 * PÁGINA DE REGISTRO - HUBMEX MVP
 * 
 * Permite a nuevos usuarios crear una cuenta en la plataforma
 * Campos basados en: taskmaster/database.txt (tabla users)
 */

'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import RegisterForm from '@/components/forms/RegisterForm';
import { useAuth } from '@/lib/hooks/useAuth';
import type { SignUpData } from '@/lib/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleRegister = async (formData: {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
    tipo: 'proveedor' | 'comprador' | 'freelancer';
    ubicacion: string;
    telefono?: string;
    website?: string;
  }) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Preparar datos para signUp (coincide con database.txt)
      const signUpData: SignUpData = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        tipo: formData.tipo,
        ubicacion: formData.ubicacion,
        telefono: formData.telefono,
        website: formData.website,
        descripcion: undefined, // Se puede agregar después en el perfil
      };

      const result = await signUp(signUpData);

      if (!result.success) {
        setError(result.error || 'Error al crear la cuenta');
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
        <title>Crear Cuenta - HUBMEX</title>
        <meta name="description" content="Únete a HUBMEX y conecta con fabricantes y compradores de México" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
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

            <RegisterForm onSubmit={handleRegister} loading={isSubmitting} />
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

