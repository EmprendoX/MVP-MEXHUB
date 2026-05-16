'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';
import type { Gig, Locale } from '@/types/freelance';
import { localize } from '@/lib/catalog/freelanceCategories';
import FavoriteButton from '@/components/FavoriteButton';

interface GigCardProps {
  gig: Gig;
}

const levelBadgeStyles: Record<string, string> = {
  new: 'bg-gray-light/20 text-text-soft',
  level1: 'bg-primary/15 text-primary',
  level2: 'bg-primary/25 text-primary',
  top: 'bg-success/20 text-success',
};

const GigCard = ({ gig }: GigCardProps) => {
  const { t, locale } = useTranslation('freelance');
  const activeLocale = (locale as Locale) || 'es';

  const title = localize(gig.title, activeLocale);
  const sellerLevelLabel = t(`sellerLevels.${gig.seller.level}`);
  const basicPrice = gig.packages.basic.priceUSD;

  const reviewsLabel =
    gig.reviewsCount === 1
      ? t('card.reviewSingle', { count: gig.reviewsCount })
      : t('card.reviews', { count: gig.reviewsCount });

  const href = `/freelance/gig/${gig.slug}`;

  return (
    <div className="card-hover group flex flex-col h-full relative">
      {/* Favorite (sits above the link layer) */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton gigId={gig.id} />
      </div>

      {/* Image (whole image is clickable) */}
      <Link
        href={href}
        locale={locale}
        className="relative h-44 mb-4 overflow-hidden rounded-lg block"
      >
        <Image
          src={gig.thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelBadgeStyles[gig.seller.level]}`}>
            {sellerLevelLabel}
          </span>
        </div>
      </Link>

      {/* Seller row */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image
            src={gig.seller.avatarUrl}
            alt={gig.seller.name}
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-text-light text-sm font-medium truncate">{gig.seller.name}</span>
      </div>

      {/* Title (clickable) */}
      <Link href={href} locale={locale} className="block mb-3">
        <h3 className="text-text-light text-base font-medium line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
      </Link>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
        <span className="text-text-light text-sm font-semibold">{gig.rating.toFixed(1)}</span>
        <span className="text-text-soft text-xs">({reviewsLabel})</span>
      </div>

      {/* Price */}
      <div className="mt-auto pt-3 border-t border-gray-light flex items-end justify-between">
        <div>
          <p className="text-text-soft text-xs uppercase tracking-wide">{t('card.from')}</p>
          <p className="text-primary text-xl font-bold">
            ${basicPrice} <span className="text-xs text-text-soft font-normal">{t('card.currency')}</span>
          </p>
        </div>
        <span className="text-text-soft text-xs">
          {gig.packages.basic.deliveryDays === 1
            ? t('card.deliveryOneDay')
            : t('card.deliveryDays', { days: gig.packages.basic.deliveryDays })}
        </span>
      </div>
    </div>
  );
};

export default GigCard;
