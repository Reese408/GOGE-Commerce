"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";
import { PRODUCT_WEIGHTS } from "@/lib/constants";
import type { AddToCartProductData, ProductVariant } from "@/lib/types";

interface AddToCartButtonProps {
  product: AddToCartProductData;
  size?: string;
  disabled?: boolean;
  variant?: ProductVariant;
}

export function AddToCartButton({ product, size, disabled = false, variant }: AddToCartButtonProps) {
  const { addItem, openCart, items } = useCartStore();
  const [added, setAdded] = useState(false);

  // Check if user already has all available stock in cart
  const itemInCart = items.find((item) => item.id === product.id);
  const quantityInCart = itemInCart?.quantity ?? 0;
  const quantityAvailable = variant?.quantityAvailable ?? 0;
  const allStockInCart = quantityAvailable > 0 && quantityInCart >= quantityAvailable;

  // Determine product weight based on product title
  const getProductWeight = (): number => {
    const titleLower = product.title.toLowerCase();

    if (titleLower.includes("hoodie")) {
      return PRODUCT_WEIGHTS.HOODIE;
    }
    if (titleLower.includes("sticker")) {
      return PRODUCT_WEIGHTS.STICKER;
    }
    if (
      titleLower.includes("shirt") ||
      titleLower.includes("tee") ||
      titleLower.includes("t-shirt")
    ) {
      return PRODUCT_WEIGHTS.TSHIRT;
    }
    return PRODUCT_WEIGHTS.DEFAULT;
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (disabled || allStockInCart) return;

    addItem({
      id: product.id, // This is the variant ID
      productId: product.id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      currencyCode: product.currencyCode,
      imageUrl: product.imageUrl,
      variant: variant ? {
        id: variant.id,
        title: size || variant.title,
      } : size ? {
        id: product.id,
        title: size,
      } : undefined,
      weight: getProductWeight(),
      quantityAvailable: variant?.quantityAvailable,
    });

    // Show success feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    // Open cart after a short delay
    setTimeout(() => openCart(), 300);
  };

  // If size is provided, render as a compact size button
  if (size) {
    const isDisabled = disabled || allStockInCart;

    return (
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-10 h-10 border rounded-md text-xs font-semibold transition-all duration-200 ${
          isDisabled
            ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 border-gray-300 dark:border-zinc-700 cursor-not-allowed opacity-40"
            : "bg-[#927194]/30 hover:bg-[#927194]/50 text-gray-900 dark:text-white border-[#927194]/40 hover:scale-110"
        }`}
        title={allStockInCart ? "All available stock in cart" : disabled ? "Out of stock" : ""}
      >
        {size}
      </button>
    );
  }

  const isDisabled = disabled || allStockInCart;

  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full transition-all duration-300 ${
        isDisabled
          ? "bg-gray-400 dark:bg-zinc-700 cursor-not-allowed opacity-50"
          : "bg-[#927194] hover:bg-[#927194]/90"
      } text-white`}
      title={allStockInCart ? "All available stock in cart" : disabled ? "Out of stock" : ""}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={added ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {added ? (
          <>
            <Check size={20} />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            {isDisabled ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </motion.div>
    </Button>
  );
}
