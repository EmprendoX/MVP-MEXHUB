import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GigCard from '@/components/GigCard';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import { getFavorites, subscribeFavorites } from '@/lib/storage/favoritesStore';
import { gigsMock } from '@/lib/mocks/gigsMock';
import { getLocalGigs, subscribeLocalGigs } from '@/lib/storage/localGigsStore';
import type { Gig } from '@/types/freelance';

export default function FavoritesPage() {
  const { t, locale } = useTranslation('freelance');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [localGigs, setLocalGigs] = useState<Gig[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteIds(getFavorites());
    setLocalGigs(getLocalGigs());
    const unsubFav = subscribeFavorites(() => setFavoriteIds(getFavorites()));
    const unsubGigs = subscribeLocalGigs(() => setLocalGigs(getLocalGigs()));
    return () => {
      unsubFav();
      unsubGigs();
    };
  }, []);

  const allGigs = [...localGigs, ...gigsMock];
  const favorites = mounted ? allGigs.filter((g) => favoriteIds.includes(g.id)) : [];

  return (
    <>
      <Head>
        <title>{`${t('favorites.title')} | HUBMEX`}</title>
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light mb-8">{t('favorites.title')}</h1>

          {!mounted ? (
            <div className="text-text-soft">…</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-text-soft mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-text-light mb-2">{t('favorites.empty')}</h2>
              <p className="text-text-soft mb-6">{t('favorites.emptyDescription')}</p>
              <Link href="/explore?v=freelance" locale={locale} className="btn-primary inline-block">
                {t('favorites.browse')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'freelance']);
  return { props: { translations } };
}
