'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormField, FormButton } from './index';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  className?: string;
}

const LoginForm = ({ onSubmit, loading = false, className = '' }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Login error:', error);
        // Handle login error (e.g., show toast notification)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-light mb-2">
          Iniciar Sesión
        </h2>
        <p className="text-text-soft">
          Ingresa a tu cuenta de HUBMEX
        </p>
      </div>

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="tu@empresa.com"
        value={formData.email}
        onChange={handleInputChange}
        required
        error={errors.email}
      />

      <FormField
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleInputChange}
        required
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary border-gray-light rounded focus:ring-primary"
          />
          <span className="ml-2 text-sm text-text-soft">
            Recordarme
          </span>
        </label>
        
        <a href="#" className="text-sm text-primary hover:text-primary-600 transition-colors">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </FormButton>

      <div className="text-center">
        <p className="text-text-soft text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:text-primary-600 transition-colors font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
