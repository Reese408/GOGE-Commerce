import { lazy, Suspense } from "react";
import { ProductErrorBoundary } from "@/components/error-boundary";
import { Loader2 } from "lucide-react";

// Lazy load ProductDetail component for better performance
const ProductDetail = lazy(() =>
  import("@/components/products/product-detail").then(module => ({
    default: module.ProductDetail
  }))
);

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Loading skeleton for product detail
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
          </div>
          <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        <span className="text-sm">Loading product...</span>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <ProductErrorBoundary>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail productId={decodeURIComponent(id)} />
      </Suspense>
    </ProductErrorBoundary>
  );
}
