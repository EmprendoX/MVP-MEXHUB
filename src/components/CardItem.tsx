'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';

interface CardItemProps {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: string;
  tipo?: 'producto' | 'servicio';
  /**
   * Precio base ("desde"). Si el gig tiene paquetes, este es el `precio_desde`.
   */
  precio?: number;
  ubicacion?: string;
  imagenes: string[];
  proveedor: {
    id: string;
    nombre: string;
    avatar_url?: string;
    nivel?: 'nuevo' | 'nivel_1' | 'nivel_2' | 'top_rated';
  };
  rating?: number;
  total_reviews?: number;
  dias_entrega_min?: number;
  created_at?: string;
  /**
   * Slug para navegación al detalle. Si no viene, se usa `id`.
   */
  slug?: string;
}

const NIVEL_LABELS: Record<NonNullable<CardItemProps['proveedor']['nivel']>, string> = {
  nuevo: 'Nuevo',
  nivel_1: 'Nivel 1',
  nivel_2: 'Nivel 2',
  top_rated: 'Top Rated',
};

const CardItem = ({
  id,
  titulo,
  descripcion,
  categoria,
  precio,
  imagenes,
  proveedor,
  rating,
  total_reviews,
  dias_entrega_min,
  slug,
}: CardItemProps) => {
  const { t, locale } = useTranslation('common');

  const formatPrice = (price?: number) => {
    if (!price) return t('card.priceRequest');
    const formatter = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  const getImageUrl = () => (imagenes && imagenes.length > 0 ? imagenes[0] : '/placeholder.svg');

  const href = `/gig/${slug ?? id}`;
  const nivelLabel = proveedor.nivel ? NIVEL_LABELS[proveedor.nivel] : null;

  return (
    <Link href={href} className="block group">
      <div className="bg-light-bg rounded-xl overflow-hidden border border-gray-light hover:border-primary transition-all duration-200 hover:shadow-hubmex">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={getImageUrl()}
            alt={titulo}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {nivelLabel && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/90 text-primary backdrop-blur-sm shadow-sm">
                {nivelLabel}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Seller */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
              {proveedor.avatar_url ? (
                <Image
                  src={proveedor.avatar_url}
                  alt={proveedor.nombre}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-primary text-xs font-semibold">
                  {proveedor.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-text-light text-sm font-medium truncate">{proveedor.nombre}</span>
          </div>

          {/* Title */}
          <h3 className="text-text-light text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {titulo}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.363 1.118l1.287 3.958c.3.922-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.784.57-1.838-.196-1.539-1.118l1.286-3.958a1 1 0 00-.362-1.118L2.05 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
            </svg>
            {rating != null ? (
              <>
                <span className="text-text-light font-semibold">{rating.toFixed(1)}</span>
                {total_reviews != null && (
                  <span className="text-text-soft">({total_reviews})</span>
                )}
              </>
            ) : (
              <span className="text-text-soft text-xs">Sin reseñas aún</span>
            )}
            <span className="ml-auto text-text-soft text-xs">{categoria}</span>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-3 border-t border-gray-light/30">
            {dias_entrega_min != null && (
              <span className="text-text-soft text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {dias_entrega_min}d
              </span>
            )}
            <div className="ml-auto text-right">
              <div className="text-text-soft text-[10px] uppercase tracking-wide">Desde</div>
              <div className="text-text-light font-bold text-base leading-tight">
                {formatPrice(precio)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {descripcion && <span className="sr-only">{descripcion}</span>}
    </Link>
  );
};

export default CardItem;
