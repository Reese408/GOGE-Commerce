import { Suspense } from "react";
import { ShopContent } from "@/components/shop/shop-content";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getProducts } from "@/lib/shopify-server";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "Shop All Products | Grace, Ongoing",
  description: "Explore our full collection of faith-inspired apparel and accessories",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const sortOption = params.sort || "featured";

  // Fetch products server-side
  const allProducts = await getProducts(50);

  // Filter products server-side based on category
  const filteredProducts = filterProductsByCategory(allProducts, category);

  // Sort products server-side
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto max-w-7xl py-12 px-6 sm:px-8">
        {/* Header - Server Component */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shop All Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our full collection of faith-inspired apparel and
            accessories
          </p>
        </div>

        {/* Client Component Island for Interactions Only */}
        <Suspense fallback={<LoadingSpinner />}>
          <ShopContent
            products={sortedProducts}
            initialCategory={category}
            initialSort={sortOption}
          />
        </Suspense>
      </main>
    </div>
  );
}

// Server-side filtering logic
function filterProductsByCategory(products: any[], category: string) {
  if (category === "all") {
    return products;
  }

  return products.filter((product) => {
    const productType = (product.productType || "").toLowerCase();
    const title = product.title.toLowerCase();

    if (category === "shirts") {
      return (
        (productType.includes("shirt") && !productType.includes("sweatshirt")) ||
        productType.includes("tee") ||
        (productType.includes("top") && !productType.includes("button")) ||
        productType.includes("t-shirt") ||
        (!productType && (
          (title.includes("shirt") && !title.includes("sweatshirt")) ||
          title.includes("tee") ||
          title.includes("t-shirt")
        ))
      );
    } else if (category === "sweatshirts") {
      return (
        productType.includes("sweatshirt") ||
        productType.includes("hoodie") ||
        productType.includes("pullover") ||
        productType.includes("crewneck") ||
        (!productType && (title.includes("sweatshirt") || title.includes("hoodie") || title.includes("pullover")))
      );
    } else if (category === "accessories") {
      const isShirt =
        productType.includes("shirt") ||
        productType.includes("tee") ||
        productType.includes("t-shirt") ||
        title.includes("shirt") ||
        title.includes("tee") ||
        title.includes("t-shirt");

      const isSweatshirt =
        productType.includes("sweatshirt") ||
        productType.includes("hoodie") ||
        productType.includes("pullover") ||
        title.includes("sweatshirt") ||
        title.includes("hoodie") ||
        title.includes("pullover");

      if (isShirt || isSweatshirt) return false;

      return (
        productType.includes("sticker") ||
        productType.includes("button") ||
        productType.includes("pin") ||
        productType.includes("accessory") ||
        productType.includes("accessori") ||
        title.includes("sticker") ||
        title.includes("button") ||
        title.includes("pin")
      );
    }
    return false;
  });
}

// Server-side sorting logic
function sortProducts(products: any[], sortOption: string) {
  const sorted = [...products];

  switch (sortOption) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      // Sort by ID (newer products typically have higher IDs)
      return sorted.reverse();
    default:
      return sorted; // featured order
  }
}
