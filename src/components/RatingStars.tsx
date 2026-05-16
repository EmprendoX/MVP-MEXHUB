interface RatingStarsProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const RatingStars = ({ value, size = 'md', showValue = false }: RatingStarsProps) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const cls = sizeMap[size];

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className={`${cls} text-primary`} fill />
      ))}
      {half && <Star key="h" className={`${cls} text-primary`} half />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className={`${cls} text-gray-light/40`} />
      ))}
      {showValue && <span className="ml-1 text-text-light text-sm font-semibold">{value.toFixed(1)}</span>}
    </span>
  );
};

function Star({ className, fill, half }: { className: string; fill?: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-star)"
          stroke="currentColor"
          strokeWidth="0.5"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 20 20" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden="true">
      <path
        strokeWidth={fill ? 0 : 1.5}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
      />
    </svg>
  );
}

export default RatingStars;
