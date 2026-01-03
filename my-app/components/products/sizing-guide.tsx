"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SizingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizingGuide({ isOpen, onClose }: SizingGuideProps) {
  const [activeTab, setActiveTab] = useState<"womens" | "mens">("womens");

  const womensSizes = [
    { size: "XS", chest: "30-32", waist: "23-25", hips: "33-35" },
    { size: "S", chest: "32-34", waist: "25-27", hips: "35-37" },
    { size: "M", chest: "34-36", waist: "27-29", hips: "37-39" },
    { size: "L", chest: "36-38", waist: "29-31", hips: "39-41" },
    { size: "XL", chest: "38-40", waist: "31-33", hips: "41-43" },
    { size: "2XL", chest: "40-42", waist: "33-35", hips: "43-45" },
  ];

  const mensSizes = [
    { size: "XS", chest: "32-34", waist: "26-28", hips: "33-35" },
    { size: "S", chest: "34-36", waist: "28-30", hips: "35-37" },
    { size: "M", chest: "38-40", waist: "30-32", hips: "37-39" },
    { size: "L", chest: "42-44", waist: "32-34", hips: "39-41" },
    { size: "XL", chest: "46-48", waist: "36-38", hips: "41-43" },
    { size: "2XL", chest: "50-52", waist: "40-42", hips: "43-45" },
  ];

  const sizingTips = [
    "Measure yourself in inches while wearing undergarments",
    "Chest: Measure around the fullest part of your chest",
    "Waist: Measure around your natural waistline",
    "Hips: Measure around the fullest part of your hips",
    "If between sizes, we recommend sizing up for a comfortable fit",
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#927194] to-[#D08F90] rounded-lg">
                  <Ruler className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sizing Guide
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find your perfect fit
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
              {/* Tabs */}
              <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("womens")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                    activeTab === "womens"
                      ? "bg-white dark:bg-zinc-700 text-[#927194] dark:text-[#D08F90] shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Women&apos;s Sizes
                </button>
                <button
                  onClick={() => setActiveTab("mens")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                    activeTab === "mens"
                      ? "bg-white dark:bg-zinc-700 text-[#927194] dark:text-[#D08F90] shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Men&apos;s Sizes
                </button>
              </div>

              {/* Size Chart */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#927194] to-[#D08F90] text-white">
                      <th className="py-3 px-4 text-left text-sm font-semibold">
                        Size
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">
                        Chest (inches)
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">
                        Waist (inches)
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">
                        Hips (inches)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === "womens" ? womensSizes : mensSizes).map(
                      (size, index) => (
                        <tr
                          key={size.size}
                          className={`${
                            index % 2 === 0
                              ? "bg-gray-50 dark:bg-zinc-800/50"
                              : "bg-white dark:bg-zinc-900"
                          } hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 transition-colors`}
                        >
                          <td className="py-3 px-4 font-semibold text-[#927194] dark:text-[#D08F90]">
                            {size.size}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {size.chest}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {size.waist}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {size.hips}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Measuring Tips */}
              <div className="bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 rounded-xl p-6 border border-[#927194]/20 dark:border-[#D08F90]/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-[#927194] dark:text-[#D08F90]" />
                  How to Measure
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
                Still not sure? Contact our support team for personalized sizing
                assistance
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
