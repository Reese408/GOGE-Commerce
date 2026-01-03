"use client";

import { ProductCard } from "./product-card";
import { useProducts } from "@/lib/hooks/use-products";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function FeaturedProducts() {
  const { data: products, isLoading, isError, error } = useProducts(10);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Error loading products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            No products found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Add products to your Shopify store to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="w-full py-16">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
