"use client";

import { useQuery } from "@tanstack/react-query";
import { shopifyFetch } from "@/lib/shopify";
import { ALL_PRODUCTS_QUERY } from "@/lib/queries";
import { ShopifyResponse, ProductCardData } from "@/lib/types";

async function fetchProducts(count: number = 10): Promise<ProductCardData[]> {
  const data = await shopifyFetch<ShopifyResponse>({
    query: ALL_PRODUCTS_QUERY,
    variables: { first: count },
  });

  return data.data.products.edges.map(({ node: product }) => {
    const image = product.images.edges[0]?.node;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: price,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      imageUrl: image?.url,
      availableForSale: product.availableForSale,
    };
  });
}

export function useProducts(count: number = 10) {
  return useQuery({
    queryKey: ["products", count],
    queryFn: () => fetchProducts(count),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
