'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useToast } from '@/contexts/ToastContext';
import { isFavorite, toggleFavorite, subscribeFavorites } from '@/lib/storage/favoritesStore';

interface FavoriteButtonProps {
  gigId: string;
  className?: string;
}

const FavoriteButton = ({ gigId, className = '' }: FavoriteButtonProps) => {
  const { t } = useTranslation('freelance');
  const toast = useToast();
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActive(isFavorite(gigId));
    return subscribeFavorites(() => setActive(isFavorite(gigId)));
  }, [gigId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(gigId);
    setActive(next);
    toast.show(next ? t('favorites.added') : t('favorites.removed'), 'info');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? t('favorites.remove') : t('favorites.add')}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/95 hover:bg-white shadow-soft transition-colors ${className}`}
    >
      <svg
        className={`w-5 h-5 transition-colors ${
          mounted && active ? 'text-accent' : 'text-text-soft'
        }`}
        fill={mounted && active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
