"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddToCartButton } from "./add-to-cart-button";
import type { ProductCardData } from "@/lib/types";

interface ProductCardProps {
  product: ProductCardData;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
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
            <Image
              src={product.imageUrl}
              alt={product.title}
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
      <Link href={`/products/${encodeURIComponent(product.id)}`}>
        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 25vw"
            />

            {!product.availableForSale && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Out of Stock</span>
              </div>
            )}

            {/* Quick Add Overlay - Shows on Hover */}
            <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center font-medium">
                Quick Add
              </p>
              <div className="flex gap-1 justify-center">
                {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                  <AddToCartButton
                    key={size}
                    product={{
                      ...product,
                      id: `${product.id}-${size}`,
                    }}
                    size={size}
                  />
                ))}
              </div>
            </div>
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
