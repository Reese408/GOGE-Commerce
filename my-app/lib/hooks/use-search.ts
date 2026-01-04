"use client";

import { useQuery } from "@tanstack/react-query";
import { SEARCH_PRODUCTS_QUERY, SEARCH_COLLECTIONS_QUERY } from "@/lib/queries";
import { ShopifyProduct, ShopifyCollection } from "@/lib/types";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

async function searchProducts(query: string, first: number = 50) {
  // Smart search: Try multiple search strategies for better results
  // 1. Search in title with wildcards
  // 2. Search in product_type (category) - exact and partial matches
  // 3. Search in tags
  // 4. Search in vendor

  const cleanQuery = query.trim();
  const words = cleanQuery.split(/\s+/); // Split into words for multi-word searches

  // Build a comprehensive search query that checks multiple fields
  // For "shirt" it will find products with:
  // - "shirt" in title (e.g., "Signature Logo Shirt")
  // - product_type = "Shirts" (category)
  // - "shirt" in tags
  const searchParts = words.map(word =>
    `(title:*${word}* OR product_type:*${word}* OR tag:*${word}* OR vendor:*${word}*)`
  ).join(' AND ');

  const searchQuery = searchParts;

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: SEARCH_PRODUCTS_QUERY,
      variables: { query: searchQuery, first },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const result = await response.json();
  const products = result.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node);

  // Sort results by relevance:
  // 1. Exact product_type match (highest priority - category match)
  // 2. Title starts with query
  // 3. Title contains query
  // 4. Everything else
  return products.sort((a: ShopifyProduct, b: ShopifyProduct) => {
    const queryLower = cleanQuery.toLowerCase();
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aType = (a.productType || '').toLowerCase();
    const bType = (b.productType || '').toLowerCase();

    // Exact category match gets highest priority
    const aTypeMatch = aType === queryLower || aType === queryLower + 's' || aType + 's' === queryLower;
    const bTypeMatch = bType === queryLower || bType === queryLower + 's' || bType + 's' === queryLower;

    if (aTypeMatch && !bTypeMatch) return -1;
    if (!aTypeMatch && bTypeMatch) return 1;

    // Title starts with query
    const aTitleStarts = aTitle.startsWith(queryLower);
    const bTitleStarts = bTitle.startsWith(queryLower);

    if (aTitleStarts && !bTitleStarts) return -1;
    if (!aTitleStarts && bTitleStarts) return 1;

    // Title contains query
    const aTitleContains = aTitle.includes(queryLower);
    const bTitleContains = bTitle.includes(queryLower);

    if (aTitleContains && !bTitleContains) return -1;
    if (!aTitleContains && bTitleContains) return 1;

    // Default: maintain original order
    return 0;
  });
}

async function searchCollections(query: string, first: number = 3) {
  // Format query for Shopify search - add wildcards for partial matching
  const searchQuery = `title:*${query}*`;

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: SEARCH_COLLECTIONS_QUERY,
      variables: { query: searchQuery, first },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to search collections");
  }

  const result = await response.json();
  return result.data.collections.edges.map((edge: { node: ShopifyCollection }) => edge.node);
}

export function useSearch(query: string, enabled: boolean = true) {
  const isEnabled = enabled && query.trim().length > 0;

  const productsQuery = useQuery({
    queryKey: ["search-products", query],
    queryFn: () => searchProducts(query),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const collectionsQuery = useQuery({
    queryKey: ["search-collections", query],
    queryFn: () => searchCollections(query),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: productsQuery.data ?? [],
    collections: collectionsQuery.data ?? [],

    // Only loading when enabled AND actively fetching
    isLoading:
      isEnabled &&
      (productsQuery.isFetching || collectionsQuery.isFetching),

    // Only error when enabled AND a query actually failed
    isError:
      isEnabled &&
      (productsQuery.isError || collectionsQuery.isError),
  };
}

