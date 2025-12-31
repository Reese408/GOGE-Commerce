"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductModal } from "./product-modal";
import { Button } from "@/components/ui/button";
import type { ProductCardData } from "@/lib/types";

interface ProductCardProps {
  product: ProductCardData;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Grid layout for regular products
  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      >
        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-white/90 hover:bg-white text-gray-900 font-semibold gap-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"
              >
                <Eye size={18} />
                Quick View
              </Button>
            </motion.div>

            {!product.availableForSale && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#927194] dark:group-hover:text-[#D08F90] transition-colors">
            {product.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#927194] dark:text-[#D08F90]">
              {formattedPrice}
            </span>
          </div>

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
      </motion.div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
