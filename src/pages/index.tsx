import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SearchHero from '@/components/SearchHero';
import CardItem from '@/components/CardItem';
import GigCard from '@/components/GigCard';
import HorizontalCarousel from '@/components/HorizontalCarousel';
import Footer from '@/components/Footer';
import type { GetStaticPropsContext } from 'next';
import { getFeaturedListingsForCards } from '@/lib/api/listings';
import type { CardItemListing } from '@/lib/api/listings';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import { freelanceCatalog, localize } from '@/lib/catalog/freelanceCategories';
import { getTopGigs, getGigsByCategory } from '@/lib/mocks/gigsMock';
import type { Gig, Locale } from '@/types/freelance';

const CATEGORY_PREVIEW_IDS = ['graphic-design', 'programming-tech', 'digital-marketing'];

interface CategoryPreview {
  categoryId: string;
  gigs: Gig[];
}

interface HomeProps {
  featuredProducts: CardItemListing[];
  topGigs: Gig[];
  categoryPreviews: CategoryPreview[];
  translations?: Record<string, Record<string, unknown>>;
}

export default function Home({ featuredProducts, topGigs, categoryPreviews }: HomeProps) {
  const { t } = useTranslation('home');
  const { t: tCommon, locale } = useTranslation('common');
  const { t: tFreelance } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        {/* Hero with vertical toggle + search */}
        <SearchHero initialVertical="freelance" />

        {/* Freelance Categories grid */}
        <section className="py-16 bg-dark-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-3">
                {tFreelance('home.categoriesSection.title')}{' '}
                <span className="text-gradient">{tFreelance('home.categoriesSection.highlight')}</span>
              </h2>
              <p className="text-text-soft max-w-2xl mx-auto">{tFreelance('home.categoriesSection.description')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {freelanceCatalog.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  href={`/explore?v=freelance&cat=${category.id}`}
                  locale={locale}
                  className="card-hover flex flex-col items-center text-center p-5 hover:border-primary transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mb-3">
                    <CategoryIcon name={category.icon} />
                  </div>
                  <h3 className="text-text-light text-sm font-medium leading-tight">
                    {localize(category.name, activeLocale)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Freelance Top Gigs */}
        <section className="py-16 bg-light-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-2">
                  {tFreelance('home.freelanceSection.title')}{' '}
                  <span className="text-gradient">{tFreelance('home.freelanceSection.highlight')}</span>
                </h2>
                <p className="text-text-soft max-w-2xl">{tFreelance('home.freelanceSection.description')}</p>
              </div>
              <Link
                href="/explore?v=freelance"
                locale={locale}
                className="btn-outline self-start md:self-auto whitespace-nowrap"
              >
                {tFreelance('home.freelanceSection.viewAll')}
              </Link>
            </div>

            <HorizontalCarousel>
              {topGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Most popular per category */}
        {categoryPreviews.map((preview) => {
          const cat = freelanceCatalog.find((c) => c.id === preview.categoryId);
          if (!cat || preview.gigs.length === 0) return null;
          return (
            <section key={preview.categoryId} className="py-12 bg-dark-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-6 gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-text-light">
                    {tFreelance('home.popularIn', { category: localize(cat.name, activeLocale) })}
                  </h2>
                  <Link
                    href={`/explore?v=freelance&cat=${cat.id}`}
                    locale={locale}
                    className="text-accent hover:underline text-sm font-medium whitespace-nowrap"
                  >
                    {tFreelance('home.seeAllIn')} →
                  </Link>
                </div>
                <HorizontalCarousel>
                  {preview.gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </HorizontalCarousel>
              </div>
            </section>
          );
        })}

        {/* Why Mexican talent */}
        <section className="py-16 bg-dark-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-3">
                {tFreelance('home.whyMexico.title')}{' '}
                <span className="text-gradient">{tFreelance('home.whyMexico.highlight')}</span>?
              </h2>
              <p className="text-text-soft max-w-2xl mx-auto">{tFreelance('home.whyMexico.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['timezone', 'bilingual', 'quality', 'price'] as const).map((key) => (
                <div key={key} className="card text-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <WhyIcon name={key} />
                  </div>
                  <h3 className="text-text-light font-semibold mb-2">
                    {tFreelance(`home.whyMexico.items.${key}.title`)}
                  </h3>
                  <p className="text-text-soft text-sm">
                    {tFreelance(`home.whyMexico.items.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Featured (kept) */}
        <section className="py-16 bg-light-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-2">
                  {t('featured.title')} <span className="text-gradient">{t('featured.highlight')}</span>
                </h2>
                <p className="text-text-soft max-w-2xl">{t('featured.description')}</p>
              </div>
              <Link
                href="/explore?v=manufacturing"
                locale={locale}
                className="btn-outline self-start md:self-auto whitespace-nowrap"
              >
                {tCommon('buttons.viewAllProducts')}
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <CardItem key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-light-bg rounded-2xl border border-gray-light">
                <h3 className="text-xl font-semibold text-text-light mb-2">{t('emptyFeatured.title')}</h3>
                <p className="text-text-soft max-w-2xl mx-auto">{tCommon('statuses.featuredDescription')}</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">{t('cta.title')}</h2>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">{t('cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/freelance/publish"
                locale={locale}
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-600 text-white font-medium py-3 px-7 rounded-lg transition-colors duration-150"
              >
                {tCommon('buttons.publishProduct')}
              </Link>
              <Link
                href="/explore?v=freelance"
                locale={locale}
                className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 font-medium py-3 px-7 rounded-lg transition-colors duration-150"
              >
                {tCommon('buttons.exploreOpportunities')}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const common = 'w-6 h-6 text-primary';
  switch (name) {
    case 'palette':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'code':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'pen':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'video':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'music':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'database':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'camera':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function WhyIcon({ name }: { name: 'timezone' | 'bilingual' | 'quality' | 'price' }) {
  const common = 'w-7 h-7 text-dark';
  switch (name) {
    case 'timezone':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'bilingual':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      );
    case 'quality':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'price':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const result = await getFeaturedListingsForCards(6);
  const translations = await loadTranslations(locale, ['common', 'home', 'freelance']);

  if (!result.success) {
    console.error('Error cargando destacados para la página principal:', result.error);
  }

  const categoryPreviews: CategoryPreview[] = CATEGORY_PREVIEW_IDS.map((id) => ({
    categoryId: id,
    gigs: getGigsByCategory(id).slice(0, 8),
  })).filter((p) => p.gigs.length > 0);

  return {
    props: {
      featuredProducts: result.success && result.data ? result.data : [],
      topGigs: getTopGigs(8),
      categoryPreviews,
      translations,
    },
    revalidate: 300,
  };
}
