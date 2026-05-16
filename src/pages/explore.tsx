import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Filters, { FilterState } from '@/components/Filters';
import FreelanceFilters from '@/components/FreelanceFilters';
import CardItem from '@/components/CardItem';
import GigCard from '@/components/GigCard';
import GigCardSkeleton from '@/components/GigCardSkeleton';
import Footer from '@/components/Footer';
import VerticalToggle, { type Vertical } from '@/components/VerticalToggle';
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
import { gigsMock } from '@/lib/mocks/gigsMock';
import { localize, getFreelanceCategoryById } from '@/lib/catalog/freelanceCategories';
import {
  DEFAULT_FREELANCE_FILTERS,
  type FreelanceFilterState,
  type Locale,
} from '@/types/freelance';
import type { GetStaticPropsContext } from 'next';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

const PAGE_SIZE = 24;
const DEBOUNCE_MS = 300;

export default function Explore() {
  const router = useRouter();
  const { t } = useTranslation('explore');
  const { t: tCommon, locale } = useTranslation('common');
  const { t: tFreelance } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';

  // Vertical from URL (defaults to freelance, the new flagship)
  const [vertical, setVertical] = useState<Vertical>('freelance');

  // Search
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Mobile filter modal
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Manufacturing filters (existing)
  const [mfgFilters, setMfgFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    serviceTypes: [],
    locations: [],
    types: [],
    priceRange: [0, 10000000],
  });

  // Freelance filters
  const [flFilters, setFlFilters] = useState<FreelanceFilterState>(DEFAULT_FREELANCE_FILTERS);
  const [flSort, setFlSort] = useState<'relevance' | 'priceLow' | 'priceHigh' | 'rating' | 'newest' | 'deliveryFast'>('relevance');

  // Manufacturing data
  const [listings, setListings] = useState<CardItemListing[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Read URL params on mount / change
  useEffect(() => {
    if (!router.isReady) return;
    const v = router.query.v;
    if (v === 'manufacturing' || v === 'freelance') {
      setVertical(v);
    }
    if (typeof router.query.q === 'string') {
      setSearchInput(router.query.q);
      setDebouncedQuery(router.query.q);
    }
    if (typeof router.query.cat === 'string') {
      setFlFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(router.query.cat as string)
          ? prev.categories
          : [...prev.categories, router.query.cat as string],
      }));
    }
  }, [router.isReady, router.query.v, router.query.q, router.query.cat]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // --- Manufacturing flow ---

  const categoryFilters = useMemo(() => {
    const set = new Set<string>();
    mfgFilters.categories.forEach((id) => {
      const c = getCategoryById(id);
      if (c) set.add(c.name);
    });
    mfgFilters.subcategories.forEach((id) => {
      const info = getSubcategoryById(id);
      if (info) set.add(info.category.name);
    });
    if (mfgFilters.serviceTypes.length > 0) {
      serviceCatalog.forEach((c) => {
        if (c.serviceTypes.some((t) => mfgFilters.serviceTypes.includes(t))) set.add(c.name);
      });
    }
    return Array.from(set);
  }, [mfgFilters.categories, mfgFilters.subcategories, mfgFilters.serviceTypes]);

  const apiFilters = useMemo<ListingFilters>(() => {
    const f: ListingFilters = {};
    if (debouncedQuery) f.searchQuery = debouncedQuery;
    if (mfgFilters.types.length > 0) f.tipo = mfgFilters.types;
    if (mfgFilters.locations.length > 0) f.ubicacion = mfgFilters.locations;
    if (mfgFilters.priceRange[0] > 0) f.priceMin = mfgFilters.priceRange[0];
    if (mfgFilters.priceRange[1] < 10000000) f.priceMax = mfgFilters.priceRange[1];
    if (categoryFilters.length > 0) f.categoria = categoryFilters;
    return f;
  }, [
    debouncedQuery,
    mfgFilters.types,
    mfgFilters.locations,
    mfgFilters.priceRange,
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
            if (reset) return data;
            const ids = new Set(prev.map((l) => l.id));
            const merged = [...prev];
            data.forEach((item) => {
              if (!ids.has(item.id)) merged.push(item);
            });
            return merged;
          });
          setCurrentPage(pageToLoad);
        } else {
          setError(result.error || 'Error');
          if (reset) {
            setListings([]);
            setHasMore(false);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error');
        if (reset) {
          setListings([]);
          setHasMore(false);
        }
      } finally {
        if (reset) setIsInitialLoading(false);
        else setLoadingMore(false);
      }
    },
    [apiFilters]
  );

  useEffect(() => {
    if (vertical === 'manufacturing') fetchListings(0, true);
  }, [vertical, fetchListings]);

  // --- Freelance flow (in-memory filtering of mocks) ---

  const filteredGigs = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    const filtered = gigsMock.filter((gig) => {
      if (q) {
        const hay = [
          gig.title.es,
          gig.title.en,
          gig.description.es,
          gig.description.en,
          ...gig.tags,
          gig.seller.name,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (flFilters.categories.length > 0 && !flFilters.categories.includes(gig.categoryId)) {
        return false;
      }
      if (flFilters.subcategories.length > 0 && !flFilters.subcategories.includes(gig.subcategoryId)) {
        return false;
      }
      if (flFilters.sellerLevels.length > 0 && !flFilters.sellerLevels.includes(gig.seller.level)) {
        return false;
      }
      if (
        flFilters.languages.length > 0 &&
        !flFilters.languages.some((l) => gig.seller.languages.includes(l))
      ) {
        return false;
      }
      if (
        flFilters.deliveryMaxDays !== null &&
        gig.packages.basic.deliveryDays > flFilters.deliveryMaxDays
      ) {
        return false;
      }
      const price = gig.packages.basic.priceUSD;
      if (price < flFilters.budgetUSD[0] || price > flFilters.budgetUSD[1]) return false;
      if (gig.rating < flFilters.minRating) return false;
      return true;
    });

    switch (flSort) {
      case 'priceLow':
        return [...filtered].sort((a, b) => a.packages.basic.priceUSD - b.packages.basic.priceUSD);
      case 'priceHigh':
        return [...filtered].sort((a, b) => b.packages.basic.priceUSD - a.packages.basic.priceUSD);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'deliveryFast':
        return [...filtered].sort((a, b) => a.packages.basic.deliveryDays - b.packages.basic.deliveryDays);
      default:
        return filtered;
    }
  }, [debouncedQuery, flFilters, flSort]);

  // Show skeletons briefly when query/filters change
  const [showFlSkeleton, setShowFlSkeleton] = useState(false);
  useEffect(() => {
    if (vertical !== 'freelance') return;
    setShowFlSkeleton(true);
    const timer = setTimeout(() => setShowFlSkeleton(false), 200);
    return () => clearTimeout(timer);
  }, [debouncedQuery, flFilters, flSort, vertical]);

  // --- URL sync on vertical change ---

  const handleVerticalChange = (next: Vertical) => {
    setVertical(next);
    router.push(
      { pathname: '/explore', query: { v: next, ...(debouncedQuery ? { q: debouncedQuery } : {}) } },
      undefined,
      { shallow: true, locale }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchInput.trim());
    router.push(
      {
        pathname: '/explore',
        query: { v: vertical, ...(searchInput.trim() ? { q: searchInput.trim() } : {}) },
      },
      undefined,
      { shallow: true, locale }
    );
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchListings(currentPage + 1, false);
  };

  const getMfgActiveCount = () =>
    mfgFilters.categories.length +
    mfgFilters.subcategories.length +
    mfgFilters.serviceTypes.length +
    mfgFilters.locations.length +
    mfgFilters.types.length +
    (mfgFilters.priceRange[0] > 0 || mfgFilters.priceRange[1] < 10000000 ? 1 : 0);

  const getFlActiveCount = () =>
    flFilters.categories.length +
    flFilters.subcategories.length +
    flFilters.sellerLevels.length +
    flFilters.languages.length +
    (flFilters.deliveryMaxDays !== null ? 1 : 0) +
    (flFilters.budgetUSD[0] > 0 || flFilters.budgetUSD[1] < 5000 ? 1 : 0) +
    (flFilters.minRating > 0 ? 1 : 0);

  const activeFiltersCount = vertical === 'freelance' ? getFlActiveCount() : getMfgActiveCount();

  const resultsSummary = () => {
    if (vertical === 'freelance') {
      const count = filteredGigs.length;
      const suffix = count === 1 ? '' : 's';
      const summary = t('search.results', { count, suffix });
      return debouncedQuery ? `${summary}${t('search.forQuery', { query: debouncedQuery })}` : summary;
    }
    if (isInitialLoading) return tCommon('statuses.loading');
    const suffix = listings.length === 1 ? '' : 's';
    const summary = t('search.results', { count: listings.length, suffix });
    return debouncedQuery ? `${summary}${t('search.forQuery', { query: debouncedQuery })}` : summary;
  };

  const searchPlaceholder =
    vertical === 'freelance'
      ? tFreelance('explore.searchPlaceholder')
      : tCommon('navbar.searchPlaceholder');

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        {/* Search header */}
        <div className="bg-light-bg border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Vertical toggle */}
            <div className="flex justify-center md:justify-start mb-5">
              <VerticalToggle value={vertical} onChange={handleVerticalChange} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="input-field w-full pl-12 pr-4"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>

              <button
                onClick={() => setIsFiltersOpen(true)}
                className="md:hidden btn-outline flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                {t('search.mobileFilters')}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active category chips (freelance) */}
            {vertical === 'freelance' && flFilters.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {flFilters.categories.map((id) => {
                  const cat = getFreelanceCategoryById(id);
                  if (!cat) return null;
                  return (
                    <button
                      key={id}
                      onClick={() =>
                        setFlFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.filter((c) => c !== id),
                          subcategories: [],
                        }))
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/15 text-primary text-xs rounded-full hover:bg-primary/25"
                    >
                      {localize(cat.name, activeLocale)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <p className="text-text-soft">{resultsSummary()}</p>
              {vertical === 'freelance' ? (
                <div className="flex items-center space-x-2 text-sm text-text-soft">
                  <span>{tFreelance('sort.label')}</span>
                  <select
                    value={flSort}
                    onChange={(e) => setFlSort(e.target.value as typeof flSort)}
                    className="bg-white border border-gray-light rounded px-3 py-1 text-text-light"
                  >
                    <option value="relevance">{tFreelance('sort.options.relevance')}</option>
                    <option value="priceLow">{tFreelance('sort.options.priceLow')}</option>
                    <option value="priceHigh">{tFreelance('sort.options.priceHigh')}</option>
                    <option value="rating">{tFreelance('sort.options.rating')}</option>
                    <option value="newest">{tFreelance('sort.options.newest')}</option>
                    <option value="deliveryFast">{tFreelance('sort.options.deliveryFast')}</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-text-soft">
                  <span>{t('sort.label')}</span>
                  <select className="bg-white border border-gray-light rounded px-3 py-1 text-text-light">
                    <option value="recent">{t('sort.options.recent')}</option>
                    <option value="price-low">{t('sort.options.priceLow')}</option>
                    <option value="price-high">{t('sort.options.priceHigh')}</option>
                    <option value="name">{t('sort.options.name')}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex">
          {vertical === 'manufacturing' ? (
            <Filters onFiltersChange={setMfgFilters} />
          ) : (
            <FreelanceFilters value={flFilters} onChange={setFlFilters} />
          )}

          <div className="flex-1 p-6">
            {vertical === 'manufacturing' ? (
              isInitialLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-text-soft">{tCommon('statuses.loadingListings')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-text-light mb-2">{t('error.title')}</h3>
                  <p className="text-text-soft mb-6">{error}</p>
                  <button onClick={() => fetchListings(0, true)} className="btn-primary">
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
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-text-light mb-2">{t('empty.title')}</h3>
                  <p className="text-text-soft mb-6">{t('empty.description')}</p>
                </div>
              )
            ) : showFlSkeleton ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <GigCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-text-light mb-2">{t('empty.title')}</h3>
                <p className="text-text-soft mb-6">{t('empty.description')}</p>
                <button
                  onClick={() => {
                    setSearchInput('');
                    setDebouncedQuery('');
                    setFlFilters(DEFAULT_FREELANCE_FILTERS);
                  }}
                  className="btn-primary"
                >
                  {tCommon('buttons.clearSearch')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile filters */}
        {vertical === 'manufacturing' ? (
          <Filters
            onFiltersChange={setMfgFilters}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        ) : (
          <FreelanceFilters
            value={flFilters}
            onChange={setFlFilters}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        )}

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'explore', 'freelance']);
  return { props: { translations } };
}
