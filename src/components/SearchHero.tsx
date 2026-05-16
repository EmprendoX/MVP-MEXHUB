'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '@/contexts/TranslationContext';
import VerticalToggle, { type Vertical } from '@/components/VerticalToggle';

interface SearchHeroProps {
  initialVertical?: Vertical;
}

const SearchHero = ({ initialVertical = 'freelance' }: SearchHeroProps) => {
  const router = useRouter();
  const { t, locale } = useTranslation('freelance');
  const { t: tHome } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');
  const [vertical, setVertical] = useState<Vertical>(initialVertical);
  const [query, setQuery] = useState('');

  const placeholder =
    vertical === 'freelance' ? t('explore.searchPlaceholder') : tCommon('navbar.searchPlaceholder');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('v', vertical);
    if (query.trim()) params.set('q', query.trim());
    router.push(`/explore?${params.toString()}`, undefined, { locale });
  };

  return (
    <section className="relative bg-white border-b border-gray-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-semibold text-text-light mb-5 leading-[1.05] tracking-tight">
            {tHome('hero.title', { country: tHome('hero.highlight') }).split(tHome('hero.highlight'))[0]}
            <span className="text-accent">{tHome('hero.highlight')}</span>
            {tHome('hero.title', { country: tHome('hero.highlight') }).split(tHome('hero.highlight'))[1]}
          </h1>

          <p className="text-lg text-text-soft mb-10 max-w-2xl mx-auto">
            {t('verticalDescription')}
          </p>

          {/* Vertical toggle */}
          <div className="flex justify-center mb-6">
            <VerticalToggle value={vertical} onChange={setVertical} size="lg" />
          </div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative shadow-soft rounded-xl">
              <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 text-base bg-white text-text-light placeholder:text-text-soft border border-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-5 bg-primary hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors duration-150"
              >
                {tCommon('navbar.search')}
              </button>
            </div>
          </form>

          {/* Tagline */}
          <p className="mt-8 text-sm text-text-soft">{t('verticalTagline')}</p>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
