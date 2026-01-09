"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface VideoIntroProps {
  videoSrc: string;
  posterSrc?: string;
}

export function VideoIntro({ videoSrc, posterSrc }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play when video comes into view
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!videoRef.current) return;

          if (entry.isIntersecting) {
            videoRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.5 }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => observer.disconnect();
    }, []);



    const togglePlay = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        if (video.paused) {
          if (video.readyState < 2) return; // not enough data yet
          await video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      } catch {
        // media not ready or unsupported
      }
    };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        poster={posterSrc || undefined}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />


      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Content overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Handcrafted with Love
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
            Every piece tells a story of faith, creativity, and purpose
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm uppercase tracking-wider">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 bg-white/70 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Video controls */}
      <div className="absolute bottom-8 right-8 flex gap-3">
        <button
          onClick={togglePlay}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </section>
  );
}
