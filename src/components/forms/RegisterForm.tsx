'use client';

import { useState } from 'react';
import { FormField, FormSelect, FormRadioGroup, FormButton } from './index';

interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipo: 'proveedor' | 'comprador' | 'freelancer';
  ubicacion: string;
  telefono?: string;
  website?: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading?: boolean;
  className?: string;
}

const userTypeOptions = [
  {
    value: 'proveedor',
    label: 'Proveedor / Fabricante',
    description: 'Vendo productos o servicios de manufactura'
  },
  {
    value: 'comprador',
    label: 'Comprador / Emprendedor',
    description: 'Busco productos o servicios para mi negocio'
  },
  {
    value: 'freelancer',
    label: 'Freelancer / Especialista',
    description: 'Ofrezco servicios profesionales especializados'
  }
];

const locationOptions = [
  { value: '', label: 'Selecciona tu ubicación' },
  { value: 'aguascalientes', label: 'Aguascalientes' },
  { value: 'baja-california', label: 'Baja California' },
  { value: 'baja-california-sur', label: 'Baja California Sur' },
  { value: 'campeche', label: 'Campeche' },
  { value: 'chiapas', label: 'Chiapas' },
  { value: 'chihuahua', label: 'Chihuahua' },
  { value: 'ciudad-mexico', label: 'Ciudad de México' },
  { value: 'coahuila', label: 'Coahuila' },
  { value: 'colima', label: 'Colima' },
  { value: 'durango', label: 'Durango' },
  { value: 'guanajuato', label: 'Guanajuato' },
  { value: 'guerrero', label: 'Guerrero' },
  { value: 'hidalgo', label: 'Hidalgo' },
  { value: 'jalisco', label: 'Jalisco' },
  { value: 'mexico', label: 'Estado de México' },
  { value: 'michoacan', label: 'Michoacán' },
  { value: 'morelos', label: 'Morelos' },
  { value: 'nayarit', label: 'Nayarit' },
  { value: 'nuevo-leon', label: 'Nuevo León' },
  { value: 'oaxaca', label: 'Oaxaca' },
  { value: 'puebla', label: 'Puebla' },
  { value: 'queretaro', label: 'Querétaro' },
  { value: 'quintana-roo', label: 'Quintana Roo' },
  { value: 'san-luis-potosi', label: 'San Luis Potosí' },
  { value: 'sinaloa', label: 'Sinaloa' },
  { value: 'sonora', label: 'Sonora' },
  { value: 'tabasco', label: 'Tabasco' },
  { value: 'tamaulipas', label: 'Tamaulipas' },
  { value: 'tlaxcala', label: 'Tlaxcala' },
  { value: 'veracruz', label: 'Veracruz' },
  { value: 'yucatan', label: 'Yucatán' },
  { value: 'zacatecas', label: 'Zacatecas' }
];

const RegisterForm = ({ onSubmit, loading = false, className = '' }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipo: 'proveedor',
    ubicacion: '',
    telefono: '',
    website: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, tipo: e.target.value as RegisterFormData['tipo'] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.ubicacion) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'El sitio web debe comenzar con http:// o https://';
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
        console.error('Registration error:', error);
        // Handle registration error (e.g., show toast notification)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-light mb-2">
          Crear Cuenta
        </h2>
        <p className="text-text-soft">
          Únete a la comunidad de manufactura mexicana
        </p>
      </div>

      {/* User Type Selection */}
      <FormRadioGroup
        label="Tipo de Usuario"
        name="tipo"
        value={formData.tipo}
        onChange={handleRadioChange}
        options={userTypeOptions}
        required
      />

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nombre / Empresa"
          name="nombre"
          type="text"
          placeholder="Tu nombre o nombre de empresa"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          error={errors.nombre || undefined}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="tu@empresa.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          error={errors.email || undefined}
        />
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          error={errors.password}
          helpText="Mínimo 8 caracteres"
        />

        <FormField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          error={errors.confirmPassword}
        />
      </div>

      {/* Location and Contact */}
      <FormSelect
        label="Ubicación"
        name="ubicacion"
        value={formData.ubicacion}
        onChange={handleInputChange}
        options={locationOptions}
        required
        error={errors.ubicacion}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Teléfono"
          name="telefono"
          type="tel"
          placeholder="+52 55 1234 5678"
          value={formData.telefono || ''}
          onChange={handleInputChange}
          helpText="Opcional"
        />

        <FormField
          label="Sitio Web"
          name="website"
          type="url"
          placeholder="https://tuempresa.com"
          value={formData.website || ''}
          onChange={handleInputChange}
          error={errors.website}
          helpText="Opcional"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 text-primary border-gray-light rounded focus:ring-primary"
        />
        <label className="text-sm text-text-soft">
          Acepto los{' '}
          <a href="/terms" className="text-primary hover:text-primary-600 transition-colors">
            Términos de Servicio
          </a>{' '}
          y la{' '}
          <a href="/privacy" className="text-primary hover:text-primary-600 transition-colors">
            Política de Privacidad
          </a>
        </label>
      </div>

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </FormButton>

      <div className="text-center">
        <p className="text-text-soft text-sm">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-primary hover:text-primary-600 transition-colors font-medium">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
