"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  name: string;
  photoId: string;
  glowColor: string;
}

export default function ProductGallery({ product }: { product: Product }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const imageUrl = product.photoId.startsWith("/")
    ? product.photoId
    : `https://images.unsplash.com/${product.photoId}?w=1000&q=90`;

  // Multi-angle mock shots using unsplash stock backgrounds or repeated values for demonstration
  const angles = [
    imageUrl,
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=90",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=90",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=90",
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full select-none">
      {/* Thumbnails list */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 justify-center">
        {angles.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImgIndex(idx)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 bg-card-background transition-all duration-300 ${
              activeImgIndex === idx ? "border-accent scale-95" : "border-border-color hover:border-accent/50"
            }`}
          >
            <img src={img} alt="preview" className="w-full h-full object-contain p-2" />
          </button>
        ))}
      </div>

      {/* Main interactive image view with zoom glass lens */}
      <div className="flex-1 order-1 md:order-2 relative aspect-[1.1] rounded-[32px] overflow-hidden bg-card-background border border-border-color group p-6 flex items-center justify-center">
        <div
          className="absolute -inset-10 opacity-20 pointer-events-none blur-[40px]"
          style={{ background: `radial-gradient(circle, ${product.glowColor} 0%, transparent 70%)` }}
        />

        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onClick={() => setLightboxOpen(true)}
          className="relative w-full h-full cursor-zoom-in overflow-hidden flex items-center justify-center"
        >
          <img
            src={angles[activeImgIndex]}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZooming ? "opacity-0 scale-105" : "opacity-100"
            }`}
          />

          {/* Magnifying Glass Zoom Area */}
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
      </div>

      {/* Lightbox full overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              className="absolute top-6 right-6 text-white text-3xl hover:text-accent transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <i className="ti ti-x"></i>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            >
              <img
                src={angles[activeImgIndex]}
                alt="detail highres"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
