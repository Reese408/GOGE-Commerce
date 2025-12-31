"use client";

import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/lib/hooks/use-products";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState } from "react";

const categories = [
  { id: "all", label: "All Products", icon: "🛍️" },
  { id: "t-shirts", label: "T-Shirts", icon: "👕" },
  { id: "hoodies", label: "Hoodies", icon: "🧥" },
  { id: "sweatshirts", label: "Sweatshirts", icon: "👚" },
  { id: "accessories", label: "Accessories", icon: "🎒" },
  { id: "stickers", label: "Stickers", icon: "✨" },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  // Filter products by category (placeholder - in production, filter by actual product tags/types)
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) =>
          product.title.toLowerCase().includes(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto max-w-7xl py-12 px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shop All Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our full collection of faith-inspired apparel and
            accessories
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#927194] text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No products found in this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
