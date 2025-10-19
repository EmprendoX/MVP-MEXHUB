import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Filters, { FilterState } from '@/components/Filters';
import CardItem from '@/components/CardItem';
import Footer from '@/components/Footer';
import {
  getListingsWithProvider,
  formatListingForCardItem,
  type ListingFilters,
  type CardItemListing,
} from '@/lib/api/listings';
import {
  serviceCatalog,
  getCategoryById,
  getSubcategoryById,
} from '@/lib/catalog/serviceCategories';
import type { GetStaticPropsContext } from 'next';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

const PAGE_SIZE = 24;

export default function Explore() {
  const router = useRouter();
  const { t } = useTranslation('explore');
  const { t: tCommon } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    serviceTypes: [],
    locations: [],
    types: [],
    priceRange: [0, 10000000],
  });

  // Estado para listings reales de Supabase
  const [listings, setListings] = useState<CardItemListing[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Get search query from URL on mount
  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q as string);
    }
  }, [router.query.q]);

  const categoryFilters = useMemo(() => {
    const categoryFiltersSet = new Set<string>();

    filters.categories.forEach((categoryId) => {
      const category = getCategoryById(categoryId);
      if (category) {
        categoryFiltersSet.add(category.name);
      }
    });

    filters.subcategories.forEach((subcategoryId) => {
      const info = getSubcategoryById(subcategoryId);
      if (info) {
        categoryFiltersSet.add(info.category.name);
      }
    });

    if (filters.serviceTypes.length > 0) {
      serviceCatalog.forEach((category) => {
        if (category.serviceTypes.some((type) => filters.serviceTypes.includes(type))) {
          categoryFiltersSet.add(category.name);
        }
      });
    }

    return Array.from(categoryFiltersSet);
  }, [filters.categories, filters.subcategories, filters.serviceTypes]);

  const apiFilters = useMemo<ListingFilters>(() => {
    const computedFilters: ListingFilters = {};

    if (searchQuery.trim()) {
      computedFilters.searchQuery = searchQuery.trim();
    }

    if (filters.types.length > 0) {
      computedFilters.tipo = filters.types;
    }

    if (filters.locations.length > 0) {
      computedFilters.ubicacion = filters.locations;
    }

    if (filters.priceRange[0] > 0) {
      computedFilters.priceMin = filters.priceRange[0];
    }

    if (filters.priceRange[1] < 10000000) {
      computedFilters.priceMax = filters.priceRange[1];
    }

    if (categoryFilters.length > 0) {
      computedFilters.categoria = categoryFilters;
    }

    return computedFilters;
  }, [
    searchQuery,
    filters.types,
    filters.locations,
    filters.priceRange,
    categoryFilters,
  ]);

  const fetchListings = useCallback(
    async (pageToLoad: number, reset: boolean) => {
      if (reset) {
        setIsInitialLoading(true);
        setError(null);
        setListings([]);
        setHasMore(true);
        setCurrentPage(0);
      } else {
        setLoadingMore(true);
      }

      try {
        const offset = pageToLoad * PAGE_SIZE;
        const result = await getListingsWithProvider(apiFilters, PAGE_SIZE, offset);

        if (result.success) {
          const data = (result.data || []).map(formatListingForCardItem);
          setHasMore(data.length === PAGE_SIZE);
          setListings((prev) => {
            if (reset) {
              return data;
            }

            const existingIds = new Set(prev.map((item) => item.id));
            const merged = [...prev];
            data.forEach((item) => {
              if (!existingIds.has(item.id)) {
                merged.push(item);
              }
            });
            return merged;
          });
          setCurrentPage(pageToLoad);
        } else {
          setError(result.error || t('error.title'));
          if (reset) {
            setListings([]);
            setHasMore(false);
          }
        }
      } catch (err: any) {
        setError(err.message || tCommon('statuses.unexpectedError'));
        if (reset) {
          setListings([]);
          setHasMore(false);
        }
      } finally {
        if (reset) {
          setIsInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [apiFilters, t, tCommon]
  );

  useEffect(() => {
    fetchListings(0, true);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) {
      return;
    }
    fetchListings(currentPage + 1, false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        {
          pathname: '/explore',
          query: { q: searchQuery.trim() },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.subcategories.length +
      filters.serviceTypes.length +
      filters.locations.length +
      filters.types.length +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0)
    );
  };

  const resultsSummary = () => {
    if (isInitialLoading) {
      return tCommon('statuses.loading');
    }
    const suffix = listings.length === 1 ? '' : 's';
    const summary = t('search.results', { count: listings.length, suffix });
    return searchQuery ? `${summary}${t('search.forQuery', { query: searchQuery })}` : summary;
  };

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

        {/* Search Header */}
        <div className="bg-light-bg border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={tCommon('navbar.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-full pl-12 pr-4"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label={tCommon('navbar.search')}>
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
                {t('search.mobileFilters')}
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-text-soft">{resultsSummary()}</p>
              <div className="flex items-center space-x-2 text-sm text-text-soft">
                <span>{t('sort.label')}</span>
                <select className="bg-light-bg border border-gray-light rounded px-3 py-1 text-text-light">
                  <option value="recent">{t('sort.options.recent')}</option>
                  <option value="price-low">{t('sort.options.priceLow')}</option>
                  <option value="price-high">{t('sort.options.priceHigh')}</option>
                  <option value="name">{t('sort.options.name')}</option>
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
            {isInitialLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-soft">{tCommon('statuses.loadingListings')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <svg className="w-24 h-24 text-alert mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-text-light mb-2">{t('error.title')}</h3>
                <p className="text-text-soft mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  {tCommon('buttons.retry')}
                </button>
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <CardItem key={listing.id} {...listing} />
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      className="btn-outline px-8 py-3"
                      disabled={loadingMore}
                    >
                      {loadingMore ? t('cta.loading') : t('cta.loadMore')}
                    </button>
                  </div>
                )}
                {!hasMore && listings.length >= PAGE_SIZE && (
                  <p className="text-center text-text-soft mt-10">{tCommon('statuses.noMoreResults')}</p>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <svg className="w-24 h-24 text-text-soft mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-text-light mb-2">{t('empty.title')}</h3>
                <p className="text-text-soft mb-6">{t('empty.description')}</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      subcategories: [],
                      serviceTypes: [],
                      locations: [],
                      types: [],
                      priceRange: [0, 10000000],
                    });
                  }}
                  className="btn-primary"
                >
                  {tCommon('buttons.clearSearch')}
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'explore']);

  return {
    props: {
      translations,
    },
  };
}
