import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import { useListings } from '@/lib/hooks/useListings';
import {
  serviceCatalog,
  getCategoryById,
  getSubcategoriesByCategoryId,
  getSubcategoryById,
} from '@/lib/catalog/serviceCategories';
import type { GetStaticPropsContext } from 'next';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

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

export default function Publish() {
  const router = useRouter();
  const { t } = useTranslation('publish');
  const { t: tCommon } = useTranslation('common');
  const { user, userProfileId, loading: authLoading } = useAuth();
  const { createListing, uploadImage } = useListings({ userId: userProfileId });

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
    imagenes: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedCategory = formData.categoria ? getCategoryById(formData.categoria) : undefined;
  const availableSubcategories = formData.categoria ? getSubcategoriesByCategoryId(formData.categoria) : [];

  // Proteger ruta: redirigir a login si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria' && { subcategoria: '' }),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.imagenes.length > 5) {
      alert(tCommon('forms.maxImages'));
      return;
    }

    const newImages = [...formData.imagenes, ...files];
    setFormData((prev) => ({ ...prev, imagenes: newImages }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({ ...prev, imagenes: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert(tCommon('forms.mustLogin'));
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const imageUrls: string[] = [];

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
          }
        }

        setUploadingImages(false);
      }

      const listingData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || undefined,
        tipo: formData.tipo,
        categoria: selectedCategory?.name || undefined,
        subcategoria: formData.subcategoria
          ? getSubcategoryById(formData.subcategoria)?.subcategory.name
          : undefined,
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
            imagenes: [],
          });
          setImagePreviews([]);
          setSubmitSuccess(false);
          router.push('/dashboard');
        }, 2000);
      } else {
        alert(result.error || tCommon('statuses.unexpectedError'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(tCommon('statuses.unexpectedError'));
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.titulo.trim() &&
      formData.descripcion.trim() &&
      formData.categoria &&
      formData.ubicacion.trim()
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-soft">{tCommon('statuses.checkingSession')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const titleLabel =
    formData.tipo === 'producto' ? t('form.title.labelProduct') : t('form.title.labelService');

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-light mb-2">{t('header.title')}</h1>
              <p className="text-text-soft">{t('header.description')}</p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-success bg-opacity-20 border border-success rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-success font-medium">{t('notifications.success')}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tipo de Publicación */}
              <div>
                <label className="block text-text-light font-medium mb-3">{t('form.type.label')}</label>
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
                      <div className="text-text-light font-medium">{t('form.type.product.title')}</div>
                      <div className="text-text-soft text-sm">{t('form.type.product.description')}</div>
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
                      <div className="text-text-light font-medium">{t('form.type.service.title')}</div>
                      <div className="text-text-soft text-sm">{t('form.type.service.description')}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="titulo" className="block text-text-light font-medium mb-2">
                    {titleLabel}
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder={t('form.title.placeholder')}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="categoria" className="block text-text-light font-medium mb-2">
                    {t('form.category.label')}
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="select-field"
                    required
                  >
                    <option value="">{t('form.category.placeholder')}</option>
                    {serviceCatalog.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <p className="mt-2 text-sm text-text-soft">{selectedCategory.description}</p>
                  )}
                </div>
              </div>

              {formData.categoria && (
                <div>
                  <label htmlFor="subcategoria" className="block text-text-light font-medium mb-2">
                    {t('form.subcategory.label')}
                  </label>
                  <select
                    id="subcategoria"
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleInputChange}
                    className="select-field"
                  >
                    <option value="">{t('form.subcategory.placeholder')}</option>
                    {availableSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {formData.subcategoria && (
                    <p className="mt-2 text-sm text-text-soft">
                      {getSubcategoryById(formData.subcategoria)?.subcategory.description}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="descripcion" className="block text-text-light font-medium mb-2">
                  {t('form.description.label')}
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder={t('form.description.placeholder')}
                  className="textarea-field h-32"
                  required
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-text-light font-medium mb-2">{t('form.images.label')}</label>
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
                    <p className="text-text-soft mb-2">{t('form.images.helper')}</p>
                    <p className="text-text-soft text-sm">{t('form.images.formats')}</p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={preview} className="relative">
                        <Image
                          src={preview}
                          alt={t('form.images.previewAlt', { index: index + 1 })}
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
                    {t('form.price.label')}{' '}
                    {formData.tipo === 'servicio' ? t('form.price.serviceHint') : ''}
                  </label>
                  <input
                    type="text"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder={t('form.price.placeholder')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="ubicacion" className="block text-text-light font-medium mb-2">
                    {t('form.location.label')}
                  </label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder={t('form.location.placeholder')}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tiempoEntrega" className="block text-text-light font-medium mb-2">
                    {t('form.delivery.label')}
                  </label>
                  <input
                    type="text"
                    id="tiempoEntrega"
                    name="tiempoEntrega"
                    value={formData.tiempoEntrega}
                    onChange={handleInputChange}
                    placeholder={t('form.delivery.placeholder')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="capacidad" className="block text-text-light font-medium mb-2">
                    {t('form.capacity.label')}
                  </label>
                  <input
                    type="text"
                    id="capacidad"
                    name="capacidad"
                    value={formData.capacidad}
                    onChange={handleInputChange}
                    placeholder={t('form.capacity.placeholder')}
                    className="input-field"
                  />
                </div>
              </div>

              {formData.tipo === 'producto' && (
                <div>
                  <label htmlFor="moq" className="block text-text-light font-medium mb-2">
                    {t('form.moq.label')}
                  </label>
                  <input
                    type="text"
                    id="moq"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    placeholder={t('form.moq.placeholder')}
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
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {uploadingImages
                        ? t('form.submit.uploading', { progress: uploadProgress })
                        : t('form.submit.publishing')}
                    </div>
                  ) : (
                    t('form.submit.primary')
                  )}
                </button>
                <button
                  type="button"
                  className="btn-outline py-3 px-6"
                  onClick={() => window.history.back()}
                >
                  {t('form.submit.cancel')}
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'publish']);

  return {
    props: {
      translations,
    },
  };
}
