"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export function UndoToast() {
  const { removedItems, undoRemoveById, dismissRemovedItem } = useCartStore();
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Create timers for new items
    removedItems.forEach((removed) => {
      if (!timersRef.current.has(removed.timestamp)) {
        const timer = setTimeout(() => {
          dismissRemovedItem(removed.timestamp);
        }, 5000);
        timersRef.current.set(removed.timestamp, timer);
      }
    });

    // Clean up timers for removed items
    const currentTimestamps = new Set(removedItems.map(r => r.timestamp));
    timersRef.current.forEach((timer, timestamp) => {
      if (!currentTimestamps.has(timestamp)) {
        clearTimeout(timer);
        timersRef.current.delete(timestamp);
      }
    });

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [removedItems, dismissRemovedItem]);

  return (
    <div className="fixed bottom-4 right-4 md:right-[26rem] w-[calc(100%-2rem)] md:w-[400px] z-[60] pointer-events-none flex flex-col-reverse gap-2">
      <AnimatePresence mode="popLayout">
        {removedItems.map((removed) => (
          <motion.div
            key={removed.timestamp}
            layout
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              layout: { duration: 0.2 }
            }}
            className="pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-[#927194] to-[#D08F90] rounded-xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                {/* Product Image */}
                {removed.item.imageUrl && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    <Image
                      src={removed.item.imageUrl}
                      alt={removed.item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {removed.item.title}
                  </p>
                  {removed.item.variant && (
                    <p className="text-xs text-white/80">
                      {removed.item.variant.title}
                    </p>
                  )}
                  <p className="text-xs text-white/70 mt-1">
                    Removed from cart
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => undoRemoveById(removed.timestamp)}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  >
                    <RotateCcw size={14} className="mr-1.5" />
                    Undo
                  </Button>
                  <button
                    onClick={() => dismissRemovedItem(removed.timestamp)}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-1 bg-white/40 origin-left"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
