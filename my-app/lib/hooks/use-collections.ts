"use client";

import { useQuery } from "@tanstack/react-query";
import { ALL_COLLECTIONS_QUERY } from "@/lib/queries";
import { ShopifyCollection } from "@/lib/types";
import { SHOPIFY_API_VERSION, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from "@/lib/config";

async function fetchCollections(first: number = 10) {
  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: ALL_COLLECTIONS_QUERY,
      variables: { first },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL error");
  }

  return result.data.collections.edges.map((edge: { node: ShopifyCollection }) => edge.node);
}

export function useCollections(first: number = 10) {
  return useQuery({
    queryKey: ["collections", first],
    queryFn: () => fetchCollections(first),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
