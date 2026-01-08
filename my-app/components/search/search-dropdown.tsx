"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Lightbulb, Package, Folder, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/lib/hooks/use-search";
import { useQuery } from "@tanstack/react-query";
import { ShopifyProduct, ShopifyCollection } from "@/lib/types";
import { ALL_PRODUCTS_QUERY } from "@/lib/queries";
import { SearchErrorBoundary } from "@/components/error-boundary";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

interface SearchDropdownProps {
  placeholder?: string;
}

// Helper function to calculate similarity score
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Exact match
  if (s1 === s2) return 100;

  // Starts with
  if (s1.startsWith(s2) || s2.startsWith(s1)) return 80;

  // Contains
  if (s1.includes(s2) || s2.includes(s1)) return 60;

  // Word match
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const matchingWords = words1.filter(w => words2.some(w2 => w.includes(w2) || w2.includes(w)));
  if (matchingWords.length > 0) return 40;

  return 0;
}

// Popular/suggested search terms - customize these based on your store
const SUGGESTED_SEARCHES = [
  "Shirts",
  "Hoodies",
  "Best Sellers",
  "All Products",
];

// Common product keywords for autocomplete
const AUTOCOMPLETE_KEYWORDS = [
  "shirt", "shirts", "t-shirt", "tee",
  "hoodie", "hoodies", "sweatshirt",
  "pants", "jeans", "trousers",
  "shoes", "sneakers", "boots",
  "jacket", "coat", "blazer",
  "dress", "skirt",
  "hat", "cap", "beanie",
  "bag", "backpack", "purse",
  "socks", "accessories",
  "shorts", "swimwear",
];

