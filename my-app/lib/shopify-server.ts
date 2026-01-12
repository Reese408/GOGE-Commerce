import { shopifyFetch } from "./shopify";
import { ALL_PRODUCTS_QUERY } from "./queries";
import { ShopifyResponse, ProductCardData } from "./types";

/**
 * Server-side product fetching
 * This runs on the server and can be used in Server Components
 */
export async function getProducts(count: number = 50): Promise<ProductCardData[]> {
  const data = await shopifyFetch<ShopifyResponse>({
    query: ALL_PRODUCTS_QUERY,
    variables: { first: count },
  });

  const products = data.data.products.edges.map(({ node: product }) => {
    const image = product.images.edges[0]?.node;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const firstVariant = product.variants?.edges[0]?.node;
    const variantId = firstVariant?.id || product.id;
    const quantityAvailable = firstVariant?.quantityAvailable ?? 0;
    const variants = product.variants?.edges.map(({ node }) => node) || [];

    return {
      id: variantId,
      handle: product.handle,
      title: product.title,
      description: product.description,
      price: price,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      imageUrl: image?.url,
      availableForSale: product.availableForSale,
      quantityAvailable: quantityAvailable,
      variants: variants,
      productType: product.productType,
    };
  });

  console.log(`[ShopifyServer] Fetched ${products.length} products. Sample handles:`,
    products.slice(0, 3).map(p => `"${p.handle}"`).join(', '));

  return products;
}
