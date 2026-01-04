"use client";

import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/lib/hooks/use-products";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export default function CollectionsPage() {
  const { data: products, isLoading, isError, error } = useProducts(50);

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
            Check back soon for new items!
          </p>
        </div>
      </div>
    );
  }

  // Filter Original Drop products
  const originalDropProducts = products.filter(product =>
    product.title.toLowerCase().includes('original') ||
    product.description.toLowerCase().includes('original drop')
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto max-w-7xl py-12 px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our curated collections of faith-inspired designs
          </p>
        </div>

        {/* New Drop Section - Coming Soon */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-[#D08F90]/10 via-[#927194]/10 to-[#A0B094]/10 rounded-3xl p-8 md:p-12 border-2 border-dashed border-[#927194]/30">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#927194] to-[#D08F90] mb-6"
              >
                <Zap className="text-white" size={40} />
              </motion.div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  New Drop
                </h2>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="text-4xl"
                >
                  🚀
                </motion.span>
              </div>

              <div className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-6 py-3 rounded-full font-semibold mb-4">
                Coming Soon!
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Fresh designs are on the way! Stay tuned for our latest collection dropping soon.
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow us on social media to be the first to know when the new drop arrives ✨
              </p>
            </div>
          </div>
        </section>

        {/* Original Drop Section */}
        {originalDropProducts.length > 0 ? (
          <section className="mb-20">
            <div className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 rounded-3xl p-8 md:p-12 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-[#927194] dark:text-[#D08F90]" size={36} />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Original Drop
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                Where it all began. The first designs that started Grace, Ongoing's journey of spreading faith and positivity through creative expression.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                {originalDropProducts.length} {originalDropProducts.length === 1 ? 'product' : 'products'} available
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              {originalDropProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-20">
            <div className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 rounded-3xl p-8 md:p-12 text-center">
              <Sparkles className="text-[#927194] dark:text-[#D08F90] mx-auto mb-4" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Original Drop
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                The original collection will be available soon. Check back to see where it all began!
              </p>
            </div>
          </section>
        )}

        {/* Browse All CTA */}
        <div className="text-center pt-12 border-t border-gray-200 dark:border-zinc-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Looking for something specific?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Browse our full catalog of products
          </p>
          <a
            href="/shop"
            className="inline-block bg-gradient-to-r from-[#927194] to-[#D08F90] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Shop All Products
          </a>
        </div>
      </main>
    </div>
  );
}
