'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface HorizontalCarouselProps {
  children: ReactNode;
  itemMinWidthPx?: number;
}

const HorizontalCarousel = ({ children, itemMinWidthPx = 280 }: HorizontalCarouselProps) => {
  const { t } = useTranslation('freelance');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, []);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const step = itemMinWidthPx + 24;

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                style={{ minWidth: `${itemMinWidthPx}px` }}
                className="snap-start flex-shrink-0 w-72 sm:w-80"
              >
                {child}
              </div>
            ))
          : children}
      </div>

      {/* Prev button */}
      <button
        type="button"
        aria-label={t('home.carousel.prev')}
        onClick={() => scrollBy(-step * 2)}
        disabled={!canPrev}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 items-center justify-center rounded-full bg-dark-500 border border-gray-light text-text-light shadow-soft transition-opacity ${
          canPrev ? 'opacity-100 hover:bg-primary hover:text-dark' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        type="button"
        aria-label={t('home.carousel.next')}
        onClick={() => scrollBy(step * 2)}
        disabled={!canNext}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 items-center justify-center rounded-full bg-dark-500 border border-gray-light text-text-light shadow-soft transition-opacity ${
          canNext ? 'opacity-100 hover:bg-primary hover:text-dark' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HorizontalCarousel;
