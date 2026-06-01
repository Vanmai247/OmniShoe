# Product Details Dynamic Page (Hybrid Model) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, high-performance dynamic product details page at `/products/[id]` featuring server-side dynamic SEO metadata generation, JSON-LD Schema, custom React Context state management, interactive magnifier-lens image gallery, springy selectors, animated tabs, and related products carousel.

**Architecture:** Hybrid approach combining Server-Side dynamic layouts/SEO optimization with modular Client-Side interactive subcomponents (`ProductGallery`, `ProductInfo`, `ProductTabs`, `RelatedProducts`) communicating via React Context (`AppContext`) to sync cart and wishlist state seamlessly across all pages.

**Tech Stack:** Next.js (App Router), React Context API, Framer Motion, TypeScript, Tailwind CSS.

---

### Task 1: Global State with React Context (`AppContext.tsx`)

**Files:**
- Create: `frontend/src/context/AppContext.tsx`

- [ ] **Step 1: Create global context file**
  Create the context defining all interface states and provider wrappers, resolving hydration differences using a mounted flag in local storage.
  ```typescript
  "use client";

  import React, { createContext, useContext, useState, useEffect } from "react";

  export interface CartItem {
    id: number;
    name: string;
    brand: string;
    price: string;
    photoId: string;
    selectedSize: number;
    quantity: number;
    glowColor: string;
  }

  interface AppContextType {
    cart: CartItem[];
    wishlist: number[];
    addToCart: (product: any, size: number, quantity: number) => void;
    removeFromCart: (productId: number, size: number) => void;
    toggleWishlist: (productId: number) => void;
    toast: { show: boolean; message: string };
    showToast: (msg: string) => void;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  export function AppProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      const savedCart = localStorage.getItem("omni_cart");
      const savedWishlist = localStorage.getItem("omni_wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }, []);

    useEffect(() => {
      if (mounted) {
        localStorage.setItem("omni_cart", JSON.stringify(cart));
      }
    }, [cart, mounted]);

    useEffect(() => {
      if (mounted) {
        localStorage.setItem("omni_wishlist", JSON.stringify(wishlist));
      }
    }, [wishlist, mounted]);

    const showToast = (message: string) => {
      setToast({ show: true, message });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const addToCart = (product: any, size: number, quantity: number) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.id === product.id && item.selectedSize === size
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            photoId: product.photoId,
            selectedSize: size,
            quantity,
            glowColor: product.glowColor,
          },
        ];
      });
      showToast(`Đã thêm ${product.name} (Size ${size}) vào giỏ hàng! 🛒`);
    };

    const removeFromCart = (productId: number, size: number) => {
      setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
      showToast("Đã xóa sản phẩm khỏi giỏ hàng");
    };

    const toggleWishlist = (productId: number) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast("Đã xóa khỏi danh sách yêu thích 💔");
          return prev.filter((id) => id !== productId);
        } else {
          showToast("Đã thêm vào danh sách yêu thích ❤️");
          return [...prev, productId];
        }
      });
    };

    return (
      <AppContext.Provider
        value={{ cart, wishlist, addToCart, removeFromCart, toggleWishlist, toast, showToast }}
      >
        {children}
        {/* Unified Toast View */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 bg-black/85 backdrop-blur-md border border-accent/30 text-foreground px-6 py-4 rounded-[20px] shadow-[0_12px_30px_rgba(255,87,34,0.15)] flex items-center gap-3 animate-slide-up text-xs font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            {toast.message}
          </div>
        )}
      </AppContext.Provider>
    );
  }

  export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
  }
  ```

- [ ] **Step 2: Commit global context**
  ```bash
  git add frontend/src/context/AppContext.tsx
  git commit -m "feat: add global AppContext for cart and wishlist state sync"
  ```

---

### Task 2: Root Layout Integration

