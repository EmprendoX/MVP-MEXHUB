'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

const Hero = () => {
  const { t, locale } = useTranslation('home');
  const [searchQuery, setSearchQuery] = useState('');

  const countryHighlight = t('hero.highlight');
  const heroTitle = useMemo(() => t('hero.title', { country: countryHighlight }), [countryHighlight, t]);
  const [titlePrefix, titleSuffix] = useMemo(() => {
    const parts = heroTitle.split(countryHighlight);
    if (parts.length === 2) {
      return parts as [string, string];
    }
    return [heroTitle, ''];
  }, [heroTitle, countryHighlight]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const queryParam = encodeURIComponent(searchQuery);
      const baseUrl = locale === 'en' ? '/en/explore' : '/explore';
      window.location.href = `${baseUrl}?q=${queryParam}`;
    }
  };

  return (
    <section className="relative bg-light-bg border-b border-gray-light overflow-hidden">
      {/* Sutil textura verde en el fondo */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(29,191,115,0.10), transparent 40%), radial-gradient(circle at 80% 80%, rgba(29,191,115,0.08), transparent 45%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-light mb-6 leading-tight">
            {titlePrefix}
            <span className="text-primary">{countryHighlight}</span>
            {titleSuffix}
          </h1>

          <p className="text-lg md:text-xl text-text-soft mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mb-10">
            <div className="relative">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-4 text-base rounded-xl bg-white text-text-light placeholder-text-soft border border-gray-light shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                {t('hero.search')}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/explore" locale={locale} className="btn-primary text-base px-6 py-3">
              {t('hero.exploreProducts')}
            </Link>
            <Link href="/publish" locale={locale} className="btn-outline text-base px-6 py-3">
              {t('hero.publishProduct')}
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
          <Stat value="500+" label={t('hero.stats.manufacturers')} />
          <Stat value="1,200+" label={t('hero.stats.products')} />
          <Stat value="50+" label={t('hero.stats.categories')} />
          <Stat value="24/7" label={t('hero.stats.availability')} />
        </div>
      </div>
    </section>
  );
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-text-light mb-1">{value}</div>
      <div className="text-text-soft text-sm">{label}</div>
    </div>
  );
}

export default Hero;
