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
  image: string;
  imagePosition: "left" | "right";
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Faith-Inspired Apparel",
    description: "Wear your faith with pride. Premium quality designs that inspire.",
    image: "/placeholder-1.jpg",
    imagePosition: "left",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    bgColor: "from-[#927194]/10 to-[#D08F90]/10",
  },
  {
    id: 2,
    title: "New Collection",
    description: "Discover our latest faith-based designs for every season.",
    image: "/placeholder-2.jpg",
    imagePosition: "right",
    ctaText: "Explore",
    ctaLink: "/shop",
    bgColor: "from-[#A0B094]/10 to-[#927194]/10",
  },
];

export function FeaturedSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);

  const AUTO_ADVANCE_TIME = 5000; // 5 seconds

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0); // Reset progress when changing slides
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0); // Reset progress when changing slides
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0); // Reset progress when changing slides
  }, [currentSlide]);

  // Progress bar animation
  useEffect(() => {
    if (!isPaused) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / AUTO_ADVANCE_TIME) * 100;

        if (newProgress >= 100) {
          nextSlide();
        } else {
          setProgress(newProgress);
        }
      }, 50); // Update every 50ms for smooth animation

      return () => clearInterval(interval);
    } else {
      // Keep progress frozen when paused
      setProgress((prev) => prev);
    }
  }, [isPaused, currentSlide, nextSlide]);

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
  const circumference = 2 * Math.PI * 22; // radius = 22
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <section className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Slideshow Container */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
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
                <div className={`h-full flex ${slide.imagePosition === "right" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Image Side - Takes up half */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-1/2 h-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="50vw"
                      priority
                    />
                  </motion.div>

                  {/* Text Side - Takes up half */}
                  <div className="w-1/2 flex items-center justify-center px-12 md:px-20">
                    <div className="max-w-xl">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4"
                      >
                        {slide.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
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
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-gray-800 dark:text-white" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="text-gray-800 dark:text-white" size={24} />
            </button>

            {/* Play/Pause Button with Progress Ring */}
            <div className="absolute bottom-6 right-6 z-20">
              <div className="relative w-[52px] h-[52px]">
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 -rotate-90" width="52" height="52" style={{ opacity: 1 }}>
                  {/* Background circle */}
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    stroke="#d1d5db"
                    strokeWidth="4"
                    fill="none"
                    opacity="1"
                  />
                  {/* Progress circle - Light mode */}
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    stroke="#2563eb"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-100 ease-linear dark:hidden"
                    strokeLinecap="round"
                    opacity="1"
                  />
                  {/* Progress circle - Dark mode */}
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    stroke="#D08F90"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="hidden dark:block transition-all duration-100 ease-linear"
                    strokeLinecap="round"
                    opacity="1"
                  />
                </svg>

                {/* Button */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg"
                  aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                >
                  {isPaused ? (
                    <Play className="text-gray-800 dark:text-white" size={20} />
                  ) : (
                    <Pause className="text-gray-800 dark:text-white" size={20} />
                  )}
                </button>
              </div>
            </div>
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
