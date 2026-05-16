import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GigCard from '@/components/GigCard';
import { useTranslation } from '@/contexts/TranslationContext';
import { useToast } from '@/contexts/ToastContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import {
  freelanceCatalog,
  getFreelanceCategoryById,
  localize,
} from '@/lib/catalog/freelanceCategories';
import { saveLocalGig } from '@/lib/storage/localGigsStore';
import type { Gig, Locale, PackageTier } from '@/types/freelance';

type StepKey = 'overview' | 'pricing' | 'description' | 'gallery' | 'publish';
const STEPS: StepKey[] = ['overview', 'pricing', 'description', 'gallery', 'publish'];

interface PackageDraft {
  title: string;
  description: string;
  priceUSD: number;
  deliveryDays: number;
  revisions: number;
  features: string;
}

interface FormState {
  title: string;
  categoryId: string;
  subcategoryId: string;
  tags: string;
  description: string;
  imagesText: string;
  packages: Record<PackageTier, PackageDraft>;
}

const initialPackage = (priceUSD: number, days: number, revisions: number): PackageDraft => ({
  title: '',
  description: '',
  priceUSD,
  deliveryDays: days,
  revisions,
  features: '',
});

const initialForm: FormState = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  tags: '',
  description: '',
  imagesText: '',
  packages: {
    basic: initialPackage(25, 3, 1),
    standard: initialPackage(75, 5, 3),
    premium: initialPackage(200, 10, 5),
  },
};

const placeholderImage = (seed: string) =>
  `https://via.placeholder.com/600x400/152332/00C8F0?text=${encodeURIComponent(seed || 'Gig')}`;

