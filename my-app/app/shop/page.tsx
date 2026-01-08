"use client";

import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/lib/hooks/use-products";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "all",
    label: "All Products",
    color: "from-[#927194] to-[#D08F90]",
    description: "Browse our complete collection"
  },
  {
    id: "shirts",
    label: "Shirts",
    color: "from-[#D08F90] to-[#927194]",
    description: "Faith-inspired tees & tops"
  },
  {
    id: "sweatshirts",
    label: "Sweatshirts",
    color: "from-[#927194] to-[#A0B094]",
    description: "Cozy hoodies & crewnecks"
  },
  {
    id: "accessories",
    label: "Accessories",
    color: "from-[#A0B094] to-[#D08F90]",
    description: "Stickers, buttons & more"
  },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const { data: products, isLoading, isError, error } = useProducts(50);

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

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

  // Filter products by category using productType
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => {
          // If no productType, also check title as fallback
          const productType = (product.productType || "").toLowerCase();
          const title = product.title.toLowerCase();

          // Match based on category
          if (selectedCategory === "shirts") {
            // Match shirts, t-shirts, tees, etc. (but NOT sweatshirts)
            return (
              (productType.includes("shirt") && !productType.includes("sweatshirt")) ||
              productType.includes("tee") ||
              (productType.includes("top") && !productType.includes("button")) ||
              productType.includes("t-shirt") ||
              // Fallback to title if productType is empty
              (!productType && (
                (title.includes("shirt") && !title.includes("sweatshirt")) ||
                title.includes("tee") ||
                title.includes("t-shirt")
              ))
            );
          } else if (selectedCategory === "sweatshirts") {
            // Match sweatshirts, hoodies, etc.
            return (
              productType.includes("sweatshirt") ||
              productType.includes("hoodie") ||
              productType.includes("pullover") ||
              productType.includes("crewneck") ||
              (!productType && (title.includes("sweatshirt") || title.includes("hoodie") || title.includes("pullover")))
            );
          } else if (selectedCategory === "accessories") {
            // Match stickers, buttons, and other accessories
            // EXCLUDE if it's a shirt or sweatshirt
            const isShirt = productType.includes("shirt") || productType.includes("tee") || productType.includes("t-shirt");
            const isSweatshirt = productType.includes("sweatshirt") || productType.includes("hoodie") || productType.includes("pullover");

            if (isShirt || isSweatshirt) return false;

            return (
              productType.includes("sticker") ||
              productType.includes("button") ||
              productType.includes("pin") ||
              productType.includes("accessory") ||
              productType.includes("accessori") ||
              (!productType && (title.includes("sticker") || title.includes("button") || title.includes("pin")))
            );
          }
          return false;
        });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "shadow-2xl scale-105 ring-2 ring-[#927194]"
                    : "shadow-lg hover:shadow-xl hover:scale-102"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-${
                    selectedCategory === category.id ? "100" : "90"
                  } group-hover:opacity-100 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.label}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">
                    {category.description}
                  </p>

                  {/* Arrow indicator for selected */}
                  {selectedCategory === category.id && (
                    <div className="mt-3 flex items-center gap-1 text-white">
                      <span className="text-xs font-semibold">Selected</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
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
