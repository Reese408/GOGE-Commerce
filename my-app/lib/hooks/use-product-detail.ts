"use client";

import { useQuery } from "@tanstack/react-query";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_BY_ID_QUERY } from "@/lib/queries";
import type { ProductDetailData } from "@/lib/types";

async function fetchProductById(id: string): Promise<ProductDetailData> {
  const data = await shopifyFetch<{ data: { product: ProductDetailData } }>({
    query: PRODUCT_BY_ID_QUERY,
    variables: { id },
  });

  return data.data.product;
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!productId, // Only run if productId exists
  });
}
