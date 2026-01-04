"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UNISEX_SIZE_CHART, SIZE_CHART_NOTE, SIZE_CHART_BRAND } from "@/lib/constants";

interface SizingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizingGuide({ isOpen, onClose }: SizingGuideProps) {
  const sizingTips = [
    "All sizes are unisex - designed to fit all body types comfortably",
    "Width: Measure across the chest from armpit to armpit",
    "Length: Measure from the top of the shoulder to the bottom hem",
    "Measurements are in inches and represent the garment laid flat",
    "For a relaxed, oversized look, size up one or two sizes",
    "100% preshrunk cotton - no shrinkage after washing",
  ];

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#927194] to-[#D08F90] rounded-lg">
                  <Ruler className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Unisex Size Guide
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {SIZE_CHART_BRAND}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Unisex Fit Notice */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 rounded-lg border border-[#927194]/20 dark:border-[#D08F90]/20">
                <p className="text-sm font-semibold text-[#927194] dark:text-[#D08F90] text-center">
                  {SIZE_CHART_NOTE}
                </p>
              </div>

              {/* Size Chart */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#927194] to-[#D08F90] text-white">
                      <th className="py-3 px-6 text-left text-sm font-semibold rounded-tl-lg">
                        Size
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">
                        Width (inches)
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold rounded-tr-lg">
                        Length (inches)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNISEX_SIZE_CHART.map((item, index) => (
                      <tr
                        key={item.size}
                        className={`${
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-zinc-800/50"
                            : "bg-white dark:bg-zinc-900"
                        } hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 transition-colors`}
                      >
                        <td className="py-4 px-6 font-bold text-lg text-[#927194] dark:text-[#D08F90]">
                          {item.size}
                        </td>
                        <td className="py-4 px-6 text-base text-gray-700 dark:text-gray-300 font-medium">
                          {item.width}"
                        </td>
                        <td className="py-4 px-6 text-base text-gray-700 dark:text-gray-300 font-medium">
                          {item.length}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measuring Tips */}
              <div className="bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 rounded-xl p-6 border border-[#927194]/20 dark:border-[#D08F90]/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-[#927194] dark:text-[#D08F90]" />
                  Sizing Tips
                </h3>
                <ul className="space-y-3">
                  {sizingTips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#927194] dark:bg-[#D08F90] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
                All products are Gildan brand, sourced from Michaels and Hobby Lobby.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
