"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CartItem } from "@/lib/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Order Summary
      </h2>

      {/* Items List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 bg-white dark:bg-zinc-800 rounded-lg p-4"
          >
            {/* Product Image */}
            {item.imageUrl && (
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-700 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {item.title}
              </h3>
              {item.variant && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Size: {item.variant.title}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: item.currencyCode,
                  }).format(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${tax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t-2 border-gray-300 dark:border-zinc-600">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-2xl font-bold text-[#927194] dark:text-[#D08F90]">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
