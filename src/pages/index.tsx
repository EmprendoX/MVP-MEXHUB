import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CardItem from '@/components/CardItem';
import Footer from '@/components/Footer';
import type { GetStaticPropsContext } from 'next';
import { getFeaturedListingsForCards } from '@/lib/api/listings';
import type { CardItemListing } from '@/lib/api/listings';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

interface HomeProps {
  featuredProducts: CardItemListing[];
  translations?: Record<string, Record<string, unknown>>;
}

export default function Home({ featuredProducts }: HomeProps) {
  const { t } = useTranslation('home');
  const { t: tCommon, locale } = useTranslation('common');

  const featuredTitle = t('featured.title');
  const featuredHighlight = t('featured.highlight');
  const howTitle = t('howItWorks.title');
  const howHighlight = t('howItWorks.highlight');

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Featured Products Section */}
        <section className="py-20 bg-light-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
                {featuredTitle}{' '}
                <span className="text-gradient">{featuredHighlight}</span>
              </h2>
              <p className="text-xl text-text-soft max-w-3xl mx-auto">{t('featured.description')}</p>
            </div>

            {/* Products Grid */}
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <CardItem key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-500/30 rounded-2xl border border-gray-light">
                <h3 className="text-2xl font-semibold text-text-light mb-3">{t('emptyFeatured.title')}</h3>
                <p className="text-text-soft max-w-2xl mx-auto">{tCommon('statuses.featuredDescription')}</p>
              </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-12">
              <Link href="/explore" locale={locale} className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                {tCommon('buttons.viewAllProducts')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-dark-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
                {howTitle}{' '}
                <span className="text-gradient">{howHighlight}</span>?
              </h2>
              <p className="text-xl text-text-soft max-w-3xl mx-auto">{t('howItWorks.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">{t('howItWorks.steps.explore.title')}</h3>
                <p className="text-text-soft">{t('howItWorks.steps.explore.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">{t('howItWorks.steps.connect.title')}</h3>
                <p className="text-text-soft">{t('howItWorks.steps.connect.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">{t('howItWorks.steps.negotiate.title')}</h3>
                <p className="text-text-soft">{t('howItWorks.steps.negotiate.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hubmex">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">{t('cta.title')}</h2>
            <p className="text-xl text-dark mb-8 opacity-90">{t('cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/publish"
                locale={locale}
                className="bg-dark-500 text-primary hover:bg-gray-800 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                {tCommon('buttons.publishProduct')}
              </Link>
              <Link
                href="/explore"
                locale={locale}
                className="border-2 border-dark-500 text-dark-500 hover:bg-dark-500 hover:text-primary font-medium py-3 px-8 rounded-lg transition-all duration-200"
              >
                {tCommon('buttons.exploreOpportunities')}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const result = await getFeaturedListingsForCards(6);
  const translations = await loadTranslations(locale, ['common', 'home']);

  if (!result.success) {
    console.error('❌ Error cargando destacados para la página principal:', result.error);
  }

  return {
    props: {
      featuredProducts: result.success && result.data ? result.data : [],
      translations,
    },
    revalidate: 300,
  };
}
