"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
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
  "Buttons",
  "Hoodies",
  "Stickers",
];

function SearchDropdownContent({ placeholder = "Search products..." }: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch products and collections based on debounced query
  const {
    products: productsData,
    collections: collectionsData,
    isLoading: isLoadingProducts,
  } = useSearch(debouncedQuery, true);

  const isLoadingCollections = isLoadingProducts; // Same loading state

  // Fetch all products for "Popular Products" section
  const { data: allProductsResponse } = useQuery({
    queryKey: ["all-products-search"],
    queryFn: async () => {
      const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: ALL_PRODUCTS_QUERY,
          variables: { first: 10 },
        }),
      });

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const allProductsData = allProductsResponse?.data?.products?.edges?.map((edge: any) => edge.node);

  // Generate autocomplete suggestions based on input and available products/collections
  const autocompleteOptions = useMemo(() => {
    if (query.length < 2) return [];

    const suggestions: string[] = [];

    // Add matching product titles
    if (allProductsData) {
      allProductsData.forEach((product: ShopifyProduct) => {
        const similarity = calculateSimilarity(product.title, query);
        if (similarity > 40 && !suggestions.includes(product.title)) {
          suggestions.push(product.title);
        }
      });
    }

    // Add suggested searches that match
    SUGGESTED_SEARCHES.forEach((term) => {
      const similarity = calculateSimilarity(term, query);
      if (similarity > 40 && !suggestions.includes(term)) {
        suggestions.push(term);
      }
    });

    return suggestions.slice(0, 5);
  }, [query, allProductsData]);

  const products = useMemo(() => {
    return Array.isArray(productsData) ? productsData : [];
  }, [productsData]);

  const collections = useMemo(() => {
    return Array.isArray(collectionsData) ? collectionsData : [];
  }, [collectionsData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }, [debouncedQuery, router]);

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  const handleCancel = useCallback(() => {
    setIsFocused(false);
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.blur();
  }, []);

  // Lock body scroll when search is active
  useEffect(() => {
    if (isFocused) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isFocused]);

  // Handle Escape key to close search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
        setQuery("");
        setDebouncedQuery("");
        inputRef.current?.blur();
      }
    };

    if (isFocused) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isFocused]);

  // Click outside to close (desktop only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    if (isFocused && window.innerWidth >= 1024) { // Only on desktop (lg breakpoint)
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isFocused]);

  const hasResults = products.length > 0 || collections.length > 0;

  // Lock body scroll when mobile search is open
  useEffect(() => {
    if (isFocused && window.innerWidth < 1024) { // Only on mobile
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isFocused]);

  // Safety cleanup: Always restore scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  // Mobile search overlay content
  const mobileSearchOverlay = isFocused && mounted ? (
    <div className="lg:hidden fixed inset-0 z-9999 bg-white dark:bg-zinc-900 flex flex-col">
          {/* Mobile Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-2.5 text-sm bg-gray-100 dark:bg-zinc-800 rounded-full outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
              />
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-[#927194] dark:text-[#D08F90] font-medium text-sm whitespace-nowrap px-2"
            >
              Cancel
            </button>
          </div>

          {/* Mobile Search Results - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {debouncedQuery.length > 0 ? (
              /* Show search results when there's a query */
              <div className="p-4">
                {isLoadingProducts || isLoadingCollections ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#927194] dark:border-[#D08F90]"></div>
                  </div>
                ) : hasResults ? (
                  <div className="space-y-6">
                    {/* Products Section */}
                    {products.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Package size={16} />
                          Products
                        </h3>
                        <div className="space-y-2">
                          {products.map((product: ShopifyProduct) => {
                            const imageUrl = product.images?.edges?.[0]?.node?.url;
                            const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");

                            return (
                              <Link
                                key={product.id}
                                href={`/products/${product.handle}`}
                                onClick={handleCancel}
                                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                {imageUrl && (
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                                    <Image
                                      src={imageUrl}
                                      alt={product.title}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {product.title}
                                  </p>
                                  <p className="text-sm font-semibold text-[#927194] dark:text-[#D08F90] mt-1">
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: product.priceRange?.minVariantPrice?.currencyCode || "USD",
                                    }).format(price)}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Collections Section */}
                    {collections.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Folder size={16} />
                          Collections
                        </h3>
                        <div className="space-y-2">
                          {collections.map((collection: ShopifyCollection) => {
                            const imageUrl = collection.image?.url;

                            return (
                              <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                onClick={handleCancel}
                                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                {imageUrl && (
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                                    <Image
                                      src={imageUrl}
                                      alt={collection.title}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {collection.title}
                                  </p>
                                  {collection.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                      {collection.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search size={48} className="text-gray-300 dark:text-zinc-700 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No results found for "{debouncedQuery}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Show popular searches when no query */
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Popular Searches
                  </h3>
                  <div className="space-y-1">
                    {SUGGESTED_SEARCHES.map((searchTerm) => (
                      <button
                        key={searchTerm}
                        onClick={() => {
                          setQuery(searchTerm);
                          setDebouncedQuery(searchTerm);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between"
                      >
                        {searchTerm}
                        <Search size={16} className="text-gray-400 dark:text-zinc-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  ) : null;

  return (
    <div className="relative w-full max-w-md">
      {/* Render mobile overlay in portal to document.body */}
      {mounted && typeof document !== 'undefined' && mobileSearchOverlay && createPortal(mobileSearchOverlay, document.body)}

      {/* Desktop Search Input */}
      <form onSubmit={handleSubmit} className="hidden lg:block">
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
            onBlur={() => {
              // Delay to allow click events to fire first
              setTimeout(() => setIsFocused(false), 150);
            }}
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

      {/* Mobile Search Input - Triggers Full Screen */}
      <button
        type="button"
        onClick={() => setIsFocused(true)}
        className="lg:hidden w-full flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-800 rounded-full ring-1 ring-gray-300 dark:ring-zinc-700 text-left"
      >
        <Search className="text-gray-400 dark:text-zinc-500" size={18} />
        <span className="text-sm text-gray-400 dark:text-zinc-500">{placeholder}</span>
      </button>

      {/* Autocomplete Suggestions - Desktop only */}
      {isFocused && autocompleteOptions.length > 0 && query.length >= 2 && !debouncedQuery && (
        <div className="hidden lg:block absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
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

      {/* Search Dropdown - Desktop only, full-width design */}
      {isFocused && (
        <div
          ref={dropdownRef}
          className="hidden lg:block fixed left-0 right-0 top-[80px] md:top-18 z-60 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="bg-white dark:bg-zinc-900 shadow-2xl border-t border-gray-200 dark:border-zinc-800" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">

              {/* Show suggested searches when no query */}
              {debouncedQuery.length === 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-[#927194] dark:text-[#D08F90]" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Popular Searches
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SUGGESTED_SEARCHES.map((searchTerm) => (
                      <button
                        key={searchTerm}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuery(searchTerm);
                          setDebouncedQuery(searchTerm);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          e.stopPropagation();
                        }}
                        className="px-6 py-4 rounded-xl bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 hover:from-[#927194]/20 hover:to-[#D08F90]/20 transition-all text-left border border-[#927194]/20 hover:border-[#927194]/40"
                      >
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                          <Search size={16} className="text-[#927194] dark:text-[#D08F90]" />
                          {searchTerm}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Loading State */}
                  {(isLoadingProducts || isLoadingCollections) && (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#927194] dark:border-[#D08F90]"></div>
                    </div>
                  )}

                  {/* Search Results */}
                  {!isLoadingProducts && !isLoadingCollections && hasResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Products Column */}
                  {products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Package size={20} className="text-[#927194] dark:text-[#D08F90]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Products
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {products.slice(0, 6).map((product: ShopifyProduct) => {
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
                  )}

                  {/* Collections Column */}
                  {collections.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Folder size={20} className="text-[#927194] dark:text-[#D08F90]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Collections
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {collections.map((collection: ShopifyCollection) => {
                          const imageUrl = collection.image?.url;

                          return (
                            <Link
                              key={collection.id}
                              href={`/collections/${collection.handle}`}
                              onClick={() => setIsFocused(false)}
                              className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                            >
                              {imageUrl && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                                  <Image
                                    src={imageUrl}
                                    alt={collection.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#927194] dark:group-hover:text-[#D08F90] transition-colors">
                                  {collection.title}
                                </h4>
                                {collection.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {collection.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

                  {/* No Results */}
                  {!isLoadingProducts && !isLoadingCollections && !hasResults && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Search size={64} className="text-gray-300 dark:text-zinc-700 mb-6" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        We couldn't find anything matching "{debouncedQuery}"
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Lightbulb size={16} />
                        <span>Try searching with different keywords</span>
                      </div>
                    </div>
                  )}
                </>
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
