"use client";

import { useQuery } from "@tanstack/react-query";
import { ALL_COLLECTIONS_QUERY } from "@/lib/queries";
import { ShopifyCollection } from "@/lib/types";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

async function fetchCollections(first: number = 10) {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
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
