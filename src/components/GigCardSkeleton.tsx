const GigCardSkeleton = () => (
  <div className="card-hover h-full flex flex-col animate-pulse">
    <div className="h-44 mb-4 rounded-lg bg-gray-light" />
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gray-light" />
      <div className="h-3 w-24 rounded bg-gray-light" />
    </div>
    <div className="h-4 w-full rounded bg-gray-light mb-2" />
    <div className="h-4 w-3/4 rounded bg-gray-light mb-3" />
    <div className="h-3 w-20 rounded bg-gray-light mb-4" />
    <div className="mt-auto pt-3 border-t border-gray-light flex justify-between">
      <div className="h-5 w-16 rounded bg-gray-light" />
      <div className="h-3 w-20 rounded bg-gray-light" />
    </div>
  </div>
);

export default GigCardSkeleton;
