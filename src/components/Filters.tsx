'use client';

import { useMemo, useState, type Dispatch } from 'react';
import {
  serviceCatalog,
  SERVICE_TYPES,
  getSubcategoriesByCategoryId,
  getSubcategoryById,
} from '@/lib/catalog/serviceCategories';
import type { ServiceTypeTag } from '@/lib/catalog/serviceCategories';
import { useTranslation } from '@/contexts/TranslationContext';

export interface FilterState {
  categories: string[];
  subcategories: string[];
  serviceTypes: ServiceTypeTag[];
  locations: string[];
  types: ('producto' | 'servicio')[];
  priceRange: [number, number];
}

interface FiltersProps {
  onFiltersChange: Dispatch<FilterState>;
  isOpen?: boolean;
  onClose?: () => void;
}

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
  const { t, locale } = useTranslation('common');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    serviceTypes: [],
    locations: [],
    types: [],
    priceRange: [0, 10000000] // 0 to 10M pesos
  });

  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const availableSubcategories = useMemo(() => {
    return tempFilters.categories.flatMap((categoryId) =>
      getSubcategoriesByCategoryId(categoryId).map((subcategory) => ({
        ...subcategory,
        categoryId,
      }))
    );
  }, [tempFilters.categories]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setTempFilters((prev) => {
      const newCategories = checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId);

      const allowedSubcategories = newCategories.flatMap((id) =>
        getSubcategoriesByCategoryId(id).map((subcategory) => subcategory.id)
      );

      return {
        ...prev,
        categories: newCategories,
        subcategories: prev.subcategories.filter((id) =>
          allowedSubcategories.includes(id)
        ),
      };
    });
  };

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    setTempFilters((prev) => {
      const newSubcategories = checked
        ? [...prev.subcategories, subcategoryId]
        : prev.subcategories.filter((id) => id !== subcategoryId);

      const subcategoryInfo = getSubcategoryById(subcategoryId);
      const categoryId = subcategoryInfo?.category.id;

      return {
        ...prev,
        subcategories: newSubcategories,
        categories:
          checked && categoryId && !prev.categories.includes(categoryId)
            ? [...prev.categories, categoryId]
            : prev.categories,
      };
    });
  };

  const handleServiceTypeChange = (serviceType: ServiceTypeTag, checked: boolean) => {
    setTempFilters((prev) => {
      const newServiceTypes = checked
        ? [...prev.serviceTypes, serviceType]
        : prev.serviceTypes.filter((type) => type !== serviceType);

      return {
        ...prev,
        serviceTypes: newServiceTypes,
      };
    });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setTempFilters((prev) => {
      const newLocations = checked
        ? [...prev.locations, location]
        : prev.locations.filter((l) => l !== location);

      return {
        ...prev,
        locations: newLocations,
      };
    });
  };

  const handleTypeChange = (type: 'producto' | 'servicio', checked: boolean) => {
    setTempFilters((prev) => {
      const newTypes = checked
        ? [...prev.types, type]
        : prev.types.filter((t) => t !== type);

      return {
        ...prev,
        types: newTypes,
      };
    });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setTempFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    onFiltersChange(tempFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      subcategories: [],
      serviceTypes: [],
      locations: [],
      types: [],
      priceRange: [0, 10000000],
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length +
           filters.subcategories.length +
           filters.serviceTypes.length +
           filters.locations.length +
           filters.types.length +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Service Types */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.serviceTypes')}</h3>
        <div className="space-y-2">
          {SERVICE_TYPES.map((serviceType) => (
            <label key={serviceType} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={tempFilters.serviceTypes.includes(serviceType)}
                  onChange={(e) => handleServiceTypeChange(serviceType, e.target.checked)}
                  className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-text-soft text-sm">{serviceType}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.categories')}</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {serviceCatalog.map((category) => (
            <label key={category.id} className="flex items-start">
              <input
                type="checkbox"
                checked={tempFilters.categories.includes(category.id)}
                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">
                <span className="block text-text-light font-medium">{category.name}</span>
                <span className="block text-xs text-text-soft/80">{category.description}</span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {category.serviceTypes.map((type) => (
                    <span
                      key={`${category.id}-${type}`}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary"
                    >
                      {type}
                    </span>
                  ))}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.subcategories')}</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map((subcategory) => (
              <label key={subcategory.id} className="flex items-start">
                <input
                  type="checkbox"
                  checked={tempFilters.subcategories.includes(subcategory.id)}
                  onChange={(e) => handleSubcategoryChange(subcategory.id, e.target.checked)}
                  className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-text-soft text-sm">
                  <span className="block text-text-light font-medium">{subcategory.name}</span>
                  <span className="block text-xs text-text-soft/80">{subcategory.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Types */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.types')}</h3>
        <div className="space-y-2">
          {(['producto', 'servicio'] as const).map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={tempFilters.types.includes(type)}
                onChange={(e) => handleTypeChange(type, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">
                {type === 'producto' ? t('filters.product') : t('filters.service')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.locations')}</h3>
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
        <h3 className="text-lg font-semibold text-text-light mb-4">{t('filters.priceRange')}</h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder={t('filters.min')}
              value={tempFilters.priceRange[0] || ''}
              onChange={(e) => handlePriceRangeChange([
                parseInt(e.target.value) || 0,
                tempFilters.priceRange[1]
              ])}
              className="input-field w-full"
            />
            <input
              type="number"
              placeholder={t('filters.max')}
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
        <button onClick={applyFilters} className="btn-primary w-full">
          {t('filters.apply')}
        </button>
        <button onClick={clearFilters} className="btn-outline w-full">
          {t('filters.clear')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-light-bg border-r border-gray-light p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-light">{t('filters.title')}</h2>
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
              <h2 className="text-xl font-bold text-text-light">{t('filters.title')}</h2>
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
