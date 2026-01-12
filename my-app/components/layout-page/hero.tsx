"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative h-[100svh] flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#F9F4C8] via-[#E8CFA9] to-[#D08F90]
      dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800"
    >
      {/* Background Orbs - Subtle CSS animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full
          bg-gradient-to-br from-[#927194]/30 to-transparent
          rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full
          bg-gradient-to-tl from-[#A0B094]/30 to-transparent
          rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <div className="space-y-8">
          {/* Badge */}
          <span className="inline-block px-4 py-2
            bg-white/20 dark:bg-white/10 backdrop-blur
            border border-white/30 dark:border-white/20
            rounded-full text-sm font-medium
            text-gray-800 dark:text-gray-200">
            New Collection Available
          </span>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
            <span className="block bg-linear-to-r from-[#927194] via-[#D08F90] to-[#A0B094]
              bg-clip-text text-transparent">
              Grace, Ongoing
            </span>
            <span className="block mt-2 text-gray-800 dark:text-white">
              Style That Lasts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl
            text-gray-700 dark:text-gray-300 leading-relaxed">
            Discover timeless pieces that blend elegance with everyday comfort.
            Curated collections for those who value quality and authenticity.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-[#927194] hover:bg-[#927194]/90 text-white px-8 py-6 rounded-full">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline"
                className="border-2 border-gray-800 dark:border-white px-8 py-6 rounded-full">
                Our Story
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowDown size={24} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32
        bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
    </section>
  );
}
