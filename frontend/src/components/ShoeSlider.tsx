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
    name: "Nike Air Edition",
    color: "#ff3e00",
    glowColor: "rgba(255, 62, 0, 0.2)",
    image: "/Nike_air-removebg-preview.png",
  },
  {
    id: 2,
    name: "Cosmic Purple Edition",
    color: "#b026ff",
    glowColor: "rgba(176, 38, 255, 0.2)",
    image: "/Nike_air.png",
  },
  {
    id: 3,
    name: "Neon Green Edition",
    color: "#00ff88",
    glowColor: "rgba(0, 255, 136, 0.2)",
    image: "/Nike_3-removebg-preview.png",
  },
  {
    id: 4,
    name: "Sky Blue Edition",
    color: "#00bfff",
    glowColor: "rgba(0, 191, 255, 0.2)",
    image: "/Nike_4-removebg-preview.png",
  },
];

export default function ShoeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto play logic
  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 3000);
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
      className="relative w-full h-[340px] md:h-[450px] flex flex-col items-center justify-center select-none"
    >
      {/* 1. DYNAMIC ATMOSPHERIC GLOW (Changes color based on current slide) */}
      <AnimatePresence>
        <motion.div
          key={`glow-${currentSlide.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6 }}
          className="absolute w-[240px] h-[240px] md:w-[340px] md:h-[340px] rounded-full pointer-events-none filter blur-[100px] -z-10"
          style={{ background: currentSlide.glowColor }}
        />
      </AnimatePresence>

      {/* 2. SLIDER AREA */}
      <div className="relative w-full max-w-[320px] md:max-w-[420px] h-[240px] md:h-[320px] flex items-center justify-center overflow-visible">
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
              inherit={false}
              variants={{}}
              animate={isMounted ? {
                y: [0, -16, 0],
              } : {}}
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
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=480&q=80";
                }}
                className="w-full h-full object-contain transform scale-[1.2] md:scale-[1.35] select-none pointer-events-none"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* 3. CONTROL DOCK (Option 2) */}
      <div className="slider-controls-container">
        <button
          onClick={handlePrev}
          className="slider-dock-btn"
          aria-label="Previous Slide"
        >
          <i className="ti ti-chevron-left text-xl"></i>
        </button>
        <button
          onClick={handleNext}
          className="slider-dock-btn"
          aria-label="Next Slide"
        >
          <i className="ti ti-chevron-right text-xl"></i>
        </button>
      </div>

      {/* 4. PRELOAD IMAGES */}
      <div style={{ display: 'none' }}>
        {slides.map((slide) => (
          <img key={`preload-${slide.id}`} src={slide.image} alt="preload" />
        ))}
      </div>
    </div>
  );
}
