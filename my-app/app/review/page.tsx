"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, ShoppingBag, Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { createCheckout, redirectToCheckout } from "@/lib/shopify-checkout";
import { toast } from "sonner";

export default function ReviewPage() {
  const router = useRouter();
  const { items, totalPrice, updateQuantity, removeItem } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize subtotal calculation
  const subtotal = useMemo(() => totalPrice(), [items]);

  // Memoize checkout handler
  const handleProceedToCheckout = useCallback(async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Transform cart items to Shopify checkout line items
      const lineItems = items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
      }));

      // Create Shopify checkout
      const checkout = await createCheckout(lineItems);

      if (!checkout.webUrl) {
        throw new Error("No checkout URL returned from Shopify");
      }

      // Redirect to Shopify checkout
      redirectToCheckout(checkout.webUrl);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create checkout. Please try again."
      );
      setIsProcessing(false);
    }
  }, [items]);

  // Memoize quantity handlers to prevent re-renders
  const handleUpdateQuantity = useCallback((itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeItem(itemId);
  }, [removeItem]);

  const handleBackToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          {/* Sticky Back Button Bar */}
          <div className="sticky top-0 z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-6 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold"
            >
              <ChevronLeft size={20} />
              Back to Home
            </Button>
          </div>

          <div className="text-center py-20">
            <ShoppingBag
              size={64}
              className="mx-auto mb-6 text-gray-300 dark:text-zinc-700"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some products to get started
            </p>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-[#927194] hover:bg-[#927194]/90 text-white"
            >
              Shop Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Sticky Back Button Bar */}
        <div className="sticky top-0 z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-6 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Review Your Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your items before proceeding to secure checkout
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Final pricing calculated at checkout
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Shipping costs, taxes, and any applicable discounts will be calculated by Shopify during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Cart Items ({items.length})
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg"
              >
                {/* Product Image */}
                {item.imageUrl && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-700 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {item.variant.title}
                    </p>
                  )}
                  <p className="text-lg font-bold text-[#927194] dark:text-[#D08F90]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: item.currencyCode,
                    }).format(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 size={18} />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="text-sm font-medium w-10 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: items[0].currencyCode,
                }).format(subtotal)}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-3">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Discounts</span>
                <span>Applied at checkout</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            size="lg"
            onClick={handleProceedToCheckout}
            disabled={isProcessing}
            className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Creating checkout...
              </div>
            ) : (
              "Proceed to Shopify Checkout"
            )}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            You'll be redirected to Shopify's secure checkout to complete your purchase
          </p>
        </div>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Secure checkout powered by Shopify</p>
        </div>
      </div>
    </div>
  );
}
