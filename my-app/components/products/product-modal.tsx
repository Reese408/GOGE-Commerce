"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./add-to-cart-button";
import type { ProductCardData } from "@/lib/types";

interface ProductModalProps {
  product: ProductCardData;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
  }).format(product.price);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset image loading state when product changes
  useEffect(() => {
    setImageLoading(true);
  }, [product.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800"
                aria-label="Close modal"
              >
                <X size={20} />
              </Button>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative h-96 md:h-auto bg-gradient-to-br from-[#F9F4C8] via-[#E8CFA9] to-[#D08F90] dark:from-zinc-800 dark:to-zinc-700 rounded-l-2xl overflow-hidden">
                  {product.imageUrl ? (
                    <>
                      {/* Loading skeleton */}
                      {imageLoading && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                      )}
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onLoad={() => setImageLoading(false)}
                        priority
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image available
                    </div>
                  )}

                  {/* Availability badge */}
                  <div className="absolute top-4 left-4 z-10">
                    {product.availableForSale ? (
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

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.title}
                      </h2>
                      <p className="text-2xl font-bold text-[#927194] dark:text-[#D08F90]">
                        {formattedPrice}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {product.description || "No description available."}
                      </p>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                        Product Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Status</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {product.availableForSale ? "In Stock" : "Out of Stock"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Price</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formattedPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-8 space-y-4">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        currencyCode: product.currencyCode,
                        imageUrl: product.imageUrl,
                      }}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Free shipping on orders over $50
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
