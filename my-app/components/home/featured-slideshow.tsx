"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Slide {
  id: number;
  title: string;
  description: string;
  image1: string;
  image2: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Faith-Inspired Apparel",
    description: "Wear your faith with pride. Premium quality designs that inspire.",
    image1: "https://cdn.shopify.com/s/files/1/0937/2788/files/tshirt-1.jpg?v=1735702800",
    image2: "https://cdn.shopify.com/s/files/1/0937/2788/files/tshirt-2.jpg?v=1735702800",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    bgColor: "from-[#927194]/10 to-[#D08F90]/10",
  },
  {
    id: 2,
    title: "New Collection",
    description: "Discover our latest faith-based designs for every season.",
    image1: "https://cdn.shopify.com/s/files/1/0937/2788/files/hoodie-1.jpg?v=1735702800",
    image2: "https://cdn.shopify.com/s/files/1/0937/2788/files/hoodie-2.jpg?v=1735702800",
    ctaText: "Explore",
    ctaLink: "/collections",
    bgColor: "from-[#A0B094]/10 to-[#927194]/10",
  }];

export function FeaturedSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Slideshow Container */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} dark:from-zinc-800 dark:to-zinc-900`}
              >
                <div className="h-full flex items-center justify-between px-12 md:px-20">
                  {/* Left Side - Text Content */}
                  <div className="flex-1 max-w-xl z-10">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
                    >
                      {slide.description}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href={slide.ctaLink}>
                        <Button
                          size="lg"
                          className="bg-[#927194] hover:bg-[#927194]/90 text-white px-8 py-6 text-lg rounded-full"
                        >
                          {slide.ctaText}
                        </Button>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right Side - Two Images */}
                  <div className="hidden md:flex gap-6 flex-1 justify-end items-center">
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    >
                      <Image
                        src={slide.image1}
                        alt={`${slide.title} - Image 1`}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                    >
                      <Image
                        src={slide.image2}
                        alt={`${slide.title} - Image 2`}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-gray-900 dark:text-white" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="text-gray-900 dark:text-white" size={24} />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="text-gray-900 dark:text-white" size={20} />
              ) : (
                <Pause className="text-gray-900 dark:text-white" size={20} />
              )}
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-12 bg-[#927194] dark:bg-[#D08F90]"
                    : "w-2 bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
