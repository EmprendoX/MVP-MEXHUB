import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GigCard from '@/components/GigCard';
import SellerCard from '@/components/SellerCard';
import GigPackagesPanel from '@/components/GigPackagesPanel';
import RatingStars from '@/components/RatingStars';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import {
  gigsMock,
  getGigBySlug,
  getGigsBySellerId,
} from '@/lib/mocks/gigsMock';
import { getReviewsForGig, getFaqsForGig, type Review, type Faq } from '@/lib/mocks/reviewsMock';
import {
  getFreelanceCategoryById,
  getFreelanceSubcategoryById,
  localize,
} from '@/lib/catalog/freelanceCategories';
import type { Gig, Locale } from '@/types/freelance';

interface GigDetailProps {
  gig: Gig | null;
  moreFromSeller: Gig[];
  reviews: Review[];
  faqs: Faq[];
}

export default function GigDetail({ gig, moreFromSeller, reviews, faqs }: GigDetailProps) {
  const { t, locale } = useTranslation('freelance');
  const { t: tCommon } = useTranslation('common');
  const activeLocale = (locale as Locale) || 'es';
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!gig) {
    return (
      <>
        <Head>
          <title>{`${t('gigDetail.notFound')} | HUBMEX`}</title>
        </Head>
        <div className="min-h-screen bg-dark-500">
          <Navbar />
          <div className="max-w-3xl mx-auto px-4 py-32 text-center">
            <h1 className="text-3xl font-bold text-text-light mb-3">{t('gigDetail.notFound')}</h1>
            <p className="text-text-soft mb-6">{t('gigDetail.notFoundDescription')}</p>
            <Link href="/explore?v=freelance" locale={locale} className="btn-primary inline-block">
              {t('gigDetail.browseAll')}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const title = localize(gig.title, activeLocale);
  const description = localize(gig.description, activeLocale);
  const category = getFreelanceCategoryById(gig.categoryId);
  const subcategoryInfo = getFreelanceSubcategoryById(gig.subcategoryId);

  return (
    <>
      <Head>
        <title>{`${title} | HUBMEX`}</title>
        <meta name="description" content={description.slice(0, 160)} />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-text-soft mb-4">
            <Link href="/explore?v=freelance" locale={locale} className="hover:text-primary">
              {t('verticalShort')}
            </Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/explore?v=freelance&cat=${category.id}`}
                  locale={locale}
                  className="hover:text-primary"
                >
                  {localize(category.name, activeLocale)}
                </Link>
              </>
            )}
            {subcategoryInfo && (
              <>
                <span className="mx-2">/</span>
                <span className="text-text-light">{localize(subcategoryInfo.subcategory.name, activeLocale)}</span>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-light leading-tight mb-4">{title}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/freelance/seller/${gig.seller.id}`}
                    locale={locale}
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary">
                      <Image src={gig.seller.avatarUrl} alt={gig.seller.name} width={32} height={32} />
                    </div>
                    <span className="text-text-light font-medium">{gig.seller.name}</span>
                  </Link>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/15 text-primary uppercase tracking-wide font-medium">
                    {t(`sellerLevels.${gig.seller.level}`)}
                  </span>
                  <span className="text-text-soft" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-sm">
                    <RatingStars value={gig.rating} size="sm" />
                    <span className="text-text-light font-semibold">{gig.rating.toFixed(1)}</span>
                    <span className="text-text-soft">({gig.reviewsCount})</span>
                  </span>
                  {gig.ordersInQueue !== undefined && (
                    <>
                      <span className="text-text-soft" aria-hidden="true">·</span>
                      <span className="text-text-soft text-sm">
                        {t('gigDetail.ordersInQueue', { count: gig.ordersInQueue })}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-light-bg">
                  <Image
                    src={gig.images[activeImage] || gig.thumbnail}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
                {gig.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {gig.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`relative h-20 w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          activeImage === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt="" fill sizes="112px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* About */}
              <section>
                <h2 className="text-xl font-bold text-text-light mb-3">{t('gigDetail.aboutGig')}</h2>
                <p className="text-text-soft leading-relaxed whitespace-pre-line">{description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {gig.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-light-bg text-text-soft text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* About seller */}
              <section>
                <h2 className="text-xl font-bold text-text-light mb-3">{t('gigDetail.aboutSeller')}</h2>
                <SellerCard seller={gig.seller} />
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-light">{t('gigDetail.reviews')}</h2>
                  <div className="flex items-center gap-2">
                    <RatingStars value={gig.rating} />
                    <span className="text-text-light font-semibold">{gig.rating.toFixed(1)}</span>
                    <span className="text-text-soft text-sm">({gig.reviewsCount})</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="card">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-dark font-medium flex items-center justify-center flex-shrink-0">
                          {review.reviewer.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-text-light font-medium">{review.reviewer.name}</p>
                            <span className="text-base" aria-hidden="true">
                              {review.reviewer.flag}
                            </span>
                            <span className="text-text-soft text-xs">{review.reviewer.country}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <RatingStars value={review.rating} size="sm" />
                            <span className="text-text-soft text-xs">
                              {review.daysAgo === 1
                                ? t('review.dayAgo')
                                : t('review.daysAgo', { days: review.daysAgo })}
                            </span>
                          </div>
                          <p className="text-text-soft text-sm leading-relaxed mb-3">
                            {localize(review.comment, activeLocale)}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-text-soft">
                            <span>
                              {t('review.package')}: <span className="text-text-light">{t(`packages.${review.packageTier}`)}</span>
                            </span>
                            <span>
                              {t('review.spent')}: <span className="text-text-light">${review.priceUSD}</span>
                            </span>
                            <span>
                              {t('review.duration')}:{' '}
                              <span className="text-text-light">
                                {review.deliveryDays === 1
                                  ? t('review.day')
                                  : t('review.days', { count: review.deliveryDays })}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-xl font-bold text-text-light mb-4">{t('gigDetail.faq')}</h2>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="card !p-0 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-light-bg transition-colors"
                      >
                        <span className="text-text-light font-medium">
                          {localize(faq.question, activeLocale)}
                        </span>
                        <svg
                          className={`w-5 h-5 text-text-soft transform transition-transform ${
                            openFaq === i ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-4 text-text-soft text-sm leading-relaxed">
                          {localize(faq.answer, activeLocale)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar — packages */}
            <aside id="packages" className="lg:col-span-1 scroll-mt-24">
              <GigPackagesPanel gig={gig} />
            </aside>
          </div>

          {/* More from seller */}
          {moreFromSeller.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-text-light mb-6">{t('gigDetail.moreFromSeller')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {moreFromSeller.map((g) => (
                  <GigCard key={g.id} gig={g} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-light-bg border-t border-gray-light px-4 py-3 flex items-center justify-between gap-3 shadow-soft">
          <div>
            <p className="text-text-soft text-[10px] uppercase tracking-wide">{t('stickyCta.from')}</p>
            <p className="text-primary text-lg font-bold leading-none">
              ${gig.packages.basic.priceUSD}{' '}
              <span className="text-xs text-text-soft font-normal">{t('card.currency')}</span>
            </p>
          </div>
          <a href="#packages" className="btn-primary flex-1 text-center max-w-[220px]">
            {t('stickyCta.continue')}
          </a>
        </div>

        {/* Bottom padding on mobile so sticky doesn't cover footer */}
        <div className="lg:hidden h-20" />

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = gigsMock.flatMap((gig) =>
    (locales || ['es']).map((locale) => ({
      params: { slug: gig.slug },
      locale,
    }))
  );
  return { paths, fallback: 'blocking' };
};

export async function getStaticProps({ params, locale }: GetStaticPropsContext) {
  const slug = params?.slug as string;
  const gig = getGigBySlug(slug) || null;
  const translations = await loadTranslations(locale, ['common', 'freelance']);

  if (!gig) {
    return {
      props: {
        gig: null,
        moreFromSeller: [],
        reviews: [],
        faqs: [],
        translations,
      },
      revalidate: 60,
    };
  }

  const moreFromSeller = getGigsBySellerId(gig.seller.id).filter((g) => g.id !== gig.id).slice(0, 4);

  return {
    props: {
      gig,
      moreFromSeller,
      reviews: getReviewsForGig(gig.id, 5),
      faqs: getFaqsForGig(gig.id),
      translations,
    },
    revalidate: 300,
  };
}
