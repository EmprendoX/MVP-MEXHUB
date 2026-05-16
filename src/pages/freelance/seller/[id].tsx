import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GigCard from '@/components/GigCard';
import RatingStars from '@/components/RatingStars';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import {
  allSellers,
  getSellerById,
  getGigsBySellerId,
} from '@/lib/mocks/gigsMock';
import { localize } from '@/lib/catalog/freelanceCategories';
import type { Gig, Locale, SellerProfile } from '@/types/freelance';

interface SellerProfileProps {
  seller: SellerProfile | null;
  gigs: Gig[];
}

const levelColor: Record<string, string> = {
  new: 'bg-gray-light/20 text-text-soft',
  level1: 'bg-primary/15 text-primary',
  level2: 'bg-primary/25 text-primary',
  top: 'bg-success/20 text-success',
};

export default function SellerProfilePage({ seller, gigs }: SellerProfileProps) {
  const { t, locale } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';

  if (!seller) {
    return (
      <>
        <Head>
          <title>{`${t('sellerProfile.notFound')} | HUBMEX`}</title>
        </Head>
        <div className="min-h-screen bg-dark-500">
          <Navbar />
          <div className="max-w-3xl mx-auto px-4 py-32 text-center">
            <h1 className="text-3xl font-bold text-text-light mb-3">{t('sellerProfile.notFound')}</h1>
            <p className="text-text-soft mb-6">{t('sellerProfile.notFoundDescription')}</p>
            <Link href="/explore?v=freelance" locale={locale} className="btn-primary inline-block">
              {t('gigDetail.browseAll')}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const aggregateReviews = gigs.reduce((acc, g) => acc + g.reviewsCount, 0);

  return (
    <>
      <Head>
        <title>{`${seller.name} | HUBMEX`}</title>
        <meta name="description" content={localize(seller.tagline, activeLocale)} />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        {/* Cover */}
        <div className="bg-light-bg border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-primary flex-shrink-0 border-4 border-light-bg">
                <Image
                  src={seller.avatarUrl}
                  alt={seller.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-text-light">{seller.name}</h1>
                  <span
                    className={`px-3 py-1 text-xs rounded-full uppercase tracking-wide font-medium ${levelColor[seller.level]}`}
                  >
                    {t(`sellerLevels.${seller.level}`)}
                  </span>
                </div>
                <p className="text-text-soft text-lg mb-4 max-w-2xl">
                  {localize(seller.tagline, activeLocale)}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <RatingStars value={seller.rating} size="sm" />
                    <span className="text-text-light font-semibold ml-1">{seller.rating.toFixed(1)}</span>
                    <span className="text-text-soft">({seller.reviewsCount})</span>
                  </span>
                  <span className="text-text-soft" aria-hidden="true">·</span>
                  <span className="text-text-soft">🇲🇽 {seller.city || seller.country}</span>
                </div>
              </div>
              <button className="btn-primary md:self-start">{t('sellerProfile.contact')}</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="card">
                <h2 className="text-text-light font-semibold mb-4">{t('sellerProfile.about')}</h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-text-soft">{t('sellerProfile.languages')}</dt>
                    <dd className="text-text-light">
                      {seller.languages.map((l) => (l === 'es' ? 'Español' : 'English')).join(' · ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">{t('sellerProfile.memberSince')}</dt>
                    <dd className="text-text-light">{seller.memberSince}</dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">{t('sellerProfile.responseTime')}</dt>
                    <dd className="text-text-light">{t('sellerProfile.responseHours', { hours: 2 })}</dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">{t('sellerProfile.ordersCompleted')}</dt>
                    <dd className="text-text-light">{aggregateReviews}</dd>
                  </div>
                </dl>
              </div>
            </aside>

            {/* Active gigs */}
            <main className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-text-light mb-6">
                {t('sellerProfile.activeGigs')} ({gigs.length})
              </h2>
              {gigs.length === 0 ? (
                <p className="text-text-soft">{t('sellerProfile.noGigs')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = allSellers.flatMap((seller) =>
    (locales || ['es']).map((locale) => ({
      params: { id: seller.id },
      locale,
    }))
  );
  return { paths, fallback: 'blocking' };
};

export async function getStaticProps({ params, locale }: GetStaticPropsContext) {
  const id = params?.id as string;
  const seller = getSellerById(id) || null;
  const gigs = seller ? getGigsBySellerId(seller.id) : [];
  const translations = await loadTranslations(locale, ['common', 'freelance']);

  return {
    props: { seller, gigs, translations },
    revalidate: 300,
  };
}
