"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";
import type { AddToCartProductData } from "@/lib/types";

interface AddToCartButtonProps {
  product: AddToCartProductData;
  size?: string;
}

export function AddToCartButton({ product, size }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      currencyCode: product.currencyCode,
      imageUrl: product.imageUrl,
      variant: size ? {
        id: `${product.id}-${size}`,
        title: size,
      } : undefined,
    });

    // Show success feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    // Open cart after a short delay
    setTimeout(() => openCart(), 300);
  };

  // If size is provided, render as a compact size button
  if (size) {
    return (
      <button
        onClick={handleAddToCart}
        className="w-10 h-10 bg-[#927194]/30 hover:bg-[#927194]/50 text-gray-900 dark:text-white border border-[#927194]/40 rounded-md text-xs font-semibold transition-all duration-200 hover:scale-110"
      >
        {size}
      </button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white transition-all duration-300"
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
            Add to Cart
          </>
        )}
      </motion.div>
    </Button>
  );
}
