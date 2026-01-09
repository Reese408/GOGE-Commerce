"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddToCartButton } from "./add-to-cart-button";
import { useCartStore } from "@/lib/store/cart-store";
import { Loader2 } from "lucide-react";
import type { ProductCardData } from "@/lib/types";

interface ProductCardProps {
  product: ProductCardData;
  featured?: boolean;
  priority?: boolean;
}

export function ProductCard({ product, featured = false, priority = false }: ProductCardProps) {
  const { items } = useCartStore();
  const [hoveredVariantId, setHoveredVariantId] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
  }).format(product.price);

  if (featured) {
    // Large featured layout
    return (
      <div className="flex flex-col lg:flex-row gap-8 items-start bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 shadow-lg">
        {/* Product Image */}
        {product.imageUrl && (
          <div className="w-full lg:w-1/2 relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
                <Loader2 className="w-8 h-8 text-gray-400 dark:text-zinc-600 animate-spin" />
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              onLoad={() => setImageLoading(false)}
              priority={priority || featured}
            />
          </div>
        )}

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Product Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {product.title}
          </h1>

          {/* Product Price */}
          <div className="text-3xl font-semibold text-[#927194] dark:text-[#D08F90]">
            {formattedPrice}
          </div>

          {/* Availability Badge */}
          <div>
            {product.availableForSale ? (
              <span className="inline-block px-4 py-2 bg-[#A0B094]/20 dark:bg-[#A0B094]/30 text-[#A0B094] dark:text-[#A0B094] rounded-full text-sm font-medium">
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
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-6">
            <AddToCartButton
              product={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: product.price,
                currencyCode: product.currencyCode,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          {/* Product ID (for debugging) */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-6 border-t border-gray-200 dark:border-zinc-700">
            Product ID: {product.id}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout for regular products - Gymshark style
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group bg-white dark:bg-zinc-900 overflow-hidden"
    >
      <Link href={`/products/${product.handle}`}>
        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-zinc-800">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 z-10">
                <Loader2 className="w-8 h-8 text-gray-400 dark:text-zinc-600 animate-spin" />
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-700 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
              onLoad={() => setImageLoading(false)}
              priority={priority}
            />

            {!product.availableForSale && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Out of Stock</span>
              </div>
            )}

            {/* Quick Add Overlay - Shows on Hover */}
            {product.variants && product.variants.length > 0 && product.variants[0].title !== "Default Title" ? (
              <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center font-medium">
                  Quick Add
                </p>
                <div className="flex gap-1 justify-center flex-wrap">
                  {product.variants.map((variant) => {
                    const sizeOption = variant.selectedOptions.find(opt => opt.name === "Size");
                    const size = sizeOption?.value || variant.title;
                    const quantityAvailable = variant.quantityAvailable ?? 0;
                    const isAvailable = variant.availableForSale && quantityAvailable > 0;

                    return (
                      <AddToCartButton
                        key={variant.id}
                        product={{
                          id: variant.id,
                          handle: product.handle,
                          title: product.title,
                          price: parseFloat(variant.price.amount),
                          currencyCode: variant.price.currencyCode,
                          imageUrl: product.imageUrl,
                        }}
                        size={size}
                        disabled={!isAvailable}
                        variant={variant}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <AddToCartButton
                  product={{
                    id: product.id,
                    handle: product.handle,
                    title: product.title,
                    price: product.price,
                    currencyCode: product.currencyCode,
                    imageUrl: product.imageUrl,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="p-3 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#927194] dark:group-hover:text-[#D08F90] transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
