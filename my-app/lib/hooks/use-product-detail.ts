"use client";

import { useQuery } from "@tanstack/react-query";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_BY_HANDLE_QUERY } from "@/lib/queries";
import type { ProductDetailData } from "@/lib/types";

async function fetchProductByHandle(handle: string): Promise<ProductDetailData> {
  console.log('[ProductDetail] Fetching product by handle:', handle);

  const data = await shopifyFetch<{ data: { productByHandle: ProductDetailData | null } }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  console.log('[ProductDetail] Shopify response:', data.data.productByHandle ? 'Product found' : 'Product NOT found');

  if (!data.data.productByHandle) {
    throw new Error(`Product with handle "${handle}" not found in Shopify`);
  }

  return data.data.productByHandle;
}

export function useProductDetail(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!handle, // Only run if handle exists
  });
}
