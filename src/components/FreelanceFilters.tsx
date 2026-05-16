'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  freelanceCatalog,
  localize,
  getFreelanceCategoryById,
} from '@/lib/catalog/freelanceCategories';
import {
  DEFAULT_FREELANCE_FILTERS,
  SELLER_LEVELS,
  type FreelanceFilterState,
  type Locale,
  type SellerLevel,
} from '@/types/freelance';

interface FreelanceFiltersProps {
  value: FreelanceFilterState;
  onChange: (next: FreelanceFilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const DELIVERY_OPTIONS: Array<{ key: string; value: number | null }> = [
  { key: 'deliveryAny', value: null },
  { key: 'delivery1', value: 1 },
  { key: 'delivery3', value: 3 },
  { key: 'delivery7', value: 7 },
];

const RATING_OPTIONS = [0, 3, 4, 4.5];

const FreelanceFilters = ({ value, onChange, isOpen = false, onClose }: FreelanceFiltersProps) => {
  const { t, locale } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';
  const [draft, setDraft] = useState<FreelanceFilterState>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const availableSubcategories = useMemo(() => {
    return draft.categories.flatMap((id) => {
      const cat = getFreelanceCategoryById(id);
      return cat ? cat.subcategories.map((sub) => ({ ...sub, categoryId: id })) : [];
    });
  }, [draft.categories]);

  const toggleCategory = (id: string, checked: boolean) => {
    setDraft((prev) => {
      const cats = checked ? [...prev.categories, id] : prev.categories.filter((c) => c !== id);
      const allowedSubIds = cats.flatMap(
        (c) => getFreelanceCategoryById(c)?.subcategories.map((s) => s.id) ?? []
      );
      return {
        ...prev,
        categories: cats,
        subcategories: prev.subcategories.filter((s) => allowedSubIds.includes(s)),
      };
    });
  };

  const toggleSubcategory = (id: string, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      subcategories: checked
        ? [...prev.subcategories, id]
        : prev.subcategories.filter((s) => s !== id),
    }));
  };

  const toggleLevel = (level: SellerLevel, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      sellerLevels: checked
        ? [...prev.sellerLevels, level]
        : prev.sellerLevels.filter((l) => l !== level),
    }));
  };

  const toggleLanguage = (lang: Locale, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      languages: checked ? [...prev.languages, lang] : prev.languages.filter((l) => l !== lang),
    }));
  };

  const setDelivery = (days: number | null) => {
    setDraft((prev) => ({ ...prev, deliveryMaxDays: days }));
  };

  const setBudget = (next: [number, number]) => {
    setDraft((prev) => ({ ...prev, budgetUSD: next }));
  };

  const setMinRating = (rating: number) => {
    setDraft((prev) => ({ ...prev, minRating: rating }));
  };

  const apply = () => {
    onChange(draft);
    onClose?.();
  };

  const clear = () => {
    setDraft(DEFAULT_FREELANCE_FILTERS);
    onChange(DEFAULT_FREELANCE_FILTERS);
  };

  const FilterBody = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.categories')}</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {freelanceCatalog.map((category) => (
            <label key={category.id} className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={draft.categories.includes(category.id)}
                onChange={(e) => toggleCategory(category.id, e.target.checked)}
                className="w-4 h-4 mt-0.5 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">
                <span className="block text-text-light font-medium">
                  {localize(category.name, activeLocale)}
                </span>
                <span className="block text-xs text-text-soft/80">
                  {localize(category.description, activeLocale)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.subcategories')}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map((sub) => (
              <label key={sub.id} className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.subcategories.includes(sub.id)}
                  onChange={(e) => toggleSubcategory(sub.id, e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-text-soft text-sm">
                  <span className="block text-text-light font-medium">
                    {localize(sub.name, activeLocale)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Seller Level */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.sellerLevel')}</h3>
        <div className="space-y-2">
          {SELLER_LEVELS.map((level) => (
            <label key={level} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={draft.sellerLevels.includes(level)}
                onChange={(e) => toggleLevel(level, e.target.checked)}
                className="w-4 h-4 text-primary bg-light-bg border-gray-light rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">{t(`sellerLevels.${level}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.languages')}</h3>
        <div className="flex gap-2">
          {(['es', 'en'] as Locale[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang, !draft.languages.includes(lang))}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                draft.languages.includes(lang)
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-gray-light text-text-soft hover:text-text-light'
              }`}
            >
              {lang === 'es' ? 'Español' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.deliveryTime')}</h3>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((opt) => (
            <label key={opt.key} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={draft.deliveryMaxDays === opt.value}
                onChange={() => setDelivery(opt.value)}
                className="w-4 h-4 text-primary border-gray-light focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-text-soft text-sm">{t(`filters.${opt.key}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.budget')}</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={draft.budgetUSD[0] || ''}
            onChange={(e) => setBudget([parseInt(e.target.value) || 0, draft.budgetUSD[1]])}
            className="input-field w-full"
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={draft.budgetUSD[1] || ''}
            onChange={(e) => setBudget([draft.budgetUSD[0], parseInt(e.target.value) || 5000])}
            className="input-field w-full"
          />
        </div>
        <p className="mt-1 text-xs text-text-soft text-center">
          ${draft.budgetUSD[0]} - ${draft.budgetUSD[1]} USD
        </p>
      </div>

      {/* Min rating */}
      <div>
        <h3 className="text-lg font-semibold text-text-light mb-3">{t('filters.minRating')}</h3>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                draft.minRating === r
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-gray-light text-text-soft hover:text-text-light'
              }`}
            >
              {r === 0 ? '—' : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-light">
        <button onClick={apply} className="btn-primary w-full">
          {t('filters.apply')}
        </button>
        <button onClick={clear} className="btn-outline w-full">
          {t('filters.clear')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-80 bg-light-bg border-r border-gray-light p-6 h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-text-light mb-6">{t('filters.title')}</h2>
        <FilterBody />
      </div>

      {/* Mobile modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="fixed top-0 left-0 w-80 h-full bg-light-bg p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">{t('filters.title')}</h2>
              <button onClick={onClose} className="p-2 text-text-soft hover:text-text-light">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterBody />
          </div>
        </div>
      )}
    </>
  );
};

export default FreelanceFilters;
