"use client";

import { motion } from "framer-motion";
import { Search, Package, X } from "lucide-react";
import Link from "next/link";
import { useSearch } from "@/lib/hooks/use-search";
import { ProductCard } from "@/components/products/product-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const router = useRouter();
  const { products, collections, isLoading, isError } = useSearch(query, query.length > 0);

  // Convert ShopifyProduct to ProductCardData
const productCards = products.map((product) => {
  const firstVariantEdge = product.variants?.edges?.[0];
  const firstImageEdge = product.images?.edges?.[0];

  const firstVariant = firstVariantEdge?.node;
  const firstImage = firstImageEdge?.node;

  return {
    // Stable React key
    id: firstVariant?.id ?? product.id,

    // REQUIRED for cart logic
    variantId: firstVariant?.id,

    handle: product.handle,
    title: product.title,
    description: product.description,

    price: firstVariant?.price?.amount
      ? parseFloat(firstVariant.price.amount)
      : parseFloat(product.priceRange.minVariantPrice.amount),

    currencyCode:
      firstVariant?.price?.currencyCode ??
      product.priceRange.minVariantPrice.currencyCode,

    imageUrl: firstImage?.url ?? "/placeholder.png",

    availableForSale:
      firstVariant?.availableForSale ?? product.availableForSale,
  };
});


  const hasResults = productCards.length > 0 || collections.length > 0;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <X className="text-red-600 dark:text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error Loading Results
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </motion.div>
    );
  }

  // No Results
  if (!hasResults && query) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
          <Search className="text-gray-400 dark:text-zinc-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Results Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find any products matching "{query}". Try searching with different keywords.
        </p>
        <Button onClick={() => router.push("/shop")}>
          Browse All Products
        </Button>
      </motion.div>
    );
  }

  // Empty Query
  if (!query) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#927194]/10 mb-4">
          <Search className="text-[#927194]" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What are you looking for?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use the search bar to find products
        </p>
        <Button onClick={() => router.push("/shop")}>
          Browse All Products
        </Button>
      </motion.div>
    );
  }

  // Results
  return (
    <div className="space-y-12">
      {/* Collections */}
      {collections.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Collections ({collections.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 hover:border-[#927194] transition-all hover:shadow-lg"
              >
                {collection.image && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-zinc-800">
                    <img
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#927194] transition-colors mb-2">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Products */}
      {productCards.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: collections.length > 0 ? 0.2 : 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Products ({productCards.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {productCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
