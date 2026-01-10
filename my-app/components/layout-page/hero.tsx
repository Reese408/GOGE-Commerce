"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and enable animations only after hydration
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    setMounted(true);

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollY } = useScroll();

  // Disable scroll animations on mobile to prevent jank
  const opacity = useTransform(
    scrollY,
    [0, 300],
    (!mounted || isMobile) ? [1, 1] : [1, 0]
  );

  const scale = useTransform(
    scrollY,
    [0, 300],
    (!mounted || isMobile) ? [1, 1] : [1, 0.9]
  );

  const y = useTransform(
    scrollY,
    [0, 300],
    (!mounted || isMobile) ? [0, 0] : [0, -50]
  );

  return (
    <motion.section
      style={isMobile ? {} : { opacity, scale }}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#F9F4C8] via-[#E8CFA9] to-[#D08F90]
      dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800"
    >
      {/* Background Orbs - Reduced animation complexity on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={isMobile ? {} : { scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full
          bg-gradient-to-br from-[#927194]/30 to-transparent
          rounded-full blur-3xl"
        />
        <motion.div
          animate={isMobile ? {} : { scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full
          bg-gradient-to-tl from-[#A0B094]/30 to-transparent
          rounded-full blur-3xl"
        />
      </div>

      {/* Hero Content */}
      <motion.div
        style={isMobile ? {} : { y }}
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
    </motion.section>
  );
}
