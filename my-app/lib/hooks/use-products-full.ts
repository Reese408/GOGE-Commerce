"use client";

import { useQuery } from "@tanstack/react-query";
import { shopifyFetch } from "@/lib/shopify";
import { ALL_PRODUCTS_QUERY } from "@/lib/queries";
import { ShopifyResponse, ShopifyProduct } from "@/lib/types";

async function fetchProductsFull(count: number = 10): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ShopifyResponse>({
    query: ALL_PRODUCTS_QUERY,
    variables: { first: count },
  });

  return data.data.products.edges.map(({ node: product }) => product);
}

export function useProductsFull(count: number = 10) {
  return useQuery({
    queryKey: ["products-full", count],
    queryFn: () => fetchProductsFull(count),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
