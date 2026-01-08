"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-br from-[#F9F4C8] via-[#E8CFA9] to-[#D08F90] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white">
            About{" "}
            <span className="bg-linear-to-r from-[#927194] via-[#D08F90] to-[#A0B094] bg-clip-text text-transparent">
              Grace, Ongoing
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed px-4">
            Spreading faith, love, and positive messages through handmade designs
          </p>
        </motion.div>
      </div>
    </section>
  );
}
