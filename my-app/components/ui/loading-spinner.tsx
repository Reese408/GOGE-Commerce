export function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-zinc-800"></div>
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#927194] border-r-[#D08F90] animate-spin"></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Loading products...
        </p>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-80 bg-gray-200 dark:bg-zinc-800"></div>

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>

            {/* Price skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>

            {/* Button skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
