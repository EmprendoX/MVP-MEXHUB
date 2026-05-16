'use client';

import { useTranslation } from '@/contexts/TranslationContext';

export type Vertical = 'manufacturing' | 'freelance';

interface VerticalToggleProps {
  value: Vertical;
  onChange: (next: Vertical) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<VerticalToggleProps['size']>, string> = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-sm py-2 px-4',
  lg: 'text-base py-2.5 px-5',
};

const VerticalToggle = ({ value, onChange, size = 'md' }: VerticalToggleProps) => {
  const { t } = useTranslation('freelance');

  const baseBtn =
    'flex-1 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-500';
  const activeBtn = 'bg-primary text-dark shadow-soft';
  const inactiveBtn = 'bg-transparent text-text-soft hover:text-text-light';

  return (
    <div
      className="inline-flex items-center p-1 bg-white border border-gray-light rounded-xl"
      role="tablist"
      aria-label={t('vertical.toggleAria')}
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'manufacturing'}
        onClick={() => onChange('manufacturing')}
        className={`${baseBtn} ${sizeClasses[size]} ${value === 'manufacturing' ? activeBtn : inactiveBtn}`}
      >
        {t('vertical.manufacturing')}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'freelance'}
        onClick={() => onChange('freelance')}
        className={`${baseBtn} ${sizeClasses[size]} ${value === 'freelance' ? activeBtn : inactiveBtn}`}
      >
        {t('vertical.freelance')}
      </button>
    </div>
  );
};

export default VerticalToggle;
