"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Ruler, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useProductDetail } from "@/lib/hooks/use-product-detail";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SizingGuide } from "@/components/products/sizing-guide";
import { PRODUCT_WEIGHTS } from "@/lib/constants";
import { toast } from "sonner";
import type { ProductVariant } from "@/lib/types";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { addItem, openCart, items } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [showSizingGuide, setShowSizingGuide] = useState(false);

  const { data: product, isLoading, isError, error } = useProductDetail(productId);

  // Set default variant when product loads
  useEffect(() => {
    if (product && product.variants.edges.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants.edges[0].node);
    }
  }, [product, selectedVariant]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Error loading product
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error instanceof Error ? error.message : "Product not found"}
          </p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges.map((edge) => edge.node);
  const currentImage = images[selectedImage]?.node;

  const formattedPrice = selectedVariant
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: selectedVariant.price.currencyCode,
      }).format(parseFloat(selectedVariant.price.amount))
    : "";

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Check if variant is available for sale and has stock
    const quantityAvailable = selectedVariant.quantityAvailable ?? 0;
    if (!selectedVariant.availableForSale || quantityAvailable <= 0) {
      toast.error("This item is out of stock");
      return;
    }

    // Determine product weight based on product title
    const getProductWeight = (): number => {
      const titleLower = product.title.toLowerCase();

      // Check for hoodies
      if (titleLower.includes("hoodie")) {
        return PRODUCT_WEIGHTS.HOODIE;
      }

      // Check for stickers
      if (titleLower.includes("sticker")) {
        return PRODUCT_WEIGHTS.STICKER;
      }

      // Check for t-shirts (default for apparel)
      if (
        titleLower.includes("shirt") ||
        titleLower.includes("tee") ||
        titleLower.includes("t-shirt")
      ) {
        return PRODUCT_WEIGHTS.TSHIRT;
      }

      // Default weight for unknown items
      return PRODUCT_WEIGHTS.DEFAULT;
    };

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      handle: product.handle,
      title: product.title,
      price: parseFloat(selectedVariant.price.amount),
      currencyCode: selectedVariant.price.currencyCode,
      quantity: 1,
      imageUrl: currentImage?.url,
      variant: {
        id: selectedVariant.id,
        title: selectedVariant.title,
      },
      weight: getProductWeight(),
      quantityAvailable: selectedVariant.quantityAvailable,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  // Extract size options from variants
  const sizeOptions = variants
    .map((variant) => {
      const sizeOption = variant.selectedOptions.find((opt) => opt.name === "Size");
      return sizeOption ? sizeOption.value : variant.title;
    })
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <ChevronLeft size={20} />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-[#F9F4C8] via-[#E8CFA9] to-[#D08F90] dark:from-zinc-800 dark:to-zinc-700 rounded-2xl overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              )}
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => setImageLoading(false)}
                  priority
                />
              )}

              {/* Availability badge */}
              <div className="absolute top-4 left-4 z-10">
                {selectedVariant?.availableForSale ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageLoading(true);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#927194] dark:border-[#D08F90]"
                        : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <Image
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-[#927194] dark:text-[#D08F90]">
                {formattedPrice}
              </p>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Size Selector */}
            {sizeOptions.length > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Select Size
                  </h3>
                  <button
                    onClick={() => setShowSizingGuide(true)}
                    className="flex items-center gap-2 text-sm text-[#927194] dark:text-[#D08F90] hover:underline transition-colors"
                  >
                    <Ruler size={16} />
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {sizeOptions.map((size) => {
                    const variant = variants.find((v) => {
                      const sizeOpt = v.selectedOptions.find((opt) => opt.name === "Size");
                      return (sizeOpt ? sizeOpt.value : v.title) === size;
                    });

                    const isSelected = selectedVariant?.id === variant?.id;
                    const quantityAvailable = variant?.quantityAvailable ?? 0;
                    const isAvailable = variant?.availableForSale && quantityAvailable > 0;

                    // Check if user has all available stock in cart
                    const itemInCart = items.find((item) => item.id === variant?.id);
                    const quantityInCart = itemInCart?.quantity ?? 0;
                    const allStockInCart = quantityAvailable > 0 && quantityInCart >= quantityAvailable;

                    const isDisabled = !isAvailable || allStockInCart;

                    return (
                      <motion.button
                        key={size}
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        onClick={() => variant && !isDisabled && setSelectedVariant(variant)}
                        disabled={isDisabled}
                        className={`relative py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                          isSelected
                            ? "border-[#927194] bg-[#927194]/10 text-[#927194] dark:border-[#D08F90] dark:bg-[#D08F90]/10 dark:text-[#D08F90]"
                            : !isDisabled
                            ? "border-gray-300 dark:border-zinc-700 hover:border-[#927194] dark:hover:border-[#D08F90] text-gray-900 dark:text-white"
                            : "border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed opacity-40"
                        }`}
                      >
                        <span className="block">{size}</span>
                        {isSelected && !isDisabled && (
                          <Check
                            size={16}
                            className="absolute top-1 right-1 text-[#927194] dark:text-[#D08F90]"
                          />
                        )}
                        {isDisabled && (
                          <X
                            size={20}
                            className="absolute inset-0 m-auto text-gray-400 dark:text-zinc-600"
                            strokeWidth={3}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4 pt-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={20} />
                    Added to Cart!
                  </motion.div>
                ) : selectedVariant?.availableForSale ? (
                  "Add to Cart"
                ) : (
                  "Out of Stock"
                )}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Free shipping on orders over $75
              </p>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedVariant?.availableForSale ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Variants</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {variants.length} options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Guide Modal */}
      <SizingGuide isOpen={showSizingGuide} onClose={() => setShowSizingGuide(false)} />
    </div>
  );
}
