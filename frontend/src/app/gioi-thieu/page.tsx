"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";

const brands = [
  "Nike",
  "Adidas",
  "Jordan",
  "Puma",
  "New Balance",
  "Converse",
  "Vans",
  "MLB",
];

const brandLogos: Record<string, string> = {
  "Nike": "/Nike-logo.jpg",
  "Adidas": "/adidas-logo.png",
  "Jordan": "/Jordan-logo.jpg",
  "Puma": "/puma-logo-3.jpg",
  "New Balance": "/newbalance-logo.png",
  "Converse": "/converse-logo.jpg",
  "Vans": "/vanz-logo.jpg",
  "MLB": "/mlb-logo.png",
};

// Animation Presets
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function AboutUsPage() {
  const {
    cart,
    wishlist,
    user,
    removeFromCart,
    showToast: globalShowToast,
    updateCartQuantity,
    updateCartItemSize,
    logout,
  } = useAppContext();

  const [pageConfig, setPageConfig] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const cartDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close cart dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch page configuration from dynamic API
  useEffect(() => {
    fetch("/api/pages/gioi-thieu")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page config");
        return res.json();
      })
      .then((data) => {
        setPageConfig(data);
      })
      .catch((err) => {
        console.error("Error loading about page config:", err);
      });
  }, []);

  // Sync tab/browser SEO title
  useEffect(() => {
    if (pageConfig?.metadata?.seoTitle) {
      document.title = pageConfig.metadata.seoTitle;
    } else {
      document.title = "Về chúng tôi — Câu chuyện thương hiệu OmniShoe";
    }
  }, [pageConfig]);

  const calculateTotal = (cartItems: any[]) => {
    const total = cartItems.reduce((sum, item) => {
      const priceVal = parseInt(item.price.replace(/[^\d]/g, ""));
      return sum + priceVal * item.quantity;
    }, 0);
    return total.toLocaleString("vi-VN") + "₫";
  };

  const showToastNotification = (msg: string) => {
    globalShowToast(msg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative z-0">
      {/* Dynamic background overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-35 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/studio_light_bg.png')`,
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* 1. STICKY HEADER WITH GLOBAL STATE */}
      <header className="header w-full">
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="header-logo-link">
            <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" className="header-logo-image" />
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <Link href="/#product-section">Sản phẩm</Link>
            <Link href="/">Nam</Link>
            <Link href="/">Nữ</Link>
            
            <div className="nav-item-has-submenu">
              <a href="#" className="nav-link-trigger">Thương hiệu</a>
              <div className="mega-menu">
                <div className="mega-menu-grid">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/?brand=${brand}`}
                      className="mega-menu-item"
                    >
                      <img src={brandLogos[brand]} alt={brand} />
                      <span>{brand}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/">Sale</Link>
            <Link href="/">Xu hướng</Link>
            <Link href="/gioi-thieu" className="active">
              Về chúng tôi
            </Link>
          </nav>

          {/* Header Action Tools */}
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Tìm kiếm Air Jordan, Nike..." />
              <i className="ti ti-search"></i>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => showToastNotification(`Yêu thích đang có ${wishlist.length} sản phẩm`)}
              className="action-btn"
              aria-label="Yêu thích"
            >
              <i className="ti ti-heart"></i>
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </button>

            {/* Cart Dropdown Container */}
            <div className="relative" ref={cartDropdownRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`action-btn ${isCartOpen ? "bg-white/10 text-accent" : ""}`}
                aria-label="Giỏ hàng"
              >
                <i className="ti ti-shopping-bag"></i>
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="badge">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-[360px] md:w-[400px] bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[100] flex flex-col text-left"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-black tracking-wider uppercase text-zinc-500">Giỏ hàng của bạn</span>
                      <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent font-black px-2 py-0.5 rounded-full">
                        {cart.length} dòng
                      </span>
                    </div>

                    {/* Cart List */}
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <i className="ti ti-shopping-bag text-2xl"></i>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-700">Giỏ hàng trống</p>
                            <p className="text-xs text-zinc-400 mt-1">Hãy thêm sản phẩm yêu thích của bạn!</p>
                          </div>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={`${item.id}-${item.selectedSize}`} className="p-4 flex gap-3 hover:bg-zinc-50 transition-colors group">
                            {/* Product Image */}
                            <div className="w-16 h-16 rounded-xl bg-zinc-100/80 border border-zinc-200/50 overflow-hidden shrink-0 flex items-center justify-center relative">
                              <Image
                                src={item.photoId.startsWith("/") || item.photoId.startsWith("http") ? item.photoId : `https://images.unsplash.com/${item.photoId}?w=150&q=80`}
                                alt={item.name}
                                fill
                                sizes="64px"
                                className={`w-full h-full ${item.photoId.startsWith("/") ? "object-contain p-1.5" : "object-cover"}`}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <span className="text-[10px] font-bold text-accent uppercase tracking-wider block leading-none">{item.brand}</span>
                                <h4 className="text-xs font-bold text-zinc-800 truncate mt-1 group-hover:text-accent transition-colors leading-tight">
                                  {item.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-semibold mt-1">
                                <div className="relative flex items-center bg-zinc-100 rounded border border-zinc-200/50 px-1 py-0.5 text-zinc-600 gap-1">
                                  <span className="select-none">Size:</span>
                                  <select
                                    value={item.selectedSize}
                                    onChange={(e) => {
                                      updateCartItemSize(item.id, item.selectedSize, parseInt(e.target.value));
                                    }}
                                    className="bg-transparent text-zinc-800 font-black focus:outline-none cursor-pointer text-[11px] pr-1"
                                  >
                                    {(item.sizes || [38, 39, 40, 41, 42, 43, 44]).map((sz) => (
                                      <option key={sz} value={sz}>{sz}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-center bg-zinc-100 rounded border border-zinc-200/50 overflow-hidden">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateCartQuantity(item.id, item.selectedSize, -1);
                                    }}
                                    className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 transition-colors font-black select-none"
                                  >
                                    -
                                  </button>
                                  <span className="px-1 text-zinc-800 font-black min-w-[14px] text-center select-none">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateCartQuantity(item.id, item.selectedSize, 1);
                                    }}
                                    className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 transition-colors font-black select-none"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Price & Remove */}
                            <div className="flex flex-col items-end justify-between shrink-0 py-0.5">
                              <span className="text-xs font-black text-zinc-900">{item.price}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(item.id, item.selectedSize);
                                }}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <i className="ti ti-trash text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                      <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-500">Tổng tạm tính:</span>
                          <span className="text-base font-black text-accent">{calculateTotal(cart)}</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            showToastNotification("Tiến hành thanh toán đơn hàng!");
                          }}
                          className="w-full bg-accent text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(255,107,0,0.2)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
                        >
                          Thanh toán ngay <i className="ti ti-arrow-right"></i>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Section */}
            {user ? (
              <div className="relative group/user-menu">
                <button
                  className="flex items-center justify-center p-0 w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xs border border-orange-500/30 shadow-sm transition-all hover:shadow-[0_0_12px_rgba(255,107,0,0.3)] select-none cursor-pointer"
                  aria-label="Tài khoản"
                >
                  {user.avatar && (user.avatar.startsWith("http") || user.avatar.includes("/")) ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    user.avatar || "US"
                  )}
                </button>

                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-5 z-[100] transition-all duration-200 scale-95 opacity-0 pointer-events-none group-hover/user-menu:scale-100 group-hover/user-menu:opacity-100 group-hover/user-menu:pointer-events-auto flex flex-col text-left before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                  <div className="absolute -top-[7px] right-[12px] w-3 h-3 bg-white border-t border-l border-zinc-200/80 rotate-45 z-10 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-orange-500/80 shadow-[0_0_12px_rgba(255,107,0,0.2)] flex items-center justify-center shrink-0">
                      {user.avatar && (user.avatar.startsWith("http") || user.avatar.includes("/")) ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-white font-black text-lg bg-gradient-to-tr from-orange-500 to-amber-500 w-full h-full flex items-center justify-center">
                          {user.avatar || "US"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-sm font-black text-zinc-850 truncate leading-tight">{user.name}</span>
                      <span className="text-[10px] text-zinc-500 truncate mt-0.5">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => showToastNotification("Tính năng Hồ sơ cá nhân đang phát triển!")}
                      className="w-full py-3 border-b border-zinc-100 hover:text-orange-500 text-zinc-750 transition-colors flex items-center justify-between text-xs font-bold group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <i className="ti ti-user text-base text-orange-500" />
                        Hồ sơ cá nhân
                      </div>
                      <i className="ti ti-chevron-right text-xs text-zinc-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => showToastNotification("Lịch sử đơn hàng đang tải...")}
                      className="w-full py-3 border-b border-zinc-100 hover:text-orange-500 text-zinc-750 transition-colors flex items-center justify-between text-xs font-bold group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <i className="ti ti-package text-base text-orange-500" />
                        Đơn hàng của tôi
                      </div>
                      <i className="ti ti-chevron-right text-xs text-zinc-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => showToastNotification("Danh sách yêu thích đang mở...")}
                      className="w-full py-3 hover:text-orange-500 text-zinc-750 transition-colors flex items-center justify-between text-xs font-bold group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <i className="ti ti-heart text-base text-orange-500" />
                        Danh sách yêu thích
                      </div>
                      <i className="ti ti-chevron-right text-xs text-zinc-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full mt-4 py-3 rounded-2xl border border-orange-500/25 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 text-orange-500 hover:text-orange-650 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(255,107,0,0.02)]"
                    >
                      <i className="ti ti-logout text-base" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="action-btn flex items-center justify-center" aria-label="Tài khoản">
                <i className="ti ti-user"></i>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <i className="ti ti-x"></i> : <i className="ti ti-menu-2"></i>}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-background border-b border-border-color py-6 px-6 z-40 transition-all duration-300 flex flex-col gap-4">
            <Link href="/#product-section" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold hover:text-accent py-1">Sản phẩm</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold hover:text-accent py-1">Nam</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold hover:text-accent py-1">Nữ</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold hover:text-accent py-1">Sale</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold hover:text-accent py-1">Xu hướng</Link>
            <Link href="/gioi-thieu" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-accent py-1">Về chúng tôi</Link>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-50% left-50% min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none"
          style={{ top: "50%", left: "50%" }}
        >
          <source src="/uploads/3627-172488393.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Visual Vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/60 pointer-events-none z-1" />

        <div className="relative text-center text-white px-6 z-10 max-w-4xl select-none">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 0.8, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="uppercase text-xs md:text-sm mb-4 font-black tracking-[0.3em] text-accent font-sans"
          >
            {pageConfig?.content?.subtitle || "CÂU CHUYỆN SNEAKER CULTURE"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter mb-6 leading-none drop-shadow-lg"
          >
            VỀ CHÚNG TÔI
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "96px" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-1 bg-accent mx-auto"
          />
        </div>
      </section>

      <main className="flex-grow">
        {/* 3. JOURNEY SECTION WITH SIDE VIDEO */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text details */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex flex-col text-left"
            >
              <span className="text-accent text-xs font-black tracking-widest uppercase mb-3">Tầm nhìn & Hành trình</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 italic uppercase tracking-tighter text-foreground">
                Hành trình của chúng tôi
              </h2>
              <p className="text-base md:text-lg text-text-muted font-semibold leading-relaxed mb-6">
                Được thành lập từ năm 2024 bởi những người trẻ đam mê giày thể thao, <span className="font-black text-foreground">OmniShoe</span> không đơn thuần là một cửa hàng bán giày, mà là nơi nuôi dưỡng tinh thần và kết nối cộng đồng yêu sneaker tại Việt Nam.
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(255,107,0,0.3)] animate-pulse shrink-0">
                  24
                </div>
                <p className="font-bold uppercase tracking-widest text-xs md:text-sm text-foreground">Ra đời từ đam mê thuần khiết</p>
              </div>

              <p className="text-base md:text-lg text-text-muted font-semibold leading-relaxed">
                Chúng tôi tin rằng mỗi bước đi đều xứng đáng có một người bạn đồng hành chất lượng. Đó là lý do Omnishoe luôn khắt kê trong việc lựa chọn từng sản phẩm từ các thương hiệu chính hãng toàn cầu.
              </p>
            </motion.div>

            {/* Image container */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleUp}
              className="relative group overflow-hidden rounded-[32px] border border-border-color shadow-2xl aspect-video"
            >
              <Image
                src="/sneakers.webp"
                alt="Sneakers journey"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* 4. MISSION SECTION (DARK NEON ORANGE GLOW) */}
        <section className="bg-zinc-950 text-white py-32 px-6 md:px-12 relative overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-20 pointer-events-none z-0"
            style={{ top: "50%", left: "50%" }}
          >
            <source src="/uploads/10535762-uhd_4096_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />

          {/* Orange glow blurring background details */}
          <div className="absolute top-0 right-0 opacity-25 w-[500px] h-[500px] bg-accent blur-[150px] rounded-full pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 opacity-15 w-[300px] h-[300px] bg-amber-500 blur-[120px] rounded-full pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-accent text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-6 block"
            >
              Sứ mệnh của chúng tôi
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-black italic leading-relaxed md:leading-relaxed lg:leading-relaxed mb-8 text-white uppercase tracking-normal"
            >
              "CHÚNG TÔI MANG ĐẾN GIẢI PHÁP SỞ HỮU CÁC MẪU GIÀY CHÍNH HÃNG 100% VỚI CHÍNH SÁCH BẢO HÀNH RÕ RÀNG, ĐÁNG TIN CẬY NHẤT."
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-20 h-1 bg-accent mx-auto mb-8 origin-center"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-semibold leading-relaxed md:leading-relaxed lg:leading-relaxed"
            >
              OmniShoe tin rằng mỗi đôi giày đều mang trong mình một câu chuyện lịch sử đặc biệt. Chúng tôi mang sứ mệnh giữ vững và phát triển nền văn hóa sneaker nguyên bản tại Việt Nam.
            </motion.p>
          </div>
        </section>

        {/* 5. COMMITMENTS SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-16 italic text-center uppercase tracking-tight text-foreground"
          >
            Cam kết từ OmniShoe
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-shield-check text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">100% Authentic</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Tất cả sản phẩm được phân phối qua OmniShoe đều được kiểm tra nghiêm ngặt về chất lượng và nguồn gốc trước khi gửi tới khách hàng.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-shopping-bag text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">Dịch vụ xuất sắc</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Hỗ trợ tư vấn size chính xác và đổi size miễn phí trong 30 ngày. Khách hàng luôn là ưu tiên hàng đầu của chúng tôi.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-users text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">Cộng đồng năng động</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Chúng tôi thường xuyên tổ chức các sự kiện kết nối cộng đồng sneakerhead, chia sẻ những thông tin và xu hướng mới nhất.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 6. COMMUNITY / STREETWEAR MOVEMENT SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-border-color">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image container */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleUp}
              className="relative group overflow-hidden rounded-[32px] border border-border-color shadow-2xl aspect-video lg:order-last"
            >
              <Image
                src="/photo-1-1554814699613836808416.webp"
                alt="OmniShoe & You"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>

            {/* Description content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col text-left"
            >
              <span className="text-accent text-xs md:text-sm font-black uppercase tracking-wider mb-2">OmniShoe & You</span>
              <h2 className="text-3xl md:text-4xl font-black mb-8 italic uppercase tracking-tighter text-foreground">
                Kết nối & Lan tỏa
              </h2>
              <p className="text-base text-text-muted font-semibold leading-relaxed mb-6">
                Văn hóa sneaker không chỉ dừng lại ở việc mua hay đi một đôi giày hiệu. Đó là phong thái của thế hệ mới, sự khẳng định cái tôi đầy khác biệt, và là sợi dây vô hình kết kết những tâm hồn đồng điệu có niềm đam mê thời trang streetwear mãnh liệt.
              </p>
              <p className="text-base text-text-muted font-semibold leading-relaxed">
                OmniShoe tự hào đồng hành cùng thế hệ trẻ Việt Nam trong từng chuyển động, cùng xây dựng và khẳng định vị thế của Sneaker Culture đích thực.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="footer border-t border-border-color">
        <div className="footer-container">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo-link">
              <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" className="footer-logo-image" />
            </Link>
            <p>Dẫn đầu xu hướng, khẳng định chất riêng. OmniShoe mang văn hóa sneaker thực thụ đến cộng đồng Gen Z Việt Nam.</p>
            <div className="social-links">
              {["instagram", "tiktok", "facebook", "youtube"].map((social) => (
                <a key={social} href="#" aria-label={social}>
                  <i className={`ti ti-brand-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="footer-col">
            <h4>MUA SẮM</h4>
            <ul>
              {["Sản phẩm Nam", "Sản phẩm Nữ", "Thương hiệu nổi bật", "Đặc quyền VIP", "Bộ sưu tập Sale"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="footer-col">
            <h4>HỖ TRỢ</h4>
            <ul>
              {["Chính sách giao hàng", "Chính sách đổi trả 30 ngày", "Hướng dẫn chọn size giày", "Bảo hành sản phẩm", "Liên hệ hỗ trợ"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="footer-col contact-col">
            <h4>CỬA HÀNG</h4>
            <ul>
              <li>
                <i className="ti ti-map-pin"></i>
                <span>123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội.</span>
              </li>
              <li>
                <i className="ti ti-phone"></i>
                <span>Hotline: 1900 8198 (8h00 - 22h00)</span>
              </li>
              <li>
                <i className="ti ti-mail"></i>
                <span>Email: vanmai756@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OmniShoe. Bản quyền thuộc về sneakerhead Việt Nam.</p>

          <div className="bottom-social-links flex gap-4 my-2 sm:my-0">
            {["instagram", "tiktok", "facebook", "youtube"].map((social) => (
              <a key={social} href="#" aria-label={social} className="text-text-muted hover:text-accent transition-colors text-lg">
                <i className={`ti ti-brand-${social}`}></i>
              </a>
            ))}
          </div>

          <div className="bottom-links">
            <a href="#">Điều khoản dịch vụ</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Quản lý Cookie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
