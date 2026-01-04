"use client";

import { useQuery } from "@tanstack/react-query";
import { SEARCH_PRODUCTS_QUERY, SEARCH_COLLECTIONS_QUERY } from "@/lib/queries";
import { ShopifyProduct, ShopifyCollection } from "@/lib/types";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

async function searchProducts(query: string, first: number = 50) {
  // Format query for Shopify search - add wildcards for partial matching
  const searchQuery = `title:*${query}* OR product_type:*${query}* OR tag:*${query}*`;

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
  return result.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node);
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

