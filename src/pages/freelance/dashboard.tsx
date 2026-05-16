import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/contexts/TranslationContext';
import { useToast } from '@/contexts/ToastContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';
import { deleteLocalGig, getLocalGigs, subscribeLocalGigs } from '@/lib/storage/localGigsStore';
import { localize } from '@/lib/catalog/freelanceCategories';
import type { Gig, Locale } from '@/types/freelance';

type Tab = 'gigs' | 'orders' | 'earnings' | 'profile';
const TABS: Tab[] = ['gigs', 'orders', 'earnings', 'profile'];

interface MockOrder {
  id: string;
  buyer: string;
  flag: string;
  service: string;
  packageTier: 'basic' | 'standard' | 'premium';
  priceUSD: number;
  status: 'active' | 'delivered' | 'completed' | 'cancelled';
  dueInDays: number;
}

const mockOrders: MockOrder[] = [
  { id: 'o1', buyer: 'James Wilson', flag: '🇺🇸', service: 'Logo design', packageTier: 'standard', priceUSD: 85, status: 'active', dueInDays: 2 },
  { id: 'o2', buyer: 'Emma Thompson', flag: '🇬🇧', service: 'Brand identity', packageTier: 'premium', priceUSD: 480, status: 'active', dueInDays: 5 },
  { id: 'o3', buyer: 'Lukas Müller', flag: '🇩🇪', service: 'Landing page', packageTier: 'basic', priceUSD: 120, status: 'delivered', dueInDays: 0 },
  { id: 'o4', buyer: 'Sarah Chen', flag: '🇨🇦', service: 'Reels editing', packageTier: 'standard', priceUSD: 75, status: 'completed', dueInDays: 0 },
  { id: 'o5', buyer: 'Diego Fernández', flag: '🇪🇸', service: 'Voice-over', packageTier: 'premium', priceUSD: 260, status: 'completed', dueInDays: 0 },
];

const statusColor: Record<MockOrder['status'], string> = {
  active: 'bg-primary/15 text-primary',
  delivered: 'bg-success/20 text-success',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-alert/15 text-alert',
};

const mockEarningsByMonth = [
  { month: 'Jan', amount: 1240 },
  { month: 'Feb', amount: 1860 },
  { month: 'Mar', amount: 2450 },
  { month: 'Apr', amount: 1780 },
  { month: 'May', amount: 3120 },
  { month: 'Jun', amount: 2890 },
];