function SearchDropdownContent({ placeholder = "Search products..." }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Use search hook - search when focused OR when there's a query
  const { products, collections, isLoading } = useSearch(
    debouncedQuery,
    debouncedQuery.length > 0
  );

  // Fetch all products for suggestions when no results
  const { data: allProductsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-products-suggestions"],
    queryFn: async () => {
      const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: ALL_PRODUCTS_QUERY,
          variables: { first: 20 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();

      if (!result.data || !result.data.products) {
        throw new Error("Invalid response structure");
      }

      return result.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Memoize autocomplete suggestions - only recalculate when dependencies change
  const autocompleteOptions = useMemo(() => {
    if (query.length < 2 || query.length >= debouncedQuery.length + 2) {
      return [];
    }

    const queryLower = query.toLowerCase();

    // Get matching keywords from our list
    const keywordMatches = AUTOCOMPLETE_KEYWORDS
      .filter(keyword => keyword.startsWith(queryLower) && keyword !== queryLower)
      .slice(0, 5);

    // Get matching product titles and types from all products
    const productMatches = allProductsData
      ? allProductsData
          .flatMap((product: ShopifyProduct) => {
            const matches = [];
            const title = product.title.toLowerCase();
            const type = (product.productType || '').toLowerCase();

            if (title.includes(queryLower)) matches.push(product.title);
            if (type.includes(queryLower) && type !== title) matches.push(product.productType);

            return matches;
          })
          .filter(Boolean)
          .slice(0, 3)
      : [];

    // Combine and deduplicate
    return [...new Set([...keywordMatches, ...productMatches])].slice(0, 5);
  }, [query, debouncedQuery, allProductsData]);

  // Memoize similar products for fuzzy matching - expensive calculation
  const similarProducts = useMemo(() => {
    if (debouncedQuery.length === 0 || products.length > 0 || !allProductsData) {
      return [];
    }

    return allProductsData
      .map((product: ShopifyProduct) => ({
        product,
        score: Math.max(
          calculateSimilarity(product.title, debouncedQuery),
          product.productType ? calculateSimilarity(product.productType, debouncedQuery) : 0,
          calculateSimilarity(product.description, debouncedQuery)
        ),
      }))
      .filter(({ score }: { score: number }) => score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5)
      .map(({ product }: { product: ShopifyProduct }) => product);
  }, [debouncedQuery, products, allProductsData]);

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }, [query, router]);

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // ESC to close dropdown
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isFocused;
  const hasResults = products.length > 0 || collections.length > 0;

  // Lock body scroll when dropdown is open (Nike-style)
  useEffect(() => {
    if (showDropdown) {
      // Save original body overflow
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [showDropdown]);

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center transition-all duration-200 ${
            isFocused
              ? "ring-2 ring-[#927194] dark:ring-[#D08F90]"
              : "ring-1 ring-gray-300 dark:ring-zinc-700"
          } rounded-full overflow-hidden bg-white dark:bg-zinc-800`}
        >
          <Search
            className="absolute left-4 text-gray-400 dark:text-zinc-500"
            size={18}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-2.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        {!isFocused && !query && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 pointer-events-none">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded border border-gray-300 dark:border-zinc-600 font-mono">
              ⌘K
            </kbd>
          </div>
        )}
      </form>

      {/* Autocomplete Suggestions - Show inline below search bar */}
      {isFocused && autocompleteOptions.length > 0 && query.length >= 2 && !debouncedQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {autocompleteOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(option);
                setDebouncedQuery(option);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Search size={14} className="text-gray-400 dark:text-zinc-500" />
              <span className="text-gray-900 dark:text-white">{option}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Dropdown - Nike-inspired, full-width design */}
      {showDropdown && debouncedQuery && (
        <div
          ref={dropdownRef}
          className="fixed left-0 right-0 top-[80px] md:top-18 z-40 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="bg-white dark:bg-zinc-900 shadow-2xl border-t border-gray-200 dark:border-zinc-800" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">

              {/* Empty/Initial State - Show Suggested Searches */}
              {debouncedQuery.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column - Suggested Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp size={20} className="text-[#927194] dark:text-[#D08F90]" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Popular Searches
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {SUGGESTED_SEARCHES.map((searchTerm) => (
                        <button
                          key={searchTerm}
                          onClick={() => {
                            setQuery(searchTerm);
                            setDebouncedQuery(searchTerm);
                          }}
                          className="w-full text-left px-5 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group flex items-center justify-between border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                        >
                          <span className="text-base text-gray-700 dark:text-gray-300 group-hover:text-[#927194] dark:group-hover:text-[#D08F90] font-medium">
                            {searchTerm}
                          </span>
                          <Search size={18} className="text-gray-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Popular Products */}
                  {allProductsData && allProductsData.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Package size={20} className="text-[#927194] dark:text-[#D08F90]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Popular Products
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {allProductsData.slice(0, 6).map((product: ShopifyProduct) => {
                          const imageUrl = product.images.edges[0]?.node.url;
                          const price = parseFloat(product.priceRange.minVariantPrice.amount);

                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.handle}`}
                              onClick={() => setIsFocused(false)}
                              className="group"
                            >
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3">
                                {imageUrl && (
                                  <Image
                                    src={imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[40px]">
                                {product.title}
                              </p>
                              <p className="text-sm font-semibold text-[#927194] dark:text-[#D08F90]">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: product.priceRange.minVariantPrice.currencyCode,
                                }).format(price)}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : isLoadingAll ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#927194] dark:border-zinc-700 dark:border-t-[#D08F90]" />
                    </div>
                  ) : null}
                </div>
              ) : isLoading ? (
                // Loading state
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#927194] dark:border-zinc-700 dark:border-t-[#D08F90] mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Searching...
                    </p>
                  </div>
                </div>
              ) : hasResults ? (
                // Search Results
                <div className="space-y-8">
                  {/* Collections Section */}
                  {collections.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Folder size={20} className="text-[#927194] dark:text-[#D08F90]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Collections ({collections.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collections.map((collection: ShopifyCollection) => (
                          <Link
                            key={collection.id}
                            href={`/collections/${collection.handle}`}
                            onClick={() => setIsFocused(false)}
                            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 group"
                          >
                            {collection.image && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                                <Image
                                  src={collection.image.url}
                                  alt={collection.image.altText || collection.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#927194] dark:group-hover:text-[#D08F90] transition-colors">
                                {collection.title}
                              </p>
                              {collection.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                  {collection.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Section */}
                  {products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Package size={20} className="text-[#927194] dark:text-[#D08F90]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Products ({products.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {products.slice(0, 8).map((product: ShopifyProduct) => {
                          const imageUrl = product.images.edges[0]?.node.url;
                          const price = parseFloat(product.priceRange.minVariantPrice.amount);

                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.handle}`}
                              onClick={() => setIsFocused(false)}
                              className="group"
                            >
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3">
                                {imageUrl && (
                                  <Image
                                    src={imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[40px]">
                                {product.title}
                              </p>
                              {product.productType && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  {product.productType}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-[#927194] dark:text-[#D08F90]">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: product.priceRange.minVariantPrice.currencyCode,
                                }).format(price)}
                              </p>
                            </Link>
                          );
                        })}
                      </div>

                      {/* View All Results Link */}
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        onClick={() => setIsFocused(false)}
                        className="block mt-6 p-4 text-center text-base font-medium text-white bg-[#927194] hover:bg-[#7d5f7e] dark:bg-[#D08F90] dark:hover:bg-[#c07e7f] rounded-xl transition-colors"
                      >
                        View all results for &quot;{query}&quot;
                      </Link>
                    </div>
                  )}
                </div>
              ) : similarProducts.length > 0 ? (
                // Similar products (spelling suggestions)
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                    <Lightbulb className="text-yellow-600 dark:text-yellow-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No exact matches found
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Here are some similar products you might like
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {similarProducts.map((product: ShopifyProduct) => {
                      const imageUrl = product.images.edges[0]?.node.url;
                      const price = parseFloat(product.priceRange.minVariantPrice.amount);

                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.handle}`}
                          onClick={() => setIsFocused(false)}
                          className="group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[40px]">
                            {product.title}
                          </p>
                          {product.productType && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {product.productType}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#927194] dark:text-[#D08F90]">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: product.priceRange.minVariantPrice.currencyCode,
                            }).format(price)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // No results
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 mb-6">
                    <Search className="text-gray-400 dark:text-zinc-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Try searching with different keywords
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsFocused(false)}
                    className="inline-block px-6 py-3 text-base font-medium text-white bg-[#927194] hover:bg-[#7d5f7e] dark:bg-[#D08F90] dark:hover:bg-[#c07e7f] rounded-xl transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with error boundary and export
export function SearchDropdown({ placeholder = "Search products..." }: SearchDropdownProps) {
  return (
    <SearchErrorBoundary>
      <SearchDropdownContent placeholder={placeholder} />
    </SearchErrorBoundary>
  );
}
