"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

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

interface HeaderProps {
  onSelectBrand?: (brand: string) => void;
  onScrollToProducts?: () => void;
}

export default function Header({ onSelectBrand, onScrollToProducts }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cart,
    wishlist,
    user,
    showToast,
    updateCartQuantity,
    updateCartItemSize,
    removeFromCart,
    logout,
  } = useAppContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const cartDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close cart on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateTotal = (cartItems: any[]) => {
    const total = cartItems.reduce((sum, item) => {
      const priceVal = parseInt(item.price.replace(/[^\d]/g, ""));
      return sum + priceVal * item.quantity;
    }, 0);
    return total.toLocaleString("vi-VN") + "₫";
  };

  const handleBrandClick = (brand: string) => {
    if (pathname === "/" && onSelectBrand) {
      onSelectBrand(brand);
    } else {
      router.push(`/?brand=${brand}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/" && onScrollToProducts) {
      onScrollToProducts();
    } else {
      router.push("/#product-section");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header w-full">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="header-logo-link">
          <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" className="header-logo-image" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <a href="#" onClick={handleProductsClick}>Sản phẩm</a>
          
          {/* Men Category */}
          <div className="nav-item-has-submenu">
            <a href="#" className="nav-link-trigger" onClick={(e) => e.preventDefault()}>Nam</a>
            <div className="mega-menu !w-[480px]">
              <div className="grid grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-accent mb-3">Dòng sản phẩm</h4>
                  <ul className="flex flex-col gap-2.5">
                    {["Lifestyle Sneaker", "Running / Performance", "Basketball / Cổ cao", "Classic Canvas", "Chunky Sneaker", "Sandal & Dép"].map((item) => (
                      <li key={item}>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`Đang lọc sản phẩm Nam: ${item}`);
                          }}
                          className="text-xs font-bold text-zinc-500 hover:text-accent transition-colors block py-0.5"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="flex flex-col justify-between p-4 rounded-2xl relative overflow-hidden min-h-[170px] group/banner text-white border border-zinc-200/10"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0.4) 100%), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="relative z-10 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30">Hot Drop</span>
                    <h5 className="text-xs font-black text-white mt-3 leading-tight uppercase">Men's Sneaker</h5>
                    <p className="text-[10px] !text-zinc-200 mt-1.5 leading-normal font-semibold">Những phối màu và thiết kế độc quyền dành riêng cho Nam.</p>
                  </div>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Đang hiển thị toàn bộ sản phẩm Nam");
                    }}
                    className="relative z-10 text-[10px] font-black uppercase tracking-wider !text-white hover:!text-accent transition-all flex items-center gap-1 mt-3 group-hover/banner:translate-x-1"
                  >
                    Xem tất cả <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Women Category */}
          <div className="nav-item-has-submenu">
            <a href="#" className="nav-link-trigger" onClick={(e) => e.preventDefault()}>Nữ</a>
            <div className="mega-menu !w-[480px]">
              <div className="grid grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-accent mb-3">Dòng sản phẩm</h4>
                  <ul className="flex flex-col gap-2.5">
                    {["Lifestyle Sneaker", "Running / Performance", "Chunky / Platform", "Classic Canvas", "Sandal & Dép"].map((item) => (
                      <li key={item}>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`Đang lọc sản phẩm Nữ: ${item}`);
                          }}
                          className="text-xs font-bold text-zinc-500 hover:text-accent transition-colors block py-0.5"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="flex flex-col justify-between p-4 rounded-2xl relative overflow-hidden min-h-[170px] group/banner text-white border border-zinc-200/10"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0.4) 100%), url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="relative z-10 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30">Sporty Chic</span>
                    <h5 className="text-xs font-black text-white mt-3 leading-tight uppercase">Women's Sneaker</h5>
                    <p className="text-[10px] !text-zinc-200 mt-1.5 leading-normal font-semibold">Những phối màu tinh tế và êm ái dành riêng cho Nữ.</p>
                  </div>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Đang hiển thị toàn bộ sản phẩm Nữ");
                    }}
                    className="relative z-10 text-[10px] font-black uppercase tracking-wider !text-white hover:!text-accent transition-all flex items-center gap-1 mt-3 group-hover/banner:translate-x-1"
                  >
                    Xem tất cả <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Brands Submenu */}
          <div className="nav-item-has-submenu">
            <a href="#" className="nav-link-trigger" onClick={(e) => e.preventDefault()}>Thương hiệu</a>
            <div className="mega-menu">
              <div className="mega-menu-grid">
                {brands.map((brand) => (
                  <button 
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className="mega-menu-item"
                  >
                    <img src={brandLogos[brand]} alt={brand} />
                    <span>{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Link href="/#product-section">Sale</Link>
          <Link href="/#product-section">Xu hướng</Link>
          <Link href="/gioi-thieu">Về chúng tôi</Link>
        </nav>

        {/* Action icons */}
        <div className="header-actions">
          {/* Search Input */}
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm Air Jordan, Nike..." />
            <i className="ti ti-search"></i>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => showToast(`Yêu thích đang có ${wishlist.length} sản phẩm`)}
            className="action-btn"
            aria-label="Yêu thích"
          >
            <i className="ti ti-heart"></i>
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </button>

          {/* Cart Bag with Dropdown */}
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
                  <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider uppercase text-zinc-500">Giỏ hàng của bạn</span>
                    <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent font-black px-2 py-0.5 rounded-full">
                      {cart.length} dòng
                    </span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <i className="ti ti-shopping-bag text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-700">Giỏ hàng trống</p>
                          <p className="text-xs text-zinc-400 mt-1">Hãy thêm sản phẩm yêu thích của bạn vào giỏ!</p>
                        </div>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}`} className="p-4 flex gap-3 hover:bg-zinc-50 transition-colors group">
                          <div className="w-16 h-16 rounded-xl bg-zinc-100/80 border border-zinc-200/50 overflow-hidden shrink-0 flex items-center justify-center relative">
                            <Image
                              src={item.photoId.startsWith("/") || item.photoId.startsWith("http") ? item.photoId : `https://images.unsplash.com/${item.photoId}?w=150&q=80`}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className={`w-full h-full ${item.photoId.startsWith("/") ? "object-contain p-1.5" : "object-cover"}`}
                            />
                          </div>

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
                                    <option key={sz} value={sz}>
                                      {sz}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center bg-zinc-100 rounded border border-zinc-200/50 overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateCartQuantity(item.id, item.selectedSize, -1);
                                  }}
                                  className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 transition-colors font-black select-none"
                                  title="Giảm số lượng"
                                >
                                  -
                                </button>
                                <span className="px-1 text-zinc-800 font-black min-w-[14px] text-center select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateCartQuantity(item.id, item.selectedSize, 1);
                                  }}
                                  className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 transition-colors font-black select-none"
                                  title="Tăng số lượng"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between shrink-0 py-0.5">
                            <span className="text-xs font-black text-zinc-900">{item.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id, item.selectedSize);
                              }}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <i className="ti ti-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-500">Tổng tạm tính:</span>
                        <span className="text-base font-black text-accent">{calculateTotal(cart)}</span>
                      </div>
                      <Link
                        href="/checkout"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full bg-accent text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(255,107,0,0.2)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.3)] text-center block"
                      >
                        Thanh toán ngay <i className="ti ti-arrow-right"></i>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account Menu */}
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
                    onClick={() => showToast("Tính năng Hồ sơ cá nhân đang phát triển!")}
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
                    onClick={() => showToast("Lịch sử đơn hàng đang tải...")}
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
                    onClick={() => showToast("Danh sách yêu thích đang mở...")}
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
                    className="w-full mt-4 py-3 rounded-2xl border border-orange-500/25 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 text-orange-500 hover:text-orange-650 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Hamburger Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-toggle"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <i className="ti ti-x"></i> : <i className="ti ti-menu-2"></i>}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-background border-b border-border-color py-6 px-6 z-40 transition-all duration-300 flex flex-col gap-4 text-left">
          <a
            href="#"
            onClick={handleProductsClick}
            className="text-lg font-semibold hover:text-accent py-1"
          >
            Sản phẩm
          </a>
          {["Nam", "Nữ"].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                showToast(`Đang hiển thị toàn bộ sản phẩm ${link}`);
              }}
              className="text-lg font-semibold hover:text-accent py-1"
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              showToast("Đang hiển thị danh sách thương hiệu");
            }}
            className="text-lg font-semibold hover:text-accent py-1"
          >
            Thương hiệu
          </a>
          <Link
            href="/gioi-thieu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-semibold hover:text-accent py-1"
          >
            Về chúng tôi
          </Link>
        </div>
      )}
    </header>
  );
}
