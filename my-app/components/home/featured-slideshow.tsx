"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SLIDESHOW_IMAGE_1_URL, SLIDESHOW_IMAGE_2_URL } from "@/lib/config";

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
    image: SLIDESHOW_IMAGE_1_URL,
    imagePosition: "left",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    bgColor: "from-[#927194]/10 to-[#D08F90]/10",
  },
  {
    id: 2,
    title: "New Collection",
    description: "Discover our latest faith-based designs for every season.",
    image: SLIDESHOW_IMAGE_2_URL,
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
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        {/* Slideshow Container - Full Width */}
        <div className="relative w-full h-[700px] overflow-hidden">
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
              className="absolute inset-0"
            >
              {/* Full Width Image Background */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={`${slide.title} - ${slide.description}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
              </div>

              {/* Text Content Overlay */}
              <div className={`relative h-full flex items-center ${slide.imagePosition === "left" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-2xl px-8 md:px-16 lg:px-24">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md"
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
                        className="bg-white hover:bg-white/90 text-gray-900 px-10 py-7 text-xl rounded-full font-semibold shadow-2xl"
                      >
                        {slide.ctaText}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-gray-900 dark:text-white" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-lg backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="text-gray-900 dark:text-white" size={24} />
          </button>

          {/* Play/Pause Button with Progress Ring */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="relative w-[52px] h-[52px]">
              {/* SVG Progress Ring */}
              <svg
                className="absolute inset-0 -rotate-90 pointer-events-none"
                width="52"
                height="52"
              >
                {/* Background */}
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  stroke="#ffffff"
                  strokeWidth="5"
                  fill="none"
                  opacity="0.3"
                />

                {/* Progress - Always White */}
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  stroke="#ffffff"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
              {/* Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all shadow-lg border border-white/30"
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {isPaused ? (
                  <Play className="text-white" size={20} />
                ) : (
                  <Pause className="text-white" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-6 pb-6">
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
    </section>
  );
}
