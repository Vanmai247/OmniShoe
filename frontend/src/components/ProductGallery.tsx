"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

interface Product {
  name: string;
  photoId: string;
  glowColor: string;
  colors?: ColorVariant[];
}

export default function ProductGallery({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const activeColorName = searchParams.get("color") || product.colors?.[0]?.name || "";
  
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const mainImageUrl = product.photoId.startsWith("/")
    ? product.photoId
    : `https://images.unsplash.com/${product.photoId}?w=1000&q=90`;

  // Get active images based on color selection
  let angles: string[] = [];
  if (product.colors && product.colors.length > 0) {
    const selectedColor = product.colors.find((c) => c.name === activeColorName) || product.colors[0];
    angles = selectedColor.images.map((img) => img.startsWith("/") ? img : `https://images.unsplash.com/${img}?w=1000&q=90`);
  } else {
    // If no colors defined, fallback to a generated set of angles using existing public files
    angles = [
      mainImageUrl,
      "/Nike_3-removebg-preview.png",
      "/Nike_air-removebg-preview.png",
    ];
  }

  // Reset active image index when selected color changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [activeColorName]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? angles.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === angles.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full select-none">
      {/* Thumbnails List (Left side on desktop, bottom on mobile) */}
      {angles.length > 1 && (
        <div className="flex xl:flex-col gap-3 order-2 xl:order-1 justify-center xl:justify-start overflow-x-auto py-2 xl:py-0 scrollbar-none max-w-full xl:max-w-none">
          {angles.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImgIndex(idx)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 bg-zinc-900/10 backdrop-blur-md transition-all duration-300 flex-shrink-0 flex items-center justify-center p-2 ${
                activeImgIndex === idx
                  ? "border-orange-500 scale-95 shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-orange-500/5"
                  : "border-zinc-200/50 hover:border-orange-500/50 hover:bg-zinc-100"
              }`}
            >
              <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Main interactive image view with zoom glass lens */}
      <div className="flex-1 order-1 xl:order-2 relative aspect-[1.1] rounded-[32px] overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50 border border-zinc-200/60 group p-6 flex items-center justify-center shadow-sm">
        {/* Glow Radial Background */}
        <div
          className="absolute -inset-10 opacity-25 pointer-events-none blur-[50px] transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${product.glowColor || "rgba(249,115,22,0.45)"} 0%, transparent 70%)` }}
        />

        {/* Carousel controls (visible on hover) */}
        {angles.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 border border-zinc-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 z-10"
              aria-label="Previous image"
            >
              <i className="ti ti-chevron-left text-lg"></i>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 border border-zinc-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 z-10"
              aria-label="Next image"
            >
              <i className="ti ti-chevron-right text-lg"></i>
            </button>
          </>
        )}

        {/* Interactive Zoom Image container */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onClick={() => setLightboxOpen(true)}
          className="relative w-full h-full cursor-zoom-in overflow-hidden flex items-center justify-center"
        >
          <motion.img
            key={angles[activeImgIndex]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={angles[activeImgIndex]}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZooming ? "opacity-0 scale-105" : "opacity-100"
            }`}
          />

          {/* Magnifying Glass Zoom Lens */}
          {isZooming && (
            <div
              className="absolute inset-0 bg-no-repeat pointer-events-none"
              style={{
                backgroundImage: `url(${angles[activeImgIndex]})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "220% 220%",
              }}
            />
          )}
        </div>

        {/* Dynamic Image Indicator badge */}
        <div className="absolute bottom-4 right-6 bg-zinc-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[10px] font-black tracking-widest uppercase">
          {activeImgIndex + 1} / {angles.length}
        </div>
      </div>

      {/* Lightbox full overlay with Glassmorphism */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out"
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95 transition-all duration-300"
              onClick={() => setLightboxOpen(false)}
            >
              <i className="ti ti-x text-xl"></i>
            </button>

            {/* Carousel navigation in Lightbox */}
            {angles.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 active:scale-90 transition-all duration-300"
                >
                  <i className="ti ti-chevron-left text-2xl"></i>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 active:scale-90 transition-all duration-300"
                >
                  <i className="ti ti-chevron-right text-2xl"></i>
                </button>
              </>
            )}

            {/* Image display */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="max-w-[85vw] max-h-[80vh] flex items-center justify-center"
            >
              <img
                src={angles[activeImgIndex]}
                alt={`${product.name} high resolution`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

