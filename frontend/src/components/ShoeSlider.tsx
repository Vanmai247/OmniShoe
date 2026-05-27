"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideItem {
  id: number;
  name: string;
  color: string;
  glowColor: string;
  image: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    name: "Volt Green Edition",
    color: "#39ff14",
    glowColor: "rgba(57, 255, 20, 0.2)",
    image: "/sneaker-green.png",
  },
  {
    id: 2,
    name: "Hyper Pink Edition",
    color: "#ff007f",
    glowColor: "rgba(255, 0, 127, 0.2)",
    image: "/sneaker-pink.png",
  },
  {
    id: 3,
    name: "Cyber Yellow Edition",
    color: "#ffea00",
    glowColor: "rgba(255, 234, 0, 0.2)",
    image: "/sneaker-yellow.png",
  },
  {
    id: 4,
    name: "Cosmic Purple Edition",
    color: "#b026ff",
    glowColor: "rgba(176, 38, 255, 0.2)",
    image: "/sneaker-purple.png",
  },
];

export default function ShoeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto play logic
  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const selectSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Framer Motion variants for slide transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      rotate: dir > 0 ? 10 : -10,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 100, damping: 20 },
        opacity: { duration: 0.4 },
        rotate: { type: "spring", stiffness: 80, damping: 15 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      rotate: dir < 0 ? 10 : -10,
      scale: 0.8,
      transition: {
        x: { duration: 0.3 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 },
      },
    }),
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[260px] md:h-[340px] flex flex-col items-center justify-center select-none"
    >
      {/* 1. DYNAMIC ATMOSPHERIC GLOW (Changes color based on current slide) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${currentSlide.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6 }}
          className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full pointer-events-none filter blur-[80px] -z-10"
          style={{ background: currentSlide.glowColor }}
        />
      </AnimatePresence>

      {/* 2. SLIDER AREA */}
      <div className="relative w-full max-w-[240px] md:max-w-[280px] h-[180px] md:h-[220px] flex items-center justify-center overflow-visible">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_: any, info: any) => {
              const swipe = info.offset.x;
              if (swipe < -50) {
                handleNext();
              } else if (swipe > 50) {
                handlePrev();
              }
            }}
          >
            {/* Sneaker floating container */}
            <motion.div
              animate={{
                y: [0, -16, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Ground reflection shadow */}
              <div className="absolute bottom-[5%] w-[65%] h-[12px] bg-black/40 rounded-full filter blur-[10px] pointer-events-none" />

              {/* Sneaker Image */}
              <img
                src={currentSlide.image}
                alt={currentSlide.name}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=480&q=80";
                }}
                className="w-[80%] h-[80%] object-contain"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* 3. NAVIGATION CONTROLS */}
        <button
          onClick={handlePrev}
          className="absolute left-[-20px] md:left-[-40px] w-10 h-10 md:w-12 md:h-12 rounded-full border border-neutral-200/10 bg-white/5 dark:bg-black/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-neutral-200/30 transition-all duration-300 z-20 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <i className="ti ti-chevron-left text-lg md:text-xl"></i>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-[-20px] md:right-[-40px] w-10 h-10 md:w-12 md:h-12 rounded-full border border-neutral-200/10 bg-white/5 dark:bg-black/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-neutral-200/30 transition-all duration-300 z-20 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <i className="ti ti-chevron-right text-lg md:text-xl"></i>
        </button>
      </div>

      {/* 4. SNEAKER SPECIFICATION / BADGE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`name-${currentSlide.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex flex-col items-center gap-1.5"
        >
          <span
            className="text-[10px] uppercase tracking-[3px] font-bold px-3 py-1 rounded-full border border-neutral-200/15"
            style={{
              color: currentSlide.color,
              borderColor: `${currentSlide.color}33`,
              backgroundColor: `${currentSlide.color}10`,
            }}
          >
            {currentSlide.name}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* 5. SLIDE INDICATOR DOTS */}
      <div className="flex gap-2.5 mt-6">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => selectSlide(idx)}
            className="relative w-6 h-6 flex items-center justify-center rounded-full border border-transparent hover:border-white/20 transition-all duration-300 cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: slide.color,
                opacity: idx === currentIndex ? 1 : 0.4,
                transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
                boxShadow: idx === currentIndex ? `0 0 10px ${slide.color}` : "none",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