**Files:**
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Wrap layout with AppProvider**
  Import and wrap the entire layout body children with `<AppProvider>`.
  ```typescript
  import type { Metadata } from "next";
  import "./globals.css";
  import { AppProvider } from "@/context/AppContext";

  export const metadata: Metadata = {
    title: "OmniShoe — Sneaker Culture Việt Nam",
    description: "Đón đầu xu hướng sneaker culture tại Việt Nam. Khám phá những phối màu giới hạn độc nhất dành riêng cho thế hệ Gen Z.",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="vi">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
        </head>
        <body>
          <AppProvider>
            {children}
          </AppProvider>
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 2: Commit root layout modifications**
  ```bash
  git add frontend/src/app/layout.tsx
  git commit -m "feat: integrate AppProvider into root layout"
  ```

---

### Task 3: Homepage State Refactoring

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Remove local states and connect to AppContext**
  Replace local `useState` arrays for `cart` and `wishlist` with `useAppContext()`. Remove `toggleWishlist`, `addToCart`, and local `toast` variables.
  Ensure all UI elements on the homepage reference global state values correctly.

- [ ] **Step 2: Commit homepage changes**
  ```bash
  git add frontend/src/app/page.tsx
  git commit -m "refactor: convert homepage to use global AppContext states"
  ```

---

### Task 4: Dynamic Dynamic Router Server Shell (`app/products/[id]/page.tsx`)

**Files:**
- Create: `frontend/src/app/products/[id]/page.tsx`

- [ ] **Step 1: Create Product Server component with SEO dynamic metadata**
  Build server logic to read params, generate perfect dynamic metadata titles/descriptions/OpenGraph images, embed JSON-LD search schemas, and provide customized 404 views.
  ```typescript
  import { Metadata } from "next";
  import Link from "next/link";
  import { notFound } from "next/navigation";
  import ProductGallery from "@/components/ProductGallery";
  import ProductInfo from "@/components/ProductInfo";
  import ProductTabs from "@/components/ProductTabs";
  import RelatedProducts from "@/components/RelatedProducts";

  // Shared mock database matching frontend/src/app/page.tsx
  const mockProducts = [
    {
      id: 1,
      name: "Court Vision Low Next Nature",
      brand: "Nike",
      price: "1,909,000₫",
      rating: 4.8,
      reviews: 120,
      badge: "Hot",
      photoId: "/Nike_4-removebg-preview.png",
      category: "Lifestyle",
      glowColor: "rgba(255, 255, 255, 0.45)",
      sizes: [39, 40, 41, 42, 43],
      description: "Hòa quyện giữa nét cổ điển thập niên 80 và nhịp sống hiện đại. Phối màu thanh lịch mang tính biểu tượng.",
      materials: "Da tổng hợp tái chế, Đế cao su chống trượt",
    },
    {
      id: 2,
      name: "Ultraboost 23",
      brand: "Adidas",
      price: "4,150,000₫",
      oldPrice: "5,000,000₫",
      rating: 4.7,
      reviews: 95,
      badge: "New Drop",
      photoId: "photo-1587563871167-1ee9c731aefb",
      category: "Running",
      glowColor: "rgba(0, 150, 255, 0.45)",
      sizes: [40, 41, 42, 43, 44],
      description: "Công nghệ đế Boost êm ái đàn hồi đỉnh cao của Adidas, thân giày dệt sợi Primeknit thoáng mát.",
      materials: "Primeknit dệt sợi, Đệm Boost hạt, Đế ngoài Continental",
    },
    {
      id: 3,
      name: "Air Jordan 11 Low 'Mother's Day'",
      brand: "Jordan",
      price: "5,589,000₫",
      rating: 4.9,
      reviews: 210,
      badge: "Hot",
      photoId: "/Air Jordan 11 Low 'Mother's Day'.png",
      category: "Basketball",
      glowColor: "rgba(244, 114, 182, 0.45)",
      sizes: [39, 40, 41, 42, 43],
      description: "Phối màu đặc biệt kỷ niệm ngày của mẹ với lớp phủ nhung vàng óng quyến rũ, cực kỳ sang chảnh.",
      materials: "Da bóng patent leather cao cấp, Lớp đệm Air full-length",
    },
    {
      id: 4,
      name: "RS-X Bold",
      brand: "Puma",
      price: "2,290,000₫",
      oldPrice: "2,800,000₫",
      rating: 4.5,
      reviews: 64,
      badge: "-18%",
      photoId: "photo-1608231387042-66d1773070a5",
      category: "Lifestyle",
      glowColor: "rgba(52, 211, 153, 0.45)",
      sizes: [38, 39, 40, 41, 42],
      description: "Thiết kế hầm hố retro-chunky cá tính với các mảng màu tương phản rực rỡ, ôm chân cực chuẩn.",
      materials: "Lưới dệt Mesh thoáng khí, Lớp phủ Nubuck cá tính",
    },
    {
      id: 5,
      name: "ABZORB 2010 Grey Days",
      brand: "New Balance",
      price: "3,625,000₫",
      rating: 4.8,
      reviews: 43,
      badge: "Limited",
      photoId: "/ABZORB 2010 Grey Day's.png",
      category: "Lifestyle",
      glowColor: "rgba(163, 163, 163, 0.45)",
      sizes: [40, 41, 42, 43, 44],
      description: "Tôn vinh sắc xám trường tồn huyền thoại của New Balance kết hợp công nghệ Abzorb giảm xóc ấn tượng.",
      materials: "Da lộn Premium Suede, Đệm giảm chấn ABZORB",
    },
    {
      id: 6,
      name: "Air Max 90 'Hypervenom'",
      brand: "Nike",
      price: "4,109,000₫",
      rating: 4.8,
      reviews: 150,
      badge: "Limited",
      photoId: "/Nike Air Max 90 'Hypervenom'.png",
      category: "Lifestyle",
      glowColor: "rgba(132, 204, 22, 0.45)",
      sizes: [39, 40, 41, 42, 43, 44],
      description: "Mẫu giày kỷ niệm dòng Hypervenom bóng đá nổi tiếng với tông xanh chuối sặc sỡ và lớp đệm khí Air max.",
      materials: "Da lộn kết hợp lưới Mesh, Cửa sổ đệm khí Max Air",
    },
  ];

  interface PageProps {
    params: { id: string };
  }

  export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const product = mockProducts.find((p) => p.id === parseInt(params.id));
    if (!product) return { title: "Không tìm thấy sản phẩm | OmniShoe" };
    return {
      title: `${product.name} — ${product.brand} | OmniShoe`,
      description: `${product.description} Mua giày chính hãng 100% bảo hành uy tín tại Việt Nam.`,
    };
  }

  export default function ProductDetailPage({ params }: PageProps) {
    const product = mockProducts.find((p) => p.id === parseInt(params.id));
    if (!product) notFound();

    // Structural JSON-LD
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "brand": {
        "@type": "Brand",
        "name": product.brand,
      },
      "image": product.photoId.startsWith("/") ? product.photoId : `https://images.unsplash.com/${product.photoId}`,
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "price": product.price.replace(/[^\d]/g, ""),
        "priceCurrency": "VND",
        "availability": "https://schema.org/InStock",
      },
    };

    return (
      <div className="min-h-screen bg-background text-foreground relative z-0 flex flex-col">
        {/* Background Overlay */}
        <div
          className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('/Gemini_Generated_Image_kb01qnkb01qnkb01.png')` }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Global Header clone for Detail Page navigation */}
        <header className="header w-full">
          <div className="header-container">
            <Link href="/" className="logo">
              OMNI<span>SHOE</span>
            </Link>
            <nav className="nav-links">
              {["Nam", "Nữ", "Thương hiệu", "Sale", "Xu hướng"].map((link) => (
                <Link key={link} href="/">
                  {link}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <Link href="/" className="action-btn" aria-label="Home">
                <i className="ti ti-arrow-left"></i> Quay lại
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1440px] mx-auto px-8 md:px-12 py-10 w-full">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-xs text-text-muted font-bold mb-8 items-center">
            <Link href="/" className="hover:text-accent transition-colors">TRANG CHỦ</Link>
            <i className="ti ti-chevron-right text-[10px]"></i>
            <span className="text-accent">{product.brand.toUpperCase()}</span>
            <i className="ti ti-chevron-right text-[10px]"></i>
            <span className="text-foreground">{product.name.toUpperCase()}</span>
          </div>

          {/* Core Layout Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>

          {/* Details & Specs Tabs */}
          <div className="mt-16 border-t border-border-color pt-12">
            <ProductTabs product={product} />
          </div>

          {/* Related Products Grid */}
          <div className="mt-16 border-t border-border-color pt-12">
            <RelatedProducts currentProduct={product} allProducts={mockProducts} />
          </div>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit server route**
  ```bash
  git add frontend/src/app/products/[id]/page.tsx
  git commit -m "feat: implement dynamic server-rendered page wrapper with SEO dynamic schema"
  ```

---

### Task 5: 2D Gallery Magnifier Component (`ProductGallery.tsx`)

**Files:**
- Create: `frontend/src/components/ProductGallery.tsx`

- [ ] **Step 1: Implement Product Gallery with magnifying hover zoom & lightbox**
  Create the core thumbnail-switched, interactive lens glassmorphic component using React mouse coordinate tracking and Framer Motion.
  ```typescript
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
  ```

- [ ] **Step 2: Commit gallery component**
  ```bash
  git add frontend/src/components/ProductGallery.tsx
  git commit -m "feat: add interactive ProductGallery with responsive zoom lens and lightbox"
  ```

---

### Task 6: Purchase Info Component (`ProductInfo.tsx`)

**Files:**
- Create: `frontend/src/components/ProductInfo.tsx`

- [ ] **Step 1: Implement interactive purchasing blocks with Cart Context**
  Connect with context, manage circular sizes click triggers, active item state additions, quantity steppers, and guidance modals.
  ```typescript
  "use client";

  import React, { useState } from "react";
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
            onClick={handleAddToCart}
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
            <i className={`ti ${isFav ? "ti-heart-filled animate-ping" : "ti-heart"} text-xl`}></i>
          </button>
        </div>

        {/* Size Guide Drawer Modal Overlay */}
        {guideOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => setGuideOpen(false)}>
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
  ```

- [ ] **Step 2: Commit info buying component**
  ```bash
  git add frontend/src/components/ProductInfo.tsx
  git commit -m "feat: implement interactive ProductInfo buying module connected to AppContext"
  ```

---

### Task 7: Premium Sliding Tabs (`ProductTabs.tsx`)

**Files:**
- Create: `frontend/src/components/ProductTabs.tsx`

- [ ] **Step 1: Build sliding tabs detailing description, specs, reviews**
  Use Framer Motion to slide the underline between tabs and animate layout containers.
  ```typescript
  "use client";

  import React, { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";

  interface Product {
    description: string;
    materials: string;
  }

  export default function ProductTabs({ product }: { product: Product }) {
    const [activeTab, setActiveTab] = useState("desc");

    const tabs = [
      { id: "desc", label: "Mô tả" },
      { id: "specs", label: "Thông số chi tiết" },
      { id: "reviews", label: "Đánh giá thực tế" },
    ];

    return (
      <div className="w-full text-left">
        {/* Tabs Headers */}
        <div className="flex gap-8 border-b border-border-color pb-3 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-black uppercase tracking-wider relative transition-colors ${
                activeTab === tab.id ? "text-accent" : "text-text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-14px] inset-x-0 h-1 bg-accent rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab panels container */}
        <div className="py-6">
          <AnimatePresence mode="wait">
            {activeTab === "desc" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-xs md:text-sm text-text-muted leading-relaxed font-semibold"
              >
                {product.description}
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-xs md:text-sm text-text-muted leading-relaxed"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b border-border-color/50 py-2">
                    <span className="font-black uppercase text-foreground">Chất liệu:</span> {product.materials}
                  </div>
                  <div className="border-b border-border-color/50 py-2">
                    <span className="font-black uppercase text-foreground">Phân nhóm:</span> Sneaker Sportwear
                  </div>
                  <div className="border-b border-border-color/50 py-2">
                    <span className="font-black uppercase text-foreground">Bảo hành:</span> Chính hãng 100% (Đền gấp 10 lần)
                  </div>
                  <div className="border-b border-border-color/50 py-2">
                    <span className="font-black uppercase text-foreground">Hỗ trợ:</span> Đổi size 30 ngày tận nhà
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {[
                  {
                    name: "Quốc Hùng",
                    rating: 5,
                    comment: "Mẫu giày đẹp hơn cả trên ảnh, da mềm ôm chân vừa vặn, tag mác hộp chính hãng thơm phức.",
                  },
                  {
                    name: "Phương Linh",
                    rating: 5,
                    comment: "Đổi trả nhanh lắm, đôi trước chật size shop cho shipper đổi ngay tại nhà trong 1 ngày.",
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="border-b border-border-color/30 pb-4">
                    <div className="flex gap-2 text-amber-500 mb-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <i key={i} className="ti ti-star-filled text-xs"></i>
                      ))}
                    </div>
                    <span className="text-xs font-black text-foreground">{rev.name}</span>
                    <p className="text-xs text-text-muted font-bold mt-1">"{rev.comment}"</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit tab component**
  ```bash
  git add frontend/src/components/ProductTabs.tsx
  git commit -m "feat: add dynamic ProductTabs detailing specification information"
  ```

---

### Task 8: Related Products Section (`RelatedProducts.tsx`)

**Files:**
- Create: `frontend/src/components/RelatedProducts.tsx`

- [ ] **Step 1: Create horizontal-scrolling related items cards**
  Filter from standard items list, rendering clean links to dynamic products paths.
  ```typescript
  "use client";

  import React from "react";
  import Link from "next/link";

  interface Product {
    id: number;
    name: string;
    brand: string;
    price: string;
    photoId: string;
    glowColor: string;
  }

  export default function RelatedProducts({
    currentProduct,
    allProducts,
  }: {
    currentProduct: Product;
    allProducts: Product[];
  }) {
    const related = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, 3); // Display top 3 alternatives

    return (
      <div className="w-full text-left">
        <h3 className="text-xl font-black uppercase mb-8">Có Thể Bạn Cũng Thích</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="bg-card-background border border-border-color p-6 rounded-[24px] hover:-translate-y-1 transition-all duration-300 block group"
            >
              <div className="relative aspect-[1.1] rounded-2xl overflow-hidden bg-bg-secondary flex items-center justify-center p-4">
                <img
                  src={p.photoId.startsWith("/") ? p.photoId : `https://images.unsplash.com/${p.photoId}?w=480&q=80`}
                  alt={p.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-accent font-black uppercase tracking-wider">{p.brand}</span>
                <h4 className="font-extrabold text-sm text-foreground truncate mt-1">{p.name}</h4>
                <span className="text-sm font-black text-accent block mt-2">{p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit related products**
  ```bash
  git add frontend/src/components/RelatedProducts.tsx
  git commit -m "feat: add RelatedProducts dynamic recommendation component"
  ```
