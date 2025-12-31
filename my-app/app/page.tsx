import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { shopifyFetch } from "@/lib/shopify";
import { SINGLE_PRODUCT_QUERY } from "@/lib/queries";

// Define TypeScript interfaces for type safety
// This helps catch errors during development and provides autocomplete
interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  availableForSale: boolean;
}

interface ShopifyResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

export default async function Home() {
  // Fetch product data from Shopify using the Storefront API
  const data = await shopifyFetch<ShopifyResponse>({
    query: SINGLE_PRODUCT_QUERY,
  });

  const product = data.data.products.edges[0]?.node;

  // Handle case where no products exist in the store
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No products found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add products to your Shopify store to see them here.
          </p>
        </div>
      </div>
    );
  }

  const image = product.images.edges[0]?.node;

  // Format price for display (convert string to number and format with currency)
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex min-h-screen w-full max-w-4xl flex-col py-16 px-6 sm:px-16 bg-white dark:bg-zinc-900 shadow-lg">
        {/* Header with mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Showcase</h1>
          <ModeToggle />
        </div>

        {/* Product Card */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Product Image */}
          {image && (
            <div className="w-full lg:w-1/2 relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Product Title */}
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h2>

            {/* Product Price */}
            <div className="text-3xl font-semibold text-green-600 dark:text-green-400">
              {formattedPrice}
            </div>

            {/* Availability Badge */}
            <div>
              {product.availableForSale ? (
                <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product ID (for debugging) */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-6 border-t border-gray-200 dark:border-zinc-700">
              Product ID: {product.id}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
