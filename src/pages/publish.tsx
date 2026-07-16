import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  serviceCatalog,
  getCategoryById,
  getSubcategoriesByCategoryId,
} from '@/lib/catalog/serviceCategories';
import type { GetStaticPropsContext } from 'next';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import type { PackageTier } from '@/types/gig';

interface PackageForm {
  nombre: string;
  descripcion: string;
  precio: string;
  dias_entrega: string;
  revisiones: string;
  features: string[];
}

interface FormData {
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  ubicacion: string;
  tags: string;
  imagenes: File[];
  paquetes: Record<PackageTier, PackageForm>;
  faq: { pregunta: string; respuesta: string }[];
}

const emptyPackage = (nombre: string): PackageForm => ({
  nombre,
  descripcion: '',
  precio: '',
  dias_entrega: '',
  revisiones: '',
  features: [''],
});

const TIER_ORDER: PackageTier[] = ['basico', 'estandar', 'premium'];
const TIER_LABEL: Record<PackageTier, string> = {
  basico: 'Básico',
  estandar: 'Estándar',
  premium: 'Premium',
};

export default function Publish() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTier, setActiveTier] = useState<PackageTier>('basico');
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    ubicacion: '',
    tags: '',
    imagenes: [],
    paquetes: {
      basico: emptyPackage('Básico'),
      estandar: emptyPackage('Estándar'),
      premium: emptyPackage('Premium'),
    },
    faq: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedCategory = formData.categoria ? getCategoryById(formData.categoria) : undefined;
  const availableSubcategories = formData.categoria
    ? getSubcategoriesByCategoryId(formData.categoria)
    : [];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleField = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria' && { subcategoria: '' }),
    }));
  };

  const handlePackageChange = (tier: PackageTier, field: keyof PackageForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      paquetes: {
        ...prev.paquetes,
        [tier]: { ...prev.paquetes[tier], [field]: value },
      },
    }));
  };

  const handleFeatureChange = (tier: PackageTier, index: number, value: string) => {
    setFormData((prev) => {
      const features = [...prev.paquetes[tier].features];
      features[index] = value;
      return {
        ...prev,
        paquetes: {
          ...prev.paquetes,
          [tier]: { ...prev.paquetes[tier], features },
        },
      };
    });
  };

  const addFeature = (tier: PackageTier) => {
    setFormData((prev) => ({
      ...prev,
      paquetes: {
        ...prev.paquetes,
        [tier]: {
          ...prev.paquetes[tier],
          features: [...prev.paquetes[tier].features, ''],
        },
      },
    }));
  };

  const removeFeature = (tier: PackageTier, index: number) => {
    setFormData((prev) => ({
      ...prev,
      paquetes: {
        ...prev.paquetes,
        [tier]: {
          ...prev.paquetes[tier],
          features: prev.paquetes[tier].features.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addFaq = () =>
    setFormData((p) => ({ ...p, faq: [...p.faq, { pregunta: '', respuesta: '' }] }));
  const updateFaq = (i: number, field: 'pregunta' | 'respuesta', value: string) =>
    setFormData((p) => {
      const faq = [...p.faq];
      faq[i] = { ...faq[i], [field]: value };
      return { ...p, faq };
    });
  const removeFaq = (i: number) =>
    setFormData((p) => ({ ...p, faq: p.faq.filter((_, idx) => idx !== i) }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.imagenes.length > 5) {
      alert('Máximo 5 imágenes.');
      return;
    }
    setFormData((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...files] }));
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setFormData((p) => ({ ...p, imagenes: p.imagenes.filter((_, i) => i !== index) }));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: reemplazar por llamada real a createGig() cuando conectemos Supabase.
    // Payload listo:
    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: selectedCategory?.name,
      subcategoria: formData.subcategoria,
      ubicacion: formData.ubicacion,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      paquetes: {
        basico: normalizePackage(formData.paquetes.basico),
        estandar: normalizePackage(formData.paquetes.estandar),
        premium: normalizePackage(formData.paquetes.premium),
      },
      faq: formData.faq.filter((f) => f.pregunta && f.respuesta),
      // imagenes: se suben aparte a Storage y se guardan URLs.
    };
    console.log('Gig payload listo para enviar →', payload);
    setSubmitSuccess(true);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  const isFormValid = () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.categoria) return false;
    return TIER_ORDER.every((t) => {
      const p = formData.paquetes[t];
      return p.precio && p.dias_entrega;
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Publicar servicio · HUBMEX</title>
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-light mb-2">Crea tu servicio</h1>
            <p className="text-text-soft">
              Configura tu gig con 3 niveles: básico, estándar y premium.
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-success/20 border border-success rounded-lg">
              <span className="text-success font-medium">
                ✔ Servicio publicado (mock). Revisa la consola para ver el payload.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Info básica */}
            <section className="card space-y-6">
              <h2 className="text-lg font-semibold text-text-light">1. Información básica</h2>

              <div>
                <label className="block text-text-light font-medium mb-2">
                  Título del servicio *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleField('titulo', e.target.value)}
                  placeholder="Ej. Diseñaré un logo profesional para tu marca"
                  className="input-field"
                  maxLength={80}
                  required
                />
                <div className="text-xs text-text-soft mt-1">
                  {formData.titulo.length}/80 · Empieza con un verbo (Diseñaré, Escribiré...)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-light font-medium mb-2">Categoría *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleField('categoria', e.target.value)}
                    className="select-field"
                    required
                  >
                    <option value="">Elige una categoría</option>
                    {serviceCatalog.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {formData.categoria && (
                  <div>
                    <label className="block text-text-light font-medium mb-2">Subcategoría</label>
                    <select
                      value={formData.subcategoria}
                      onChange={(e) => handleField('subcategoria', e.target.value)}
                      className="select-field"
                    >
                      <option value="">Elige una subcategoría</option>
                      {availableSubcategories.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-text-light font-medium mb-2">
                  Descripción larga *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleField('descripcion', e.target.value)}
                  placeholder="Explica en detalle qué ofreces, tu proceso y tu experiencia."
                  className="textarea-field h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-light font-medium mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => handleField('ubicacion', e.target.value)}
                    placeholder="CDMX, México"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-text-light font-medium mb-2">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleField('tags', e.target.value)}
                    placeholder="logo, branding, minimalista"
                    className="input-field"
                  />
                </div>
              </div>
            </section>

            {/* 2. Imágenes */}
            <section className="card space-y-4">
              <h2 className="text-lg font-semibold text-text-light">2. Galería (máx. 5)</h2>
              <div className="border-2 border-dashed border-gray-light/50 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg className="w-10 h-10 text-text-soft mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-text-soft text-sm">Arrastra o haz clic para subir imágenes</p>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={src} className="relative aspect-square">
                      <Image src={src} alt={`preview ${i}`} fill className="rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-alert text-white rounded-full text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 3. Paquetes */}
            <section className="card space-y-4">
              <h2 className="text-lg font-semibold text-text-light">3. Paquetes</h2>
              <p className="text-text-soft text-sm">
                Ofrece 3 niveles para que el comprador elija según su presupuesto.
              </p>

              <div className="flex border-b border-gray-light/30">
                {TIER_ORDER.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setActiveTier(tier)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                      activeTier === tier
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-text-soft hover:text-text-light'
                    }`}
                  >
                    {TIER_LABEL[tier]}
                  </button>
                ))}
              </div>

              {TIER_ORDER.map((tier) => {
                const pkg = formData.paquetes[tier];
                if (activeTier !== tier) return null;
                return (
                  <div key={tier} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-text-light font-medium mb-2 text-sm">
                          Nombre del paquete
                        </label>
                        <input
                          type="text"
                          value={pkg.nombre}
                          onChange={(e) => handlePackageChange(tier, 'nombre', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-text-light font-medium mb-2 text-sm">
                          Precio (MXN) *
                        </label>
                        <input
                          type="number"
                          value={pkg.precio}
                          onChange={(e) => handlePackageChange(tier, 'precio', e.target.value)}
                          placeholder="800"
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-light font-medium mb-2 text-sm">
                        Descripción corta
                      </label>
                      <input
                        type="text"
                        value={pkg.descripcion}
                        onChange={(e) => handlePackageChange(tier, 'descripcion', e.target.value)}
                        placeholder="Qué incluye en una línea"
                        className="input-field"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-text-light font-medium mb-2 text-sm">
                          Días de entrega *
                        </label>
                        <input
                          type="number"
                          value={pkg.dias_entrega}
                          onChange={(e) => handlePackageChange(tier, 'dias_entrega', e.target.value)}
                          placeholder="3"
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-text-light font-medium mb-2 text-sm">
                          Revisiones
                        </label>
                        <input
                          type="text"
                          value={pkg.revisiones}
                          onChange={(e) => handlePackageChange(tier, 'revisiones', e.target.value)}
                          placeholder="2 o 'ilimitadas'"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-light font-medium mb-2 text-sm">
                        Características incluidas
                      </label>
                      <div className="space-y-2">
                        {pkg.features.map((f, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              value={f}
                              onChange={(e) => handleFeatureChange(tier, i, e.target.value)}
                              placeholder="Ej. Archivos vectoriales AI, SVG"
                              className="input-field flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeFeature(tier, i)}
                              className="px-3 text-text-soft hover:text-alert"
                              aria-label="Quitar característica"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addFeature(tier)}
                          className="text-primary text-sm hover:underline"
                        >
                          + Añadir característica
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* 4. FAQ */}
            <section className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-light">4. Preguntas frecuentes (opcional)</h2>
                <button type="button" onClick={addFaq} className="text-primary text-sm hover:underline">
                  + Añadir pregunta
                </button>
              </div>
              {formData.faq.length === 0 && (
                <p className="text-text-soft text-sm">
                  Añade respuestas a las dudas más comunes para reducir mensajes.
                </p>
              )}
              {formData.faq.map((f, i) => (
                <div key={i} className="space-y-2 border border-gray-light/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-soft text-xs">Pregunta {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="text-text-soft hover:text-alert text-sm"
                    >
                      Quitar
                    </button>
                  </div>
                  <input
                    type="text"
                    value={f.pregunta}
                    onChange={(e) => updateFaq(i, 'pregunta', e.target.value)}
                    placeholder="Pregunta"
                    className="input-field"
                  />
                  <textarea
                    value={f.respuesta}
                    onChange={(e) => updateFaq(i, 'respuesta', e.target.value)}
                    placeholder="Respuesta"
                    className="textarea-field h-20"
                  />
                </div>
              ))}
            </section>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isFormValid()
                    ? 'btn-primary'
                    : 'bg-gray-light text-text-soft cursor-not-allowed'
                }`}
              >
                Publicar servicio
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

        <Footer />
      </div>
    </>
  );
}

function normalizePackage(p: PackageForm) {
  return {
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number(p.precio) || 0,
    dias_entrega: Number(p.dias_entrega) || 0,
    revisiones:
      p.revisiones.toLowerCase().includes('ilim') ? 'ilimitadas' : Number(p.revisiones) || 0,
    features: p.features.filter((f) => f.trim()),
  };
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'publish']);
  return { props: { translations } };
}