export default function FreelanceDashboard() {
  const { t, locale } = useTranslation('freelance');
  const toast = useToast();
  const activeLocale = (locale as Locale) || 'es';
  const [tab, setTab] = useState<Tab>('gigs');
  const [localGigs, setLocalGigs] = useState<Gig[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalGigs(getLocalGigs());
    return subscribeLocalGigs(() => setLocalGigs(getLocalGigs()));
  }, []);

  const activeOrders = mockOrders.filter((o) => o.status === 'active').length;
  const completedOrders = mockOrders.filter((o) => o.status === 'completed').length;
  const totalEarned = mockEarningsByMonth.reduce((s, m) => s + m.amount, 0);
  const lastMonth = mockEarningsByMonth[mockEarningsByMonth.length - 1].amount;
  const maxMonthly = useMemo(() => Math.max(...mockEarningsByMonth.map((m) => m.amount)), []);

  return (
    <>
      <Head>
        <title>{`${t('dashboard.title')} | HUBMEX`}</title>
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-light mb-1">{t('dashboard.title')}</h1>
              <p className="text-text-soft">{t('dashboard.welcome')}</p>
            </div>
            <Link href="/freelance/publish" locale={locale} className="btn-accent inline-flex items-center gap-2 self-start md:self-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('dashboard.newGig')}
            </Link>
          </div>

          {/* Demo notice */}
          <div className="mb-6 p-3 rounded-lg border border-primary/40 bg-primary/10 text-primary text-sm">
            {t('dashboard.demoNotice')}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label={t('dashboard.stats.activeGigs')} value={mounted ? localGigs.length : 0} accent="primary" />
            <StatCard label={t('dashboard.stats.ordersInQueue')} value={activeOrders} accent="primary" />
            <StatCard label={t('dashboard.stats.completedOrders')} value={completedOrders} accent="success" />
            <StatCard label={t('dashboard.stats.earnings')} value={`$${totalEarned.toLocaleString()}`} accent="success" />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-light mb-6 flex gap-1 overflow-x-auto">
            {TABS.map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === k
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-text-soft hover:text-text-light'
                }`}
              >
                {t(`dashboard.tabs.${k}`)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'gigs' && (
            <section>
              {!mounted ? null : localGigs.length === 0 ? (
                <div className="card text-center py-16">
                  <svg className="w-12 h-12 text-text-soft mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-text-light font-semibold mb-2">{t('dashboard.gigs.empty')}</h3>
                  <p className="text-text-soft mb-6">{t('dashboard.gigs.emptyDescription')}</p>
                  <Link href="/freelance/publish" locale={locale} className="btn-primary inline-block">
                    {t('dashboard.newGig')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {localGigs.map((gig) => (
                    <div key={gig.id} className="card flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-light-bg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={gig.thumbnail} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-full bg-primary text-dark font-semibold">
                          {t('dashboard.gigs.demoBadge')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-text-light font-semibold mb-1 line-clamp-2">
                          {localize(gig.title, activeLocale)}
                        </h3>
                        <p className="text-text-soft text-sm line-clamp-2 mb-3">
                          {localize(gig.description, activeLocale)}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-text-soft">
                          <span>
                            {t('card.from')}:{' '}
                            <span className="text-primary font-semibold">${gig.packages.basic.priceUSD}</span>
                          </span>
                          <span>·</span>
                          <span>{gig.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 sm:justify-center">
                        <Link
                          href={`/freelance/gig/${gig.slug}`}
                          locale={locale}
                          className="btn-outline text-sm py-1.5 px-3"
                        >
                          {t('dashboard.gigs.view')}
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este servicio?')) {
                              deleteLocalGig(gig.id);
                              toast.show(t('toast.deleted'), 'info');
                            }
                          }}
                          className="text-alert hover:underline text-sm py-1.5 px-3"
                        >
                          {t('dashboard.gigs.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'orders' && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-light">{t('dashboard.orders.title')}</h2>
                <span className="text-xs text-text-soft bg-light-bg px-2 py-1 rounded">
                  {t('dashboard.orders.demoBadge')}
                </span>
              </div>
              <div className="card overflow-x-auto !p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-light text-text-soft text-xs uppercase tracking-wide">
                      <th className="text-left p-4">{t('dashboard.orders.columns.buyer')}</th>
                      <th className="text-left p-4">{t('dashboard.orders.columns.service')}</th>
                      <th className="text-left p-4">{t('dashboard.orders.columns.package')}</th>
                      <th className="text-right p-4">{t('dashboard.orders.columns.price')}</th>
                      <th className="text-left p-4">{t('dashboard.orders.columns.status')}</th>
                      <th className="text-right p-4">{t('dashboard.orders.columns.due')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((o) => (
                      <tr key={o.id} className="border-b border-gray-light/10 last:border-0">
                        <td className="p-4 text-text-light">
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden="true">{o.flag}</span>
                            {o.buyer}
                          </span>
                        </td>
                        <td className="p-4 text-text-soft">{o.service}</td>
                        <td className="p-4 text-text-soft">{t(`packages.${o.packageTier}`)}</td>
                        <td className="p-4 text-text-light text-right font-semibold">${o.priceUSD}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColor[o.status]}`}>
                            {t(`dashboard.orders.status.${o.status}`)}
                          </span>
                        </td>
                        <td className="p-4 text-text-soft text-right">
                          {o.dueInDays > 0
                            ? activeLocale === 'en'
                              ? `${o.dueInDays}d`
                              : `${o.dueInDays}d`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'earnings' && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-light">{t('dashboard.earnings.title')}</h2>
                <span className="text-xs text-text-soft bg-light-bg px-2 py-1 rounded">
                  {t('dashboard.earnings.demoBadge')}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t('dashboard.earnings.totalEarned')} value={`$${totalEarned.toLocaleString()}`} accent="primary" />
                <StatCard label={t('dashboard.earnings.lastMonth')} value={`$${lastMonth.toLocaleString()}`} accent="success" />
                <StatCard label={t('dashboard.earnings.pendingClearance')} value="$1,240" accent="primary" />
                <StatCard label={t('dashboard.earnings.available')} value="$3,120" accent="success" />
              </div>

              <div className="card">
                <h3 className="text-text-light font-semibold mb-4">{t('dashboard.earnings.monthlyChart')}</h3>
                <div className="flex items-end gap-4 h-48">
                  {mockEarningsByMonth.map((m) => {
                    const height = (m.amount / maxMonthly) * 100;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-2">
                        <span className="text-text-soft text-xs">${m.amount}</span>
                        <div
                          className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-text-soft text-xs">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {tab === 'profile' && (
            <section>
              <div className="card">
                <h2 className="text-xl font-bold text-text-light mb-2">{t('dashboard.profile.title')}</h2>
                <p className="text-text-soft">{t('dashboard.profile.description')}</p>
              </div>
            </section>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: 'primary' | 'success';
}) {
  return (
    <div className="card">
      <p className="text-text-soft text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${accent === 'primary' ? 'text-primary' : 'text-success'}`}>
        {value}
      </p>
    </div>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'freelance']);
  return { props: { translations } };
}
