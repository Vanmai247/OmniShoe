"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ShoeHero2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tracking cursor relative position: range from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the motion values using spring physics
  const springConfig = { stiffness: 120, damping: 25, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates into degrees for 3D tilt
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  
  // Transform coordinates into subtle shadow offsets for realistic lighting direction
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [-10, 30]);

  // Translate container on mouse move for parallax feel
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position from center (-0.5 to 0.5)
    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset back to center smoothly
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[280px] md:h-[360px] flex items-center justify-center select-none cursor-pointer"
      style={{ perspective: 1000 }}
    >


      {/* 2. THE TILTCONTAINER (Tilted in 3D Space) */}
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="relative max-w-[220px] md:max-w-[280px] flex items-center justify-center"
      >
        {/* Floating Animation Layer for the Shoe */}
        <motion.div
          animate={{
            y: isHovered ? [0, -10, 0] : [0, -20, 0],
            rotate: isHovered ? [0, 1, 0] : [0, -2, 0],
          }}
          transition={{
            y: {
              duration: isHovered ? 2.5 : 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: isHovered ? 3 : 5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Ambient shadow beneath the floating shoe */}
          <motion.div
            style={{
              x: shadowX,
              y: shadowY,
              scale: isHovered ? 1.05 : 0.95,
              opacity: isHovered ? 0.35 : 0.25,
            }}
            className="absolute bottom-[10%] left-[10%] right-[10%] h-12 bg-black/60 rounded-full blur-2xl filter pointer-events-none -z-20 transition-all duration-300"
          ></motion.div>

          {/* Premium Shoe Image */}
          <motion.img
            src="/hero-sneaker.png"
            alt="OmniShoe Premium Sneaker"
            style={{ 
              transform: "translateZ(80px)",
              maxWidth: "260px",
              maxHeight: "260px",
              mixBlendMode: "screen",
              filter: isHovered 
                ? "drop-shadow(0 20px 40px rgba(255, 87, 34, 0.3))" 
                : "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4))"
            }}
            className="w-full h-auto object-contain transition-all duration-300"
          />

        </motion.div>
      </motion.div>

    </div>
  );
}
