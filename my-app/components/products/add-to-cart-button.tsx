"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";
import type { AddToCartProductData } from "@/lib/types";

interface AddToCartButtonProps {
  product: AddToCartProductData;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      currencyCode: product.currencyCode,
      imageUrl: product.imageUrl,
    });

    // Show success feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    // Open cart after a short delay
    setTimeout(() => openCart(), 300);
  };

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
