"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

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
  colors?: ColorVariant[];
  inventory?: Record<string, Record<string, number>>;
  photoId: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, wishlist, toggleWishlist, showToast } = useAppContext();
  
  const [quantity, setQuantity] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFav = wishlist.includes(product.id);

  // Setup color options
  const colorOptions = product.colors || [{ name: "Mặc định", hex: "#E5E7EB", images: [product.photoId || ""] }];
  const activeColorName = searchParams.get("color") || colorOptions[0].name;

  // Setup inventory mapping
  const inventoryMap = product.inventory || {
    [activeColorName]: product.sizes.reduce((acc: any, size: number) => {
      acc[size] = 10; // default to 10 if not defined
      return acc;
    }, {})
  };
  const activeColorInventory = inventoryMap[activeColorName] || {};

  // Setup active size selection (default to first size that has stock > 0, fallback to sizes[2] or sizes[0])
  const [selectedSize, setSelectedSize] = useState<number>(() => {
    const sizesWithStock = product.sizes.filter((s) => (activeColorInventory[s] ?? 10) > 0);
    return sizesWithStock[0] || product.sizes[2] || product.sizes[0] || 41;
  });

  // Auto-switch selected size if it becomes out of stock when changing color
  useEffect(() => {
    const stockForCurrentSize = activeColorInventory[selectedSize] ?? 10;
    if (stockForCurrentSize === 0) {
      const sizesWithStock = product.sizes.filter((s) => (activeColorInventory[s] ?? 10) > 0);
      if (sizesWithStock.length > 0) {
        setSelectedSize(sizesWithStock[0]);
      }
    }
  }, [activeColorName]);

  const currentStock = activeColorInventory[selectedSize] ?? 10;

  // Reset quantity to 1 if it exceeds the new variant stock
  useEffect(() => {
    if (quantity > currentStock && currentStock > 0) {
      setQuantity(currentStock);
    }
  }, [selectedSize, activeColorName, currentStock]);

  const handleColorChange = (colorName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("color", colorName);
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = () => {
    if (currentStock === 0) {
      showToast("Sản phẩm này đã hết hàng! ⚠️");
      return;
    }
    const colorImage = product.colors?.find(c => c.name === activeColorName)?.images[0];
    const productWithVariant = {
      ...product,
      name: `${product.name} - ${activeColorName}`,
      photoId: colorImage || product.photoId,
    };
    addToCart(productWithVariant, selectedSize, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  const handleBuyNow = () => {
    if (currentStock === 0) {
      showToast("Sản phẩm này đã hết hàng! ⚠️");
      return;
    }
    router.push(`/checkout?productId=${product.id}&size=${selectedSize}&qty=${quantity}&color=${encodeURIComponent(activeColorName)}`);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Đã sao chép liên kết chia sẻ! 📋");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Stock Status styling
  let stockLabel = "Còn hàng";
  let stockBadgeClass = "text-emerald-700 bg-emerald-50/80 border-emerald-200/80";
  if (currentStock === 0) {
    stockLabel = "Hết hàng";
    stockBadgeClass = "text-rose-700 bg-rose-50/80 border-rose-200/80";
  } else if (currentStock <= 5) {
    stockLabel = `Chỉ còn ${currentStock} đôi`;
    stockBadgeClass = "text-amber-700 bg-amber-50/80 border-amber-200/80";
  }

  return (
    <div className="flex flex-col gap-6 w-full select-none text-left font-sans">
      {/* Brand & Badges */}
      <div className="flex justify-between items-center">
        <span className="text-orange-500 text-sm font-black uppercase tracking-wider">{product.brand}</span>
        <div className="flex gap-2">
          {stockLabel && (
            <span className={`border text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${stockBadgeClass}`}>
              {stockLabel}
            </span>
          )}
          {product.badge && (
            <span className="bg-orange-50/80 border border-orange-200/80 text-orange-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-zinc-900">
        {product.name}
      </h1>

      {/* Stars */}
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
        <div className="flex text-amber-500 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="ti ti-star-filled text-sm"></i>
          ))}
        </div>
        <span className="text-xs font-bold text-zinc-800">{product.rating || 5.0}</span>
        <span className="text-zinc-400 text-xs font-medium">({product.reviews || 0} đánh giá thực tế)</span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-black text-orange-500">{product.price}</span>
        {product.oldPrice && (
          <span className="text-base text-zinc-400 text-decoration-line-through font-bold">
            {product.oldPrice}
          </span>
        )}
      </div>

      {/* Color Selection Swatches (New Feature) */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">
            Màu sắc: <span className="text-zinc-700 font-extrabold normal-case">{activeColorName}</span>
          </span>
          <div className="flex gap-3">
            {product.colors.map((color) => {
              const isActive = color.name === activeColorName;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorChange(color.name)}
                  className={`w-9 h-9 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive 
                      ? "border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]" 
                      : "border-zinc-200/80 hover:border-orange-500/50"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                >
                  {isActive && (
                    <i className={`ti ti-check text-xs font-bold ${
                      color.hex === "#FFFFFF" || color.hex === "#F5F5F5" || color.hex === "#F4F4F5" ? "text-zinc-800" : "text-white"
                    }`}></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">Chọn kích thước (Size)</span>
          <button
            onClick={() => setGuideOpen(true)}
            className="text-xs font-black text-orange-500 hover:underline uppercase tracking-wide cursor-pointer"
          >
            Hướng dẫn chọn size
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((size) => {
            const isSizeAvailable = (activeColorInventory[size] ?? 10) > 0;
            const isSelected = selectedSize === size;
            
            return (
              <button
                key={size}
                disabled={!isSizeAvailable}
                onClick={() => setSelectedSize(size)}
                className={`h-11 rounded-xl text-sm font-black transition-all duration-200 border flex items-center justify-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-200 disabled:hover:text-zinc-400 ${
                  isSelected
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                    : "bg-white border-zinc-200 text-zinc-500 hover:border-orange-500 hover:text-orange-500 cursor-pointer"
                } ${!isSizeAvailable ? "line-through text-zinc-300" : ""}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">Số lượng mua</span>
        <div className="flex items-center gap-3">
          <button
            disabled={currentStock === 0}
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-black text-lg hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-black text-zinc-800">{currentStock === 0 ? 0 : quantity}</span>
          <button
            disabled={currentStock === 0}
            onClick={() => {
              if (quantity >= currentStock) {
                showToast(`Chỉ còn tối đa ${currentStock} sản phẩm trong kho! ⚠️`);
              } else {
                setQuantity(q => q + 1);
              }
            }}
            className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-black text-lg hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Purchase Action CTA Buttons Dock */}
      <div className="flex gap-4 items-center mt-6">
        <button
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className={`flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            addedEffect
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-white border-orange-500 text-orange-500 hover:bg-orange-500/5 cursor-pointer"
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
          disabled={currentStock === 0}
          className="flex-[1.5] h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
        >
          Mua ngay
        </button>

        <button
          onClick={() => toggleWishlist(product.id)}
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isFav ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-zinc-200 text-zinc-400 hover:border-red-500 hover:text-red-500"
          }`}
          aria-label="Wishlist"
        >
          <i className={`ti ${isFav ? "ti-heart-filled animate-pulse text-red-500" : "ti-heart"} text-xl`}></i>
        </button>
      </div>

      {/* Sales Policies Banner (New Feature) */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 border-y border-zinc-150 py-8 my-6 md:my-8 text-zinc-650">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-truck text-lg md:text-xl"></i>
          </div>
          <div>
            <p className="text-xs md:text-sm font-black text-zinc-800">Miễn Phí Vận Chuyển</p>
            <p className="text-[11px] md:text-xs text-zinc-400 font-semibold mt-1 leading-normal">Cho mọi đơn hàng toàn quốc</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-rotate text-lg md:text-xl"></i>
          </div>
          <div>
            <p className="text-xs md:text-sm font-black text-zinc-800">Đổi Trả Dễ Dàng</p>
            <p className="text-[11px] md:text-xs text-zinc-400 font-semibold mt-1 leading-normal">30 ngày đổi size tại nhà</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-shield-check text-lg md:text-xl"></i>
          </div>
          <div>
            <p className="text-xs md:text-sm font-black text-zinc-800">Bảo Hành 6 Tháng</p>
            <p className="text-[11px] md:text-xs text-zinc-400 font-semibold mt-1 leading-normal">Bảo hành keo đế chính hãng</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-discount text-lg md:text-xl"></i>
          </div>
          <div>
            <p className="text-xs md:text-sm font-black text-zinc-800">Thanh Toán COD</p>
            <p className="text-[11px] md:text-xs text-zinc-400 font-semibold mt-1 leading-normal">Nhận hàng rồi mới thanh toán</p>
          </div>
        </div>
      </div>

      {/* Social Share Section (New Feature) */}
      <div className="flex items-center gap-4 border-b border-zinc-150 pb-7 mb-4 mt-2">
        <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">Chia sẻ:</span>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 flex items-center justify-center hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all cursor-pointer text-base" aria-label="Facebook">
            <i className="ti ti-brand-facebook"></i>
          </button>
          <button className="w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 flex items-center justify-center hover:text-[#0084FF] hover:border-[#0084FF] hover:bg-[#0084FF]/5 transition-all cursor-pointer text-base" aria-label="Messenger">
            <i className="ti ti-brand-messenger"></i>
          </button>
          <button 
            onClick={handleCopyLink}
            className={`h-9 px-4 rounded-full border flex items-center gap-2 transition-all cursor-pointer text-xs font-extrabold uppercase tracking-wider ${
              copied 
                ? "border-emerald-500 text-emerald-600 bg-emerald-50" 
                : "border-zinc-200 text-zinc-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-500/5"
            }`}
          >
            <i className={`ti ${copied ? "ti-check" : "ti-copy"} text-sm`}></i>
            {copied ? "Đã chép!" : "Sao chép link"}
          </button>
        </div>
      </div>

      {/* Size Guide Drawer Modal Overlay */}
      {guideOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => setGuideOpen(false)}>
          <div className="w-full max-w-[450px] bg-white border-l border-zinc-200 h-full p-8 flex flex-col justify-between" onClick={e => e.stopPropagation()}>
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase text-zinc-850">Hướng dẫn Chọn Size</h3>
                <button onClick={() => setGuideOpen(false)} className="text-2xl hover:text-orange-500 text-zinc-400 transition-colors cursor-pointer"><i className="ti ti-x"></i></button>
              </div>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed font-semibold">
                Đo chiều dài bàn chân từ gót chân đến ngón chân dài nhất để có được độ chính xác cao nhất.
              </p>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="py-3 font-black text-zinc-400">SIZE VN</th>
                    <th className="py-3 font-black text-zinc-400">CHÂN DÀI (CM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { vn: 38, cm: "23.5 cm" },
                    { vn: 39, cm: "24.5 cm" },
                    { vn: 40, cm: "25.0 cm" },
                    { vn: 41, cm: "25.5 cm" },
                    { vn: 42, cm: "26.0 cm" },
                    { vn: 43, cm: "26.5 cm" },
                    { vn: 44, cm: "27.0 cm" },
                  ].map(row => (
                    <tr key={row.vn} className="border-b border-zinc-100 font-bold hover:bg-zinc-50 text-zinc-700">
                      <td className="py-3">{row.vn}</td>
                      <td className="py-3">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setGuideOpen(false)} className="w-full h-12 bg-orange-500 text-white font-black uppercase text-xs rounded-xl shadow-lg shadow-[rgba(249,115,22,0.25)] cursor-pointer">Đóng bảng hướng dẫn</button>
          </div>
        </div>
      )}
    </div>
  );
}
