'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { localize } from '@/lib/catalog/freelanceCategories';
import type { Gig, Locale, PackageTier } from '@/types/freelance';

interface GigPackagesPanelProps {
  gig: Gig;
}

const TIERS: PackageTier[] = ['basic', 'standard', 'premium'];

const GigPackagesPanel = ({ gig }: GigPackagesPanelProps) => {
  const { t, locale } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';
  const [tier, setTier] = useState<PackageTier>('basic');
  const pkg = gig.packages[tier];

  return (
    <div className="card sticky top-20">
      {/* Tabs */}
      <div className="flex border-b border-gray-light -mx-6 -mt-6 mb-4">
        {TIERS.map((tk) => (
          <button
            key={tk}
            type="button"
            onClick={() => setTier(tk)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
              tier === tk
                ? 'text-primary border-b-2 border-primary -mb-px'
                : 'text-text-soft hover:text-text-light'
            }`}
          >
            {t(`packages.${tk}`)}
          </button>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-text-light text-lg font-bold">{localize(pkg.title, activeLocale)}</h3>
        <p className="text-primary text-2xl font-bold">${pkg.priceUSD}</p>
      </div>
      <p className="text-text-soft text-sm mb-4">{localize(pkg.description, activeLocale)}</p>

      <div className="flex items-center justify-between text-text-light text-sm mb-4 py-3 border-y border-gray-light">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {pkg.deliveryDays === 1
              ? t('card.deliveryOneDay')
              : t('card.deliveryDays', { days: pkg.deliveryDays })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>
            {pkg.revisions === 'unlimited'
              ? t('packages.unlimited')
              : `${pkg.revisions} ${t('packages.revisions').toLowerCase()}`}
          </span>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {pkg.features[activeLocale].map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-text-soft text-sm">
            <svg className="w-4 h-4 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="btn-accent w-full text-base py-3">{t('packages.select')}</button>
    </div>
  );
};

export default GigPackagesPanel;
