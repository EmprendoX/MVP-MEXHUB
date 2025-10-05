'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Filters from '@/components/Filters';
import CardItem from '@/components/CardItem';
import Footer from '@/components/Footer';

interface FilterState {
  categories: string[];
  locations: string[];
  types: ('producto' | 'servicio')[];
  priceRange: [number, number];
}

// Datos de ejemplo expandidos para la página explore
const allProducts = [
  {
    id: '1',
    titulo: 'Maquinaria Industrial CNC',
    descripcion: 'Máquinas CNC de alta precisión para la industria manufacturera. Fabricación de piezas metálicas y plásticas con tecnología de vanguardia.',
    categoria: 'Maquinaria Industrial',
    tipo: 'producto' as const,
    precio: 2500000,
    ubicacion: 'Guadalajara, Jalisco',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-1',
      nombre: 'MetalWorks México',
      avatar_url: undefined
    },
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    titulo: 'Servicios de Diseño Industrial',
    descripcion: 'Diseño y desarrollo de productos industriales. Desde conceptualización hasta prototipado y manufactura.',
    categoria: 'Servicios de Diseño',
    tipo: 'servicio' as const,
    precio: undefined,
    ubicacion: 'Monterrey, Nuevo León',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-2',
      nombre: 'DesignTech Solutions',
      avatar_url: undefined
    },
    created_at: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    titulo: 'Componentes Electrónicos',
    descripcion: 'Fabricación de componentes electrónicos para la industria automotriz y de telecomunicaciones.',
    categoria: 'Electrónicos',
    tipo: 'producto' as const,
    precio: 85000,
    ubicacion: 'Tijuana, Baja California',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-3',
      nombre: 'ElectroMex Components',
      avatar_url: undefined
    },
    created_at: '2024-01-13T09:20:00Z'
  },
  {
    id: '4',
    titulo: 'Servicios de Logística',
    descripcion: 'Soluciones logísticas integrales para la exportación e importación de productos manufacturados.',
    categoria: 'Logística',
    tipo: 'servicio' as const,
    precio: undefined,
    ubicacion: 'Ciudad de México',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-4',
      nombre: 'LogiMex International',
      avatar_url: undefined
    },
    created_at: '2024-01-12T14:15:00Z'
  },
  {
    id: '5',
    titulo: 'Textiles Industriales',
    descripcion: 'Fabricación de textiles especializados para la industria automotriz, médica y de construcción.',
    categoria: 'Textiles',
    tipo: 'producto' as const,
    precio: 450000,
    ubicacion: 'Puebla, Puebla',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-5',
      nombre: 'TexMex Industries',
      avatar_url: undefined
    },
    created_at: '2024-01-11T11:30:00Z'
  },
  {
    id: '6',
    titulo: 'Consultoría en Manufactura',
    descripcion: 'Consultoría especializada en optimización de procesos de manufactura y mejora continua.',
    categoria: 'Consultoría',
    tipo: 'servicio' as const,
    precio: undefined,
    ubicacion: 'Querétaro, Querétaro',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-6',
      nombre: 'Manufacturing Experts',
      avatar_url: undefined
    },
    created_at: '2024-01-10T16:45:00Z'
  },
  {
    id: '7',
    titulo: 'Piezas Metálicas Personalizadas',
    descripcion: 'Fabricación de piezas metálicas a medida para la industria automotriz y aeroespacial.',
    categoria: 'Metalúrgica',
    tipo: 'producto' as const,
    precio: 120000,
    ubicacion: 'San Luis Potosí',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-7',
      nombre: 'MetalCraft Solutions',
      avatar_url: undefined
    },
    created_at: '2024-01-09T13:20:00Z'
  },
  {
    id: '8',
    titulo: 'Servicios de Calidad ISO',
    descripcion: 'Certificación y consultoría en sistemas de calidad ISO 9001, 14001 y 45001.',
    categoria: 'Consultoría',
    tipo: 'servicio' as const,
    precio: undefined,
    ubicacion: 'Mérida, Yucatán',
        imagenes: ['/placeholder.svg'],
    proveedor: {
      id: 'prov-8',
      nombre: 'QualityMex Systems',
      avatar_url: undefined
    },
    created_at: '2024-01-08T10:15:00Z'
  }
];

export default function Explore() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    types: [],
    priceRange: [0, 10000000]
  });
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Get search query from URL on mount
  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q as string);
    }
  }, [router.query.q]);

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = allProducts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.titulo.toLowerCase().includes(query) ||
        product.descripcion.toLowerCase().includes(query) ||
        product.categoria.toLowerCase().includes(query) ||
        product.proveedor.nombre.toLowerCase().includes(query) ||
        product.ubicacion.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.categoria)
      );
    }

    // Filter by locations
    if (filters.locations.length > 0) {
      filtered = filtered.filter(product =>
        filters.locations.some(location =>
          product.ubicacion.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Filter by types
    if (filters.types.length > 0) {
      filtered = filtered.filter(product =>
        filters.types.includes(product.tipo)
      );
    }

    // Filter by price range
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) {
      filtered = filtered.filter(product => {
        if (!product.precio) return true; // Services without price
        return product.precio >= filters.priceRange[0] && 
               product.precio <= filters.priceRange[1];
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`, undefined, { shallow: true });
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.types.length +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0);
  };

  return (
    <>
      <Head>
        <title>Explorar - HUBMEX | Productos y Servicios de México</title>
        <meta name="description" content="Explora productos y servicios de fabricantes mexicanos. Encuentra maquinaria, componentes electrónicos, servicios de diseño y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Search Header */}
        <div className="bg-light-bg border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos, servicios, fabricantes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-full pl-12 pr-4"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-text-soft hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Mobile Filters Button */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="md:hidden btn-outline flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filtros
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-text-soft">
                {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                {searchQuery && ` para "${searchQuery}"`}
              </p>
              <div className="flex items-center space-x-2 text-sm text-text-soft">
                <span>Ordenar por:</span>
                <select className="bg-light-bg border border-gray-light rounded px-3 py-1 text-text-light">
                  <option value="recent">Más recientes</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Desktop Filters Sidebar */}
          <Filters onFiltersChange={handleFiltersChange} />

          {/* Products Grid */}
          <div className="flex-1 p-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <CardItem key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg className="w-24 h-24 text-text-soft mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-text-light mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-text-soft mb-6">
                  Intenta ajustar tus filtros o usar términos de búsqueda diferentes.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      locations: [],
                      types: [],
                      priceRange: [0, 10000000]
                    });
                  }}
                  className="btn-primary"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        <Filters 
          onFiltersChange={handleFiltersChange} 
          isOpen={isFiltersOpen} 
          onClose={() => setIsFiltersOpen(false)} 
        />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
