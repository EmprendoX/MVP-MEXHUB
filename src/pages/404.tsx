import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

export default function NotFound() {
  const { t, locale } = useTranslation('freelance');

  return (
    <>
      <Head>
        <title>{`404 — ${t('notFound.title')}`}</title>
      </Head>
      <div className="min-h-screen bg-dark-500 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <p className="text-7xl md:text-9xl font-bold text-gradient mb-4">404</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-light mb-3">
              {t('notFound.title')}
            </h1>
            <p className="text-text-soft mb-8">{t('notFound.description')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" locale={locale} className="btn-primary">
                {t('notFound.goHome')}
              </Link>
              <Link href="/explore?v=freelance" locale={locale} className="btn-outline">
                {t('notFound.browseGigs')}
              </Link>
            </div>
          </div>
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
