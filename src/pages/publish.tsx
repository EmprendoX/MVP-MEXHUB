'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import { useListings } from '@/lib/hooks/useListings';

interface FormData {
  titulo: string;
  descripcion: string;
  tipo: 'producto' | 'servicio';
  categoria: string;
  subcategoria: string;
  precio: string;
  ubicacion: string;
  tiempoEntrega: string;
  capacidad: string;
  moq: string;
  imagenes: File[];
}

const categories = [
  'Maquinaria Industrial',
  'Electrónicos',
  'Textiles',
  'Servicios de Diseño',
  'Logística',
  'Consultoría',
  'Metalúrgica',
  'Química',
  'Alimentaria',
  'Automotriz',
  'Construcción',
  'Tecnología'
];

const subcategories = {
  'Maquinaria Industrial': ['CNC', 'Inyección', 'Extrusión', 'Torneado', 'Fresado'],
  'Electrónicos': ['Componentes', 'Circuitos', 'Sensores', 'Microcontroladores'],
  'Textiles': ['Automotriz', 'Médico', 'Industrial', 'Construcción'],
  'Servicios de Diseño': ['CAD', 'Prototipado', 'Desarrollo', 'Consultoría'],
  'Logística': ['Embalaje', 'Transporte', 'Almacén', 'Distribución'],
  'Consultoría': ['Calidad', 'Procesos', 'Lean', 'ISO'],
  'Metalúrgica': ['Piezas', 'Estructuras', 'Soldadura', 'Tratamiento'],
  'Química': ['Productos', 'Análisis', 'Laboratorio', 'Investigación'],
  'Alimentaria': ['Procesamiento', 'Empaque', 'Ingredientes', 'Equipos'],
  'Automotriz': ['Piezas', 'Componentes', 'Ensamblaje', 'Servicios'],
  'Construcción': ['Materiales', 'Herramientas', 'Equipos', 'Servicios'],
  'Tecnología': ['Software', 'Hardware', 'IoT', 'Automatización']
};

