"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight } from "lucide-react";
import type { ProductCardData } from "@/lib/types";

interface ShopContentProps {
  products: ProductCardData[];
  initialCategory: string;
  initialSort: string;
}

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

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "title-asc", label: "Title: A to Z" },
  { id: "title-desc", label: "Title: Z to A" },
  { id: "newest", label: "Newest First" },
];

export function ShopContent({ products, initialCategory, initialSort }: ShopContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Memoize the category change handler to prevent re-renders
  const handleCategoryChange = useCallback((categoryId: string) => {
    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categoryId);
    }
    if (initialSort !== "featured") {
      params.set("sort", initialSort);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, [router, pathname, initialSort]);

  // Memoize the sort change handler
  const handleSortChange = useCallback((sortId: string) => {
    const params = new URLSearchParams();
    if (initialCategory !== "all") {
      params.set("category", initialCategory);
    }
    if (sortId !== "featured") {
      params.set("sort", sortId);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, [router, pathname, initialCategory]);

  // Memoize the product count string
  const productCountText = useMemo(() => {
    const count = products.length;
    return `Showing ${count} ${count === 1 ? "product" : "products"}`;
  }, [products.length]);

  return (
    <>
      {/* Category Filter - Horizontal scroll pills on mobile, grid on desktop */}
      <div className="mb-6">
        {/* Mobile: Horizontal scrollable pills */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((category) => {
            const isSelected = initialCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? "bg-[#927194] text-white shadow-md"
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                }`}
                aria-pressed={isSelected}
                aria-label={`Filter by ${category.label}`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Desktop: Grid cards */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {categories.map((category) => {
            const isSelected = initialCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                  isSelected
                    ? "shadow-2xl scale-105 ring-2 ring-[#927194]"
                    : "shadow-lg hover:shadow-xl hover:scale-102"
                }`}
                aria-pressed={isSelected}
                aria-label={`Filter by ${category.label}`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-${
                    isSelected ? "100" : "90"
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
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-white">
                      <span className="text-xs font-semibold">Selected</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {productCountText}
        </p>
        <select
          value={initialSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
          aria-label="Sort products"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No products found in this category
          </p>
        </div>
      )}
    </>
  );
}
