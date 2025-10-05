'use client';

import { useState } from 'react';

interface FilterState {
  categories: string[];
  locations: string[];
  types: ('producto' | 'servicio')[];
  priceRange: [number, number];
}

interface FiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
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

const locations = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
];

const Filters = ({ onFiltersChange, isOpen = false, onClose }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    types: [],
    priceRange: [0, 10000000] // 0 to 10M pesos
  });

  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...tempFilters.categories, category]
      : tempFilters.categories.filter(c => c !== category);
    
    setTempFilters({
      ...tempFilters,
      categories: newCategories
    });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...tempFilters.locations, location]
      : tempFilters.locations.filter(l => l !== location);
    
    setTempFilters({
      ...tempFilters,
      locations: newLocations
    });
  };

  const handleTypeChange = (type: 'producto' | 'servicio', checked: boolean) => {
    const newTypes = checked
      ? [...tempFilters.types, type]
      : tempFilters.types.filter(t => t !== type);
    
    setTempFilters({
      ...tempFilters,
      types: newTypes
    });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setTempFilters({
      ...tempFilters,
      priceRange: newRange
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    onFiltersChange(tempFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      locations: [],
      types: [],
      priceRange: [0, 10000000]
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.types.length +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">Categorías</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={tempFilters.categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Types */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">Tipo</h3>
        <div className="space-y-2">
          {(['producto', 'servicio'] as const).map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={tempFilters.types.includes(type)}
                onChange={(e) => handleTypeChange(type, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">Ubicación</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                checked={tempFilters.locations.includes(location)}
                onChange={(e) => handleLocationChange(location, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">
          Rango de Precio
        </h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Mínimo"
              value={tempFilters.priceRange[0] || ''}
              onChange={(e) => handlePriceRangeChange([
                parseInt(e.target.value) || 0,
                tempFilters.priceRange[1]
              ])}
              className="input-field w-full"
            />
            <input
              type="number"
              placeholder="Máximo"
              value={tempFilters.priceRange[1] || ''}
              onChange={(e) => handlePriceRangeChange([
                tempFilters.priceRange[0],
                parseInt(e.target.value) || 10000000
              ])}
              className="input-field w-full"
            />
          </div>
          <div className="text-xs text-text-soft text-center">
            {formatPrice(tempFilters.priceRange[0])} - {formatPrice(tempFilters.priceRange[1])}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-light">
        <button
          onClick={applyFilters}
          className="btn-primary w-full"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={clearFilters}
          className="btn-outline w-full"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-light-bg border-r border-gray-light p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-light">Filtros</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-dark-500 bg-opacity-50" onClick={onClose}></div>
          <div className="fixed top-0 left-0 w-80 h-full bg-light-bg p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">Filtros</h2>
              <button
                onClick={onClose}
                className="p-2 text-text-soft hover:text-text-light"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;
