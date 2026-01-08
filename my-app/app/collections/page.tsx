"use client";

import { ProductCard } from "@/components/products/product-card";
import { useCollections } from "@/lib/hooks/use-collections";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles } from "lucide-react";
import { ShopifyCollection, ShopifyProduct, ProductCardData } from "@/lib/types";

// Transform ShopifyProduct to ProductCardData format
function transformProduct(product: ShopifyProduct): ProductCardData {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const variantId = product.variants?.edges[0]?.node?.id || product.id;
  const variants = product.variants?.edges.map(({ node }) => node) || [];

  return {
    id: variantId,
    handle: product.handle,
    title: product.title,
    description: product.description,
    price: price,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    imageUrl: image?.url,
    availableForSale: product.availableForSale,
    variants: variants,
    productType: product.productType,
  };
}

export default function CollectionsPage() {
  const { data: collections, isLoading, isError, error } = useCollections(10);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Error loading collections
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            No collections found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for new collections!
          </p>
        </div>
      </div>
    );
  }

  // Find First Drop collection
  const firstDropCollection = collections.find(
    (collection: ShopifyCollection) =>
      collection.title.toLowerCase().includes('first drop') ||
      collection.handle === 'first-drop'
  );

  const firstDropProducts = firstDropCollection?.products?.edges.map((edge: { node: ShopifyProduct }) => transformProduct(edge.node)) || [];

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

        {/* First Drop Section */}
        {firstDropCollection ? (
          <section className="mb-20">
            <div className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 rounded-3xl p-8 md:p-12 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-[#927194] dark:text-[#D08F90]" size={36} />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {firstDropCollection.title}
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                {firstDropCollection.description || "Where it all began. The first designs that started Grace, Ongoing's journey of spreading faith and positivity through creative expression."}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                {firstDropProducts.length} {firstDropProducts.length === 1 ? 'product' : 'products'} available
              </div>
            </div>

            {firstDropProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {firstDropProducts.map((product: ProductCardData) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
                <p className="text-gray-600 dark:text-gray-400">
                  Products coming soon to this collection!
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="mb-20">
            <div className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 rounded-3xl p-8 md:p-12 text-center">
              <Sparkles className="text-[#927194] dark:text-[#D08F90] mx-auto mb-4" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                First Drop
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                The first collection will be available soon. Check back to see where it all began!
              </p>
            </div>
          </section>
        )}

        {/* Other Collections */}
        {collections.filter((c: ShopifyCollection) => c.handle !== 'first-drop' && !c.title.toLowerCase().includes('first drop')).length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              More Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections
                .filter((c: ShopifyCollection) => c.handle !== 'first-drop' && !c.title.toLowerCase().includes('first drop'))
                .map((collection: ShopifyCollection) => (
                  <div
                    key={collection.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#927194]/5 to-[#D08F90]/5 border border-gray-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300"
                  >
                    {collection.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#927194]"></span>
                        {collection.products?.edges.length || 0} products
                      </div>
                    </div>
                  </div>
                ))}
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
