"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCartStore();

  const total = totalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={24} />
                Cart
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag
                    size={64}
                    className="text-gray-300 dark:text-zinc-700 mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Add some products to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4"
                    >
                      {/* Product Image */}
                      {item.imageUrl && (
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-700 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.variant.title}
                          </p>
                        )}
                        <p className="text-sm font-medium text-[#927194] dark:text-[#D08F90] mt-2">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: item.currencyCode,
                          }).format(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-7 w-7"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-7 w-7"
                          >
                            <Plus size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-zinc-800 p-6 bg-gray-50 dark:bg-zinc-800/50">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-[#927194] dark:text-[#D08F90]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: items[0].currencyCode,
                    }).format(total)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