export default function Publish() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { createListing, uploadImage } = useListings();
  
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    tipo: 'producto',
    categoria: '',
    subcategoria: '',
    precio: '',
    ubicacion: '',
    tiempoEntrega: '',
    capacidad: '',
    moq: '',
    imagenes: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Proteger ruta: redirigir a login si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategoria when categoria changes
      ...(name === 'categoria' && { subcategoria: '' })
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.imagenes.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    const newImages = [...formData.imagenes, ...files];
    setFormData(prev => ({ ...prev, imagenes: newImages }));

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, imagenes: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para publicar');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // PASO 1: Subir imágenes a Supabase Storage
      let imageUrls: string[] = [];
      
      if (formData.imagenes.length > 0) {
        setUploadingImages(true);
        
        for (let i = 0; i < formData.imagenes.length; i++) {
          const file = formData.imagenes[i];
          setUploadProgress(Math.round(((i + 1) / formData.imagenes.length) * 100));
          
          const uploadResult = await uploadImage(file);
          
          if (uploadResult.success && uploadResult.data) {
            imageUrls.push(uploadResult.data);
          } else {
            console.error('Error subiendo imagen:', uploadResult.error);
            // Continuar con las demás imágenes
          }
        }
        
        setUploadingImages(false);
      }

      // PASO 2: Crear publicación en BD
      // Mapear campos del form a los campos de database.txt
      const listingData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || undefined,
        tipo: formData.tipo,
        categoria: formData.categoria || undefined,
        subcategoria: formData.subcategoria || undefined,
        precio: formData.precio ? parseFloat(formData.precio) : undefined,
        ubicacion: formData.ubicacion || undefined,
        tiempo_entrega: formData.tiempoEntrega || undefined,
        capacidad: formData.capacidad || undefined,
        moq: formData.moq || undefined,
        imagenes: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const result = await createListing(listingData);

      if (result.success) {
        setSubmitSuccess(true);
        
        // Reset form después de 2 segundos y redirigir al dashboard
        setTimeout(() => {
          setFormData({
            titulo: '',
            descripcion: '',
            tipo: 'producto',
            categoria: '',
            subcategoria: '',
            precio: '',
            ubicacion: '',
            tiempoEntrega: '',
            capacidad: '',
            moq: '',
            imagenes: []
          });
          setImagePreviews([]);
          setSubmitSuccess(false);
          router.push('/dashboard');
        }, 2000);
      } else {
        alert(result.error || 'Error al publicar');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error inesperado al publicar');
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const isFormValid = () => {
    return formData.titulo.trim() && 
           formData.descripcion.trim() && 
           formData.categoria &&
           formData.ubicacion.trim();
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

  // No mostrar nada si no está autenticado (está redirigiendo)
  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Publicar Producto - HUBMEX</title>
        <meta name="description" content="Publica tu producto o servicio en HUBMEX y conecta con compradores de todo el mundo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-light mb-2">
                Publicar Producto o Servicio
              </h1>
              <p className="text-text-soft">
                Comparte tu producto o servicio con compradores de todo el mundo y haz crecer tu negocio.
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-success bg-opacity-20 border border-success rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-success font-medium">
                    ¡Producto publicado exitosamente! Será visible en el directorio en unos minutos.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tipo de Publicación */}
              <div>
                <label className="block text-text-light font-medium mb-3">
                  Tipo de Publicación *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-light rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="tipo"
                      value="producto"
                      checked={formData.tipo === 'producto'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-light-bg border-gray-light focus:ring-primary focus:ring-2"
                    />
                    <div className="ml-3">
                      <div className="text-text-light font-medium">Producto</div>
                      <div className="text-text-soft text-sm">Artículos físicos o digitales</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-light rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="tipo"
                      value="servicio"
                      checked={formData.tipo === 'servicio'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-light-bg border-gray-light focus:ring-primary focus:ring-2"
                    />
                    <div className="ml-3">
                      <div className="text-text-light font-medium">Servicio</div>
                      <div className="text-text-soft text-sm">Consultoría, diseño, etc.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="titulo" className="block text-text-light font-medium mb-2">
                    Título del {formData.tipo} *
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder={`Ej: Máquina CNC de 3 ejes`}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="categoria" className="block text-text-light font-medium mb-2">
                    Categoría *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="select-field"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.categoria && (
                <div>
                  <label htmlFor="subcategoria" className="block text-text-light font-medium mb-2">
                    Subcategoría
                  </label>
                  <select
                    id="subcategoria"
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleInputChange}
                    className="select-field"
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {subcategories[formData.categoria as keyof typeof subcategories]?.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="descripcion" className="block text-text-light font-medium mb-2">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe detalladamente tu producto o servicio, incluyendo características principales, beneficios y especificaciones técnicas."
                  className="textarea-field h-32"
                  required
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-text-light font-medium mb-2">
                  Imágenes (máximo 5)
                </label>
                <div className="border-2 border-dashed border-gray-light rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-text-soft mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-text-soft mb-2">Haz clic para subir imágenes</p>
                    <p className="text-text-soft text-sm">PNG, JPG hasta 10MB cada una</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-alert text-text-light rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detalles Adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="precio" className="block text-text-light font-medium mb-2">
                    Precio {formData.tipo === 'servicio' ? '(por hora/proyecto)' : ''}
                  </label>
                  <input
                    type="text"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="Ej: $50,000 MXN o Consultar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="ubicacion" className="block text-text-light font-medium mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder="Ciudad, Estado"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tiempoEntrega" className="block text-text-light font-medium mb-2">
                    Tiempo de entrega estimado
                  </label>
                  <input
                    type="text"
                    id="tiempoEntrega"
                    name="tiempoEntrega"
                    value={formData.tiempoEntrega}
                    onChange={handleInputChange}
                    placeholder="Ej: 2-3 semanas"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="capacidad" className="block text-text-light font-medium mb-2">
                    Capacidad de producción
                  </label>
                  <input
                    type="text"
                    id="capacidad"
                    name="capacidad"
                    value={formData.capacidad}
                    onChange={handleInputChange}
                    placeholder="Ej: 1000 unidades/mes"
                    className="input-field"
                  />
                </div>
              </div>

              {formData.tipo === 'producto' && (
                <div>
                  <label htmlFor="moq" className="block text-text-light font-medium mb-2">
                    Cantidad mínima de orden (MOQ)
                  </label>
                  <input
                    type="text"
                    id="moq"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    placeholder="Ej: 100 unidades"
                    className="input-field"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-light">
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    isFormValid() && !isSubmitting
                      ? 'btn-primary'
                      : 'bg-gray-light text-text-soft cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {uploadingImages 
                        ? `Subiendo imágenes... ${uploadProgress}%` 
                        : 'Publicando...'}
                    </div>
                  ) : (
                    'Publicar Producto'
                  )}
                </button>
                <button
                  type="button"
                  className="btn-outline py-3 px-6"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
