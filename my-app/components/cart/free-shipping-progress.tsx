"use client";

import { motion } from "framer-motion";
import { Truck, Check } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

interface FreeShippingProgressProps {
  currentSubtotal: number;
}

export function FreeShippingProgress({ currentSubtotal }: FreeShippingProgressProps) {
  const remaining = FREE_SHIPPING_THRESHOLD - currentSubtotal;
  const qualifies = currentSubtotal >= FREE_SHIPPING_THRESHOLD;
  const progress = Math.min((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-[#927194]/10 to-[#A0B094]/10 dark:from-[#927194]/20 dark:to-[#A0B094]/20 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          qualifies
            ? "bg-green-500 text-white"
            : "bg-[#927194]/20 text-[#927194] dark:bg-[#927194]/30 dark:text-[#D08F90]"
        }`}>
          {qualifies ? <Check size={16} /> : <Truck size={16} />}
        </div>
        <div className="flex-1">
          {qualifies ? (
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
              🎉 You qualify for free shipping!
            </p>
          ) : (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              You're{" "}
              <span className="font-bold text-[#927194] dark:text-[#D08F90]">
                ${remaining.toFixed(2)}
              </span>{" "}
              away from free shipping
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            qualifies
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-[#927194] to-[#D08F90]"
          }`}
        />
      </div>

      {/* Threshold Marker */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>${currentSubtotal.toFixed(2)}</span>
        <span className="font-semibold">${FREE_SHIPPING_THRESHOLD}</span>
      </div>
    </div>
  );
}
