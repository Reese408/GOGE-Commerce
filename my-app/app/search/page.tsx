"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Search className="text-[#927194]" size={32} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>

          {query && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Showing results for:{" "}
              <strong className="text-gray-900 dark:text-white">
                "{query}"
              </strong>
            </p>
          )}
        </motion.div>

        {/* Actual results */}
        <SearchResults query={query} />
      </div>
    </div>
  );
}
