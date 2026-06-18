"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  badge: string;
  sizes: number[];
  glowColor: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useAppContext();
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[2] || 41);
  const [quantity, setQuantity] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);

  const isFav = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${product.id}&size=${selectedSize}&qty=${quantity}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none text-left">
      {/* Brand & Badges */}
      <div className="flex justify-between items-center">
        <span className="text-accent text-sm font-black uppercase tracking-wider">{product.brand}</span>
        {product.badge && (
          <span className="bg-accent/15 border border-accent/40 text-accent text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-foreground">
        {product.name}
      </h1>

      {/* Stars */}
      <div className="flex items-center gap-2 border-b border-border-color pb-4">
        <div className="flex text-amber-500 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="ti ti-star-filled text-sm"></i>
          ))}
        </div>
        <span className="text-xs font-bold">{product.rating}</span>
        <span className="text-text-muted text-xs font-medium">({product.reviews} đánh giá thực tế)</span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-black text-accent">{product.price}</span>
        {product.oldPrice && (
          <span className="text-base text-text-muted text-decoration-line-through font-bold">
            {product.oldPrice}
          </span>
        )}
      </div>

      {/* Sizes grid */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black tracking-wider text-text-muted uppercase">Chọn kích thước (Size)</span>
          <button
            onClick={() => setGuideOpen(true)}
            className="text-xs font-black text-accent hover:underline uppercase tracking-wide"
          >
            Hướng dẫn chọn size
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-11 rounded-xl text-sm font-black transition-all duration-200 border flex items-center justify-center active:scale-95 ${
                selectedSize === size
                  ? "bg-accent border-accent text-white shadow-[0_4px_12px_rgba(255,87,34,0.3)]"
                  : "bg-card-background border-border-color text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-black tracking-wider text-text-muted uppercase">Số lượng mua</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl bg-card-background border border-border-color text-foreground font-black text-lg hover:border-accent flex items-center justify-center transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-black">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="w-10 h-10 rounded-xl bg-card-background border border-border-color text-foreground font-black text-lg hover:border-accent flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Purchase Action CTA Buttons Dock */}
      <div className="flex gap-4 items-center mt-6">
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 ${
            addedEffect
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-transparent border-accent text-accent hover:bg-accent/10"
          }`}
        >
          {addedEffect ? (
            <>
              <i className="ti ti-check animate-bounce"></i> Đã thêm vào giỏ
            </>
          ) : (
            <>
              <i className="ti ti-shopping-bag"></i> Thêm vào giỏ
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-[1.5] h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-[0_4px_20px_rgba(255,87,34,0.35)] hover:-translate-y-0.5 transition-all text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:translate-y-0"
        >
          Mua ngay
        </button>

        <button
          onClick={() => toggleWishlist(product.id)}
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
            isFav ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-card-background border-border-color text-text-muted hover:border-red-500 hover:text-red-500"
          }`}
          aria-label="Wishlist"
        >
          <i className={`ti ${isFav ? "ti-heart-filled animate-pulse text-red-500" : "ti-heart"} text-xl`}></i>
        </button>
      </div>

      {/* Size Guide Drawer Modal Overlay */}
      {guideOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => setGuideOpen(false)}>
          <div className="w-full max-w-[450px] bg-background border-l border-border-color h-full p-8 flex flex-col justify-between" onClick={e => e.stopPropagation()}>
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase">Hướng dẫn Chọn Size</h3>
                <button onClick={() => setGuideOpen(false)} className="text-2xl hover:text-accent"><i className="ti ti-x"></i></button>
              </div>
              <p className="text-xs text-text-muted mb-6 leading-relaxed">
                Đo chiều dài bàn chân từ gót chân đến ngón chân dài nhất để có được độ chính xác cao nhất.
              </p>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="py-3 font-black text-text-muted">SIZE VN</th>
                    <th className="py-3 font-black text-text-muted">CHÂN DÀI (CM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { vn: 39, cm: "24.5 cm" },
                    { vn: 40, cm: "25.0 cm" },
                    { vn: 41, cm: "25.5 cm" },
                    { vn: 42, cm: "26.0 cm" },
                    { vn: 43, cm: "26.5 cm" },
                    { vn: 44, cm: "27.0 cm" },
                  ].map(row => (
                    <tr key={row.vn} className="border-b border-border-color/50 font-bold hover:bg-card-background">
                      <td className="py-3">{row.vn}</td>
                      <td className="py-3">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setGuideOpen(false)} className="w-full h-12 bg-accent text-white font-black uppercase text-xs rounded-xl">Đóng bảng hướng dẫn</button>
          </div>
        </div>
      )}
    </div>
  );
}
