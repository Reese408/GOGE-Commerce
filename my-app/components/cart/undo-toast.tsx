"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export function UndoToast() {
  const { recentlyRemoved, undoRemove, clearRecentlyRemoved } = useCartStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (recentlyRemoved) {
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => clearRecentlyRemoved(), 300); // Wait for animation to finish
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [recentlyRemoved, clearRecentlyRemoved]);

  const handleUndo = () => {
    undoRemove();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => clearRecentlyRemoved(), 300); // Wait for animation to finish
  };

  if (!recentlyRemoved) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-[420px] sm:w-[360px] z-[60] pointer-events-auto"
        >
          <div className="bg-gradient-to-r from-[#927194] to-[#D08F90] rounded-xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              {/* Product Image */}
              {recentlyRemoved.imageUrl && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                  <Image
                    src={recentlyRemoved.imageUrl}
                    alt={recentlyRemoved.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {recentlyRemoved.title}
                </p>
                {recentlyRemoved.variant && (
                  <p className="text-xs text-white/80">
                    {recentlyRemoved.variant.title}
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
                  onClick={handleUndo}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                >
                  <RotateCcw size={14} className="mr-1.5" />
                  Undo
                </Button>
                <button
                  onClick={handleDismiss}
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
      )}
    </AnimatePresence>
  );
}
