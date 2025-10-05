'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CardItemProps {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tipo: 'producto' | 'servicio';
  precio?: number;
  ubicacion: string;
  imagenes: string[];
  proveedor: {
    id: string;
    nombre: string;
    avatar_url?: string;
  };
  created_at: string;
}

const CardItem = ({
  id,
  titulo,
  descripcion,
  categoria,
  tipo,
  precio,
  ubicacion,
  imagenes,
  proveedor,
  created_at
}: CardItemProps) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'Consultar precio';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = () => {
    if (imagenes && imagenes.length > 0) {
      return imagenes[0];
    }
        return '/placeholder.svg'; // Placeholder image
  };

  return (
    <div className="card-hover group">
      {/* Image Container */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <Image
          src={getImageUrl()}
          alt={titulo}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            tipo === 'producto' 
              ? 'bg-primary text-dark' 
              : 'bg-success text-dark'
          }`}>
            {tipo === 'producto' ? 'Producto' : 'Servicio'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-light-bg text-text-light bg-opacity-90">
            {categoria}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-text-light line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {titulo}
        </h3>

        {/* Description */}
        <p className="text-text-soft text-sm line-clamp-2">
          {descripcion}
        </p>

        {/* Provider Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            {proveedor.avatar_url ? (
              <Image
                src={proveedor.avatar_url}
                alt={proveedor.nombre}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="text-dark text-sm font-medium">
                {proveedor.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-text-light text-sm font-medium">{proveedor.nombre}</p>
            <p className="text-text-soft text-xs">{ubicacion}</p>
          </div>
        </div>

        {/* Price and Date */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-primary font-semibold text-lg">
              {formatPrice(precio)}
            </p>
          </div>
          <div className="text-text-soft text-xs">
            {formatDate(created_at)}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link 
            href={`/profile/${proveedor.id}`}
            className="btn-outline w-full text-center block"
          >
            Ver perfil / Contactar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