export default function PublishGig() {
  const { t, locale } = useTranslation('freelance');
  const toast = useToast();
  const activeLocale = (locale as Locale) || 'es';
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<Gig | null>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  const category = form.categoryId ? getFreelanceCategoryById(form.categoryId) : undefined;
  const subcategories = category?.subcategories || [];

  const updatePackage = (tier: PackageTier, patch: Partial<PackageDraft>) => {
    setForm((prev) => ({
      ...prev,
      packages: { ...prev.packages, [tier]: { ...prev.packages[tier], ...patch } },
    }));
  };

  const validateStep = (): string | null => {
    if (step === 'overview') {
      if (!form.title.trim()) return t('wizard.errors.missingTitle');
      if (!form.categoryId) return t('wizard.errors.missingCategory');
      if (!form.subcategoryId) return t('wizard.errors.missingSubcategory');
    }
    if (step === 'pricing') {
      for (const tier of ['basic', 'standard', 'premium'] as PackageTier[]) {
        if (!form.packages[tier].priceUSD || form.packages[tier].priceUSD <= 0) {
          return t('wizard.errors.missingPrice');
        }
      }
    }
    if (step === 'description') {
      if (!form.description.trim()) return t('wizard.errors.missingDescription');
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStepIdx((i) => Math.max(i - 1, 0));
  };

  const buildGig = (): Gig => {
    const id = `local-${Date.now()}`;
    const slug = `${form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)}-${id.slice(-4)}`;
    const images = form.imagesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const thumbnail = images[0] || placeholderImage(form.title);
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const mkPackage = (tier: PackageTier) => {
      const p = form.packages[tier];
      const features = p.features
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      return {
        tier,
        title: { es: p.title || t(`packages.${tier}`), en: p.title || t(`packages.${tier}`) },
        description: { es: p.description, en: p.description },
        priceUSD: p.priceUSD,
        deliveryDays: p.deliveryDays,
        revisions: p.revisions,
        features: { es: features, en: features },
      };
    };

    return {
      id,
      slug,
      title: { es: form.title, en: form.title },
      description: { es: form.description, en: form.description },
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId,
      images: images.length > 0 ? images : [thumbnail],
      thumbnail,
      seller: {
        id: 'seller-local-demo',
        name: 'Tú (demo)',
        avatarUrl: `https://via.placeholder.com/96x96/0B1221/00C8F0?text=YO`,
        level: 'new',
        country: 'MX',
        city: 'Demo',
        languages: ['es', 'en'],
        rating: 0,
        reviewsCount: 0,
        memberSince: String(new Date().getFullYear()),
        tagline: { es: 'Freelancer demo', en: 'Demo freelancer' },
      },
      packages: {
        basic: mkPackage('basic'),
        standard: mkPackage('standard'),
        premium: mkPackage('premium'),
      },
      rating: 0,
      reviewsCount: 0,
      tags,
      ordersInQueue: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
  };

  const handlePublish = () => {
    const gig = buildGig();
    saveLocalGig(gig);
    setPublished(gig);
    toast.show(t('toast.published'), 'success');
  };

  if (published) {
    return (
      <>
        <Head>
          <title>{`${t('wizard.successTitle')} | HUBMEX`}</title>
        </Head>
        <div className="min-h-screen bg-dark-500">
          <Navbar />
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-light mb-2">{t('wizard.successTitle')}</h1>
            <p className="text-text-soft mb-6">{t('wizard.successDescription')}</p>
            <div className="max-w-sm mx-auto mb-8">
              <GigCard gig={published} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/freelance/dashboard"
                locale={locale}
                className="btn-primary"
              >
                {t('wizard.viewDashboard')}
              </Link>
              <button
                onClick={() => {
                  setPublished(null);
                  setForm(initialForm);
                  setStepIdx(0);
                }}
                className="btn-outline"
              >
                {t('wizard.publishAnother')}
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${t('wizard.title')} | HUBMEX`}</title>
      </Head>
      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light mb-2">{t('wizard.title')}</h1>
            <p className="text-text-soft">{t('wizard.subtitle')}</p>
          </div>

          {/* Steps */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => i < stepIdx && setStepIdx(i)}
                  disabled={i > stepIdx}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    i === stepIdx
                      ? 'bg-primary text-dark'
                      : i < stepIdx
                      ? 'bg-light-bg text-text-light hover:bg-gray-light/20'
                      : 'bg-light-bg text-text-soft cursor-not-allowed opacity-60'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      i === stepIdx
                        ? 'bg-dark text-primary'
                        : i < stepIdx
                        ? 'bg-success text-dark'
                        : 'bg-gray-light/20 text-text-soft'
                    }`}
                  >
                    {i < stepIdx ? '✓' : i + 1}
                  </span>
                  {t(`wizard.steps.${s}`)}
                </button>
                {i < STEPS.length - 1 && <span className="text-text-soft">→</span>}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="card">
            {step === 'overview' && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-text-light">{t('wizard.overview.title')}</h2>

                <div>
                  <label className="block text-text-light text-sm font-medium mb-1">
                    {t('wizard.overview.gigTitle')} *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder={t('wizard.overview.gigTitlePlaceholder')}
                    className="input-field w-full"
                    maxLength={120}
                  />
                  <p className="text-text-soft text-xs mt-1">{t('wizard.overview.gigTitleHint')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-light text-sm font-medium mb-1">
                      {t('wizard.overview.category')} *
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, categoryId: e.target.value, subcategoryId: '' }))
                      }
                      className="select-field w-full"
                    >
                      <option value="">{t('wizard.overview.selectCategory')}</option>
                      {freelanceCatalog.map((c) => (
                        <option key={c.id} value={c.id}>
                          {localize(c.name, activeLocale)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-light text-sm font-medium mb-1">
                      {t('wizard.overview.subcategory')} *
                    </label>
                    <select
                      value={form.subcategoryId}
                      onChange={(e) => setForm((p) => ({ ...p, subcategoryId: e.target.value }))}
                      disabled={subcategories.length === 0}
                      className="select-field w-full disabled:opacity-50"
                    >
                      <option value="">{t('wizard.overview.selectSubcategory')}</option>
                      {subcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {localize(s.name, activeLocale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-light text-sm font-medium mb-1">
                    {t('wizard.overview.tags')}
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder={t('wizard.overview.tagsPlaceholder')}
                    className="input-field w-full"
                  />
                </div>
              </div>
            )}

            {step === 'pricing' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-text-light">{t('wizard.pricing.title')}</h2>
                  <p className="text-text-soft text-sm mt-1">{t('wizard.pricing.description')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {(['basic', 'standard', 'premium'] as PackageTier[]).map((tier) => {
                    const pkg = form.packages[tier];
                    return (
                      <div key={tier} className="bg-white border border-gray-light rounded-lg p-4 space-y-3">
                        <h3 className="text-text-light font-semibold uppercase tracking-wide text-sm">
                          {t(`packages.${tier}`)}
                        </h3>

                        <input
                          type="text"
                          value={pkg.title}
                          onChange={(e) => updatePackage(tier, { title: e.target.value })}
                          placeholder={t('wizard.pricing.packageTitle')}
                          className="input-field w-full text-sm"
                        />
                        <textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(tier, { description: e.target.value })}
                          placeholder={t('wizard.pricing.packageDescription')}
                          className="textarea-field w-full text-sm"
                          rows={2}
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-text-soft text-xs">{t('wizard.pricing.price')}</label>
                            <input
                              type="number"
                              min={1}
                              value={pkg.priceUSD || ''}
                              onChange={(e) => updatePackage(tier, { priceUSD: parseInt(e.target.value) || 0 })}
                              className="input-field w-full"
                            />
                          </div>
                          <div>
                            <label className="text-text-soft text-xs">{t('wizard.pricing.delivery')}</label>
                            <input
                              type="number"
                              min={1}
                              value={pkg.deliveryDays || ''}
                              onChange={(e) =>
                                updatePackage(tier, { deliveryDays: parseInt(e.target.value) || 1 })
                              }
                              className="input-field w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-text-soft text-xs">{t('wizard.pricing.revisions')}</label>
                          <input
                            type="number"
                            min={0}
                            value={pkg.revisions}
                            onChange={(e) => updatePackage(tier, { revisions: parseInt(e.target.value) || 0 })}
                            className="input-field w-full"
                          />
                        </div>

                        <div>
                          <label className="text-text-soft text-xs">{t('wizard.pricing.features')}</label>
                          <textarea
                            value={pkg.features}
                            onChange={(e) => updatePackage(tier, { features: e.target.value })}
                            className="textarea-field w-full text-sm"
                            rows={4}
                            placeholder={'• Feature 1\n• Feature 2'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'description' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-text-light">{t('wizard.descriptionStep.title')}</h2>
                  <p className="text-text-soft text-sm mt-1">{t('wizard.descriptionStep.description')}</p>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder={t('wizard.descriptionStep.placeholder')}
                  className="textarea-field w-full"
                  rows={12}
                  maxLength={3000}
                />
                <p className="text-text-soft text-xs text-right">{form.description.length} / 3000</p>
              </div>
            )}

            {step === 'gallery' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-text-light">{t('wizard.gallery.title')}</h2>
                  <p className="text-text-soft text-sm mt-1">{t('wizard.gallery.description')}</p>
                </div>
                <textarea
                  value={form.imagesText}
                  onChange={(e) => setForm((p) => ({ ...p, imagesText: e.target.value }))}
                  placeholder={t('wizard.gallery.placeholder')}
                  className="textarea-field w-full font-mono text-sm"
                  rows={6}
                />
                {/* Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {form.imagesText
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="h-24 w-full object-cover rounded-lg border border-gray-light"
                      />
                    ))}
                </div>
              </div>
            )}

            {step === 'publish' && (
              <ReviewStep form={form} activeLocale={activeLocale} />
            )}

            {error && (
              <div className="mt-4 p-3 bg-alert/15 border border-alert/40 text-alert text-sm rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-text-soft text-sm">
              {t('wizard.stepLabel', { current: stepIdx + 1, total: STEPS.length })}
            </span>
            <div className="flex gap-3">
              <button
                onClick={goBack}
                disabled={stepIdx === 0}
                className="btn-secondary disabled:opacity-40"
              >
                {t('wizard.back')}
              </button>
              {!isLast ? (
                <button onClick={goNext} className="btn-primary">
                  {t('wizard.next')}
                </button>
              ) : (
                <button onClick={handlePublish} className="btn-accent">
                  {t('wizard.publish')}
                </button>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function ReviewStep({ form, activeLocale }: { form: FormState; activeLocale: Locale }) {
  const { t } = useTranslation('freelance');
  const category = form.categoryId ? getFreelanceCategoryById(form.categoryId) : undefined;
  const previewGig: Gig = useMemo(
    () => ({
      id: 'preview',
      slug: 'preview',
      title: { es: form.title || '—', en: form.title || '—' },
      description: { es: form.description, en: form.description },
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId,
      images: [],
      thumbnail:
        form.imagesText.split('\n')[0]?.trim() ||
        `https://via.placeholder.com/600x400/152332/00C8F0?text=${encodeURIComponent(form.title || 'Gig')}`,
      seller: {
        id: 'preview',
        name: 'Tú (demo)',
        avatarUrl: 'https://via.placeholder.com/96x96/0B1221/00C8F0?text=YO',
        level: 'new',
        country: 'MX',
        languages: ['es', 'en'],
        rating: 0,
        reviewsCount: 0,
        memberSince: String(new Date().getFullYear()),
        tagline: { es: '', en: '' },
      },
      packages: {
        basic: {
          tier: 'basic',
          title: { es: form.packages.basic.title, en: form.packages.basic.title },
          description: { es: '', en: '' },
          priceUSD: form.packages.basic.priceUSD,
          deliveryDays: form.packages.basic.deliveryDays,
          revisions: form.packages.basic.revisions,
          features: { es: [], en: [] },
        },
        standard: {
          tier: 'standard',
          title: { es: form.packages.standard.title, en: form.packages.standard.title },
          description: { es: '', en: '' },
          priceUSD: form.packages.standard.priceUSD,
          deliveryDays: form.packages.standard.deliveryDays,
          revisions: form.packages.standard.revisions,
          features: { es: [], en: [] },
        },
        premium: {
          tier: 'premium',
          title: { es: form.packages.premium.title, en: form.packages.premium.title },
          description: { es: '', en: '' },
          priceUSD: form.packages.premium.priceUSD,
          deliveryDays: form.packages.premium.deliveryDays,
          revisions: form.packages.premium.revisions,
          features: { es: [], en: [] },
        },
      },
      rating: 0,
      reviewsCount: 0,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
    }),
    [form]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-text-light">{t('wizard.review.title')}</h2>
        <p className="text-text-soft text-sm mt-1">{t('wizard.review.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-text-light font-semibold mb-2">{t('wizard.review.preview')}</h3>
          <GigCard gig={previewGig} />
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-text-soft">{t('wizard.overview.category')}</p>
            <p className="text-text-light">
              {category ? localize(category.name, activeLocale) : '—'}
            </p>
          </div>
          <div>
            <p className="text-text-soft">{t('wizard.overview.tags')}</p>
            <p className="text-text-light">{form.tags || '—'}</p>
          </div>
          <div>
            <p className="text-text-soft">{t('wizard.pricing.title')}</p>
            <p className="text-text-light">
              ${form.packages.basic.priceUSD} · ${form.packages.standard.priceUSD} · ${form.packages.premium.priceUSD} USD
            </p>
          </div>
          <div>
            <p className="text-text-soft">{t('wizard.descriptionStep.title')}</p>
            <p className="text-text-light line-clamp-4">{form.description || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'freelance']);
  return { props: { translations } };
}
