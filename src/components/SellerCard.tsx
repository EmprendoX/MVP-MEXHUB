'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import { localize } from '@/lib/catalog/freelanceCategories';
import RatingStars from '@/components/RatingStars';
import type { SellerProfile, Locale } from '@/types/freelance';

interface SellerCardProps {
  seller: SellerProfile;
  compact?: boolean;
}

const SellerCard = ({ seller, compact = false }: SellerCardProps) => {
  const { t, locale } = useTranslation('freelance');
  const { t: tCommon } = useTranslation('common');
  const activeLocale = (locale as Locale) || 'es';

  return (
    <div className={compact ? 'flex items-start gap-4' : 'card'}>
      <div className="flex items-start gap-4">
        <Link
          href={`/freelance/seller/${seller.id}`}
          locale={locale}
          className="flex-shrink-0"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary">
            <Image
              src={seller.avatarUrl}
              alt={seller.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/freelance/seller/${seller.id}`}
              locale={locale}
              className="text-text-light font-semibold hover:text-accent transition-colors"
            >
              {seller.name}
            </Link>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/15 text-primary uppercase tracking-wide font-medium">
              {t(`sellerLevels.${seller.level}`)}
            </span>
          </div>
          <p className="text-text-soft text-sm mb-2 line-clamp-2">
            {localize(seller.tagline, activeLocale)}
          </p>
          <div className="flex items-center gap-3 text-xs text-text-soft">
            <span className="flex items-center gap-1">
              <RatingStars value={seller.rating} size="sm" />
              <span className="text-text-light font-semibold ml-1">{seller.rating.toFixed(1)}</span>
              <span>({seller.reviewsCount})</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{seller.city || seller.country}</span>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 pt-4 border-t border-gray-light grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-soft text-xs">{tCommon('navbar.language')}</p>
            <p className="text-text-light">
              {seller.languages.map((l) => (l === 'es' ? 'Español' : 'English')).join(' · ')}
            </p>
          </div>
          <div>
            <p className="text-text-soft text-xs">
              {activeLocale === 'en' ? 'Member since' : 'Miembro desde'}
            </p>
            <p className="text-text-light">{seller.memberSince}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCard;
