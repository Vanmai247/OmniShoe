"use client";

import { useState, useEffect } from "react";
import ShoeSlider from "@/components/ShoeSlider";
import CountdownDrop from "@/components/CountdownDrop";
import StyleQuiz from "@/components/StyleQuiz";

// Mock products data with dynamic glow colors and sizes
interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  badge: string;
  photoId: string;
  category: string;
  glowColor: string;
  sizes: number[];
}

const mockProducts: Product[] = [
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
  },
];

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
  "Nike": "/Nike.png",
  "Adidas": "/adidas.png",
  "Jordan": "/puma-logo-3.jpg",
  "Puma": "/puma-logo-3.jpg",
  "New Balance": "/new-balance-logo.png",
  "Converse": "/logo-converse-vector.jpg",
  "Vans": "/puma-logo-3.jpg",
  "MLB": "/logo-mlb-korea-ruby-store.webp",
};

const categories = ["Tất cả", "Lifestyle", "Running", "Basketball"];

export default function Home() {
  // App States
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<(Product & { selectedSize?: number })[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Custom interactive states
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({});
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Notification Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Dark Mode Sync safely on mount (Permanently Dark Mode)
  useEffect(() => {
    document.documentElement.setAttribute("data-dark", "true");
    localStorage.setItem("theme", "dark");
  }, []);

  // Helper for Toast Notifications
  const showToastNotification = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Wishlist actions
  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToastNotification("Đã xóa khỏi danh sách yêu thích 💔");
    } else {
      setWishlist([...wishlist, productId]);
      showToastNotification("Đã thêm vào danh sách yêu thích ❤️");
    }
  };

  // Add to cart action with size support and click feedback
  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[2]; // fallback to index 2 (usually size 41)
    setCart([...cart, { ...product, selectedSize: size }]);
    showToastNotification(`Đã thêm ${product.name} (Size ${size}) vào giỏ hàng! 🛒`);

    // Trigger tick micro-interaction
    setAddedProducts((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  // Filter products
  const filteredProducts = mockProducts.filter((p) => {
    if (activeFilter === "Tất cả") return true;
    return p.category === activeFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative z-0">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/Gemini_Generated_Image_kb01qnkb01qnkb01.png')`,
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* 1. STICKY HEADER WITH GLASSMORPHISM */}
      <header className="header w-full">
        <div className="header-container">

          {/* Logo */}
          <a href="#" className="logo">
            OMNI<span>SHOE</span>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="nav-links">
            {["Nam", "Nữ", "Thương hiệu", "Sale", "Xu hướng"].map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </nav>

          {/* Search bar & Icons (Desktop) */}
          <div className="header-actions">
            {/* Search Input */}
            <div className="search-box">
              <input type="text" placeholder="Tìm kiếm sneaker..." />
              <i className="ti ti-search"></i>
            </div>

            {/* Actions */}
            <button
              onClick={() => showToastNotification(`Yêu thích đang có ${wishlist.length} sản phẩm`)}
              className="action-btn"
              aria-label="Yêu thích"
            >
              <i className="ti ti-heart"></i>
              {wishlist.length > 0 && (
                <span className="badge">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => showToastNotification(`Giỏ hàng của bạn đang có ${cart.length} sản phẩm`)}
              className="action-btn"
              aria-label="Giỏ hàng"
            >
              <i className="ti ti-shopping-bag"></i>
              {cart.length > 0 && (
                <span className="badge">
                  {cart.length}
                </span>
              )}
            </button>

            <button className="action-btn" aria-label="Tài khoản">
              <i className="ti ti-user"></i>
            </button>
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-background border-b border-border-color py-6 px-6 z-40 transition-all duration-300 flex flex-col gap-4">
            {["Nam", "Nữ", "Thương hiệu", "Sale", "Xu hướng"].map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold hover:text-accent py-1"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <div className="hero-wrapper">
          <section className="hero">
            {/* Text Left */}
            <div className="hero-content">
              <div>
                <span className="hero-badge">
                  <span className="badge-dot"></span>
                  Drop mới
                </span>
              </div>

              <h1 className="hero-title">
                NÂNG TẦM PHONG CÁCH <span>SNEAKER</span> CỦA BẠN
              </h1>

              <p className="hero-desc">
                Đón đầu xu hướng sneaker culture tại Việt Nam. Khám phá những phối màu giới hạn độc nhất dành riêng cho thế hệ Gen Z.
              </p>

              <div className="hero-ctas">
                <button
                  onClick={() => showToastNotification("Tính năng mua hàng đang được cập nhật!")}
                  className="btn btn-primary animate-pulse"
                >
                  Mua ngay <i className="ti ti-arrow-up-right"></i>
                </button>

                <button
                  onClick={() => {
                    const element = document.getElementById("product-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn btn-secondary"
                >
                  Xem xu hướng
                </button>
              </div>

              {/* Stats Bar */}
              <div className="hero-stats">
                <div className="stat-item">
                  <h4>12K+</h4>
                  <p>Sản phẩm</p>
                </div>
                <div className="stat-item">
                  <h4>15+</h4>
                  <p>Thương hiệu</p>
                </div>
                <div className="stat-item">
                  <h4>50K+</h4>
                  <p>Khách hàng</p>
                </div>
              </div>
            </div>

            {/* Visual Right (Shoe Slider) */}
            <div className="hero-visual">
              <ShoeSlider />
            </div>
          </section>
        </div>

        {/* 3. FEATURED BRANDS (Premium Infinite Marquee) */}
        <section className="brands overflow-hidden">
          <p className="brands-subtitle">Thương hiệu đối tác nổi bật</p>
          <div className="marquee-wrapper mt-4">
            <div className="animate-marquee py-2">
              {/* First Set (Repeated 3 times to cover any widescreen seamlessly) */}
              {[...Array(3)].flatMap(() => brands.filter(b => b !== "Jordan" && b !== "Vans")).map((brand, idx) => (
                <button
                  key={`brand-1-${idx}`}
                  onClick={() => showToastNotification(`Đang hiển thị sản phẩm liên quan đến ${brand}`)}
                  className="mx-8 transition-all duration-300 group hover:-translate-y-1 shrink-0"
                >
                  <img
                    src={brandLogos[brand]}
                    alt={brand}
                    className="h-14 md:h-20 w-auto object-contain opacity-85 group-hover:opacity-100 transition-all duration-300"
                  />
                </button>
              ))}
              {/* Duplicate Set for Loop (Perfect Identical Half for seamless transition) */}
              {[...Array(3)].flatMap(() => brands.filter(b => b !== "Jordan" && b !== "Vans")).map((brand, idx) => (
                <button
                  key={`brand-2-${idx}`}
                  onClick={() => showToastNotification(`Đang hiển thị sản phẩm liên quan đến ${brand}`)}
                  className="mx-8 transition-all duration-300 group hover:-translate-y-1 shrink-0"
                >
                  <img
                    src={brandLogos[brand]}
                    alt={brand}
                    className="h-14 md:h-20 w-auto object-contain opacity-85 group-hover:opacity-100 transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3.1. EXCLUSIVE SNEAKER COUNTDOWN EVENT */}
        <CountdownDrop onShowToast={showToastNotification} />

        {/* 4. PRODUCT GRID & FILTERS */}
        <section id="product-section" className="products-section">
          <div className="section-header">
            <div>
              <span className="section-tag">Bộ sưu tập nổi bật</span>
              <h2 className="section-title">SNEAKER CỰC HOT CHO BẠN</h2>
            </div>

            {/* Filter Pills */}
            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    showToastNotification(`Đã lọc danh mục: ${cat}`);
                  }}
                  className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isAdded = addedProducts.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="product-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,87,34,0.08)] bg-card-background border border-border-color rounded-[24px]"
                  >
                    {/* Dynamic Radial Mesh Glow behind card */}
                    <div
                      className="absolute -inset-10 opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-full blur-[40px] pointer-events-none -z-10"
                      style={{ background: `radial-gradient(circle, ${product.glowColor} 0%, transparent 70%)` }}
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`wishlist-btn-card ${wishlist.includes(product.id) ? "active" : ""}`}
                      aria-label="Yêu thích"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={wishlist.includes(product.id) ? "#ef4444" : "none"}
                        stroke={wishlist.includes(product.id) ? "#ef4444" : "currentColor"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                        style={{
                          animation: wishlist.includes(product.id) ? "heartbeat 0.45s ease-in-out" : "none"
                        }}
                      >
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                    </button>

                    {/* Image container with Sliding Quick Size Picker */}
                    <div className="product-img relative overflow-hidden bg-bg-secondary w-full aspect-[1.15]">
                      <img
                        src={product.photoId.startsWith("/") || product.photoId.startsWith("http") ? product.photoId : `https://images.unsplash.com/${product.photoId}?w=480&q=80`}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=480&q=80";
                        }}
                        className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${product.photoId.startsWith("/") ? "object-contain p-4" : "object-cover"
                          }`}
                      />

                      {/* Sliding Quick Size Picker */}
                      <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1.5 items-center z-20">
                        <span className="text-[10px] text-text-muted font-black tracking-wider uppercase">Chọn nhanh Size giày</span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {product.sizes.map((sz) => {
                            const isSelected = selectedSizes[product.id] === sz;
                            return (
                              <button
                                key={sz}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedSizes((prev) => ({ ...prev, [product.id]: sz }));
                                  showToastNotification(`Đã chọn Size ${sz} cho ${product.name} 👟`);
                                }}
                                className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all duration-200 border ${isSelected
                                    ? "bg-accent border-accent text-white"
                                    : "bg-bg-secondary border-border-color text-text-muted hover:border-accent hover:text-accent"
                                  }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="product-info p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="product-brand text-xs font-bold text-accent uppercase tracking-wider">{product.brand}</span>
                        <h3 className="product-name text-lg font-extrabold text-foreground leading-snug mt-1">{product.name}</h3>

                        {/* Stars Rating */}
                        <div className="product-rating flex items-center gap-1.5 mt-2">
                          <i className="ti ti-star-filled text-amber-500 text-sm"></i>
                          <span className="rating-value text-xs font-bold">{product.rating}</span>
                          <span className="reviews-count text-xs text-text-muted">({product.reviews} đánh giá)</span>
                        </div>
                      </div>

                      {/* Price & Cart CTA */}
                      <div className="product-meta flex items-center justify-between mt-4">
                        <div className="product-price flex flex-col">
                          <span className="current-price text-xl font-black text-accent">{product.price}</span>
                          {product.oldPrice && (
                            <span className="old-price text-xs text-text-muted text-decoration-line-through">{product.oldPrice}</span>
                          )}
                        </div>

                        {/* Add to Cart button with check micro-interaction */}
                        <button
                          onClick={() => addToCart(product)}
                          className={`add-to-cart-btn shrink-0 ${isAdded ? "bg-accent text-white" : ""
                            }`}
                          aria-label="Thêm vào giỏ hàng"
                        >
                          {isAdded ? (
                            <i className="ti ti-check animate-bounce"></i>
                          ) : (
                            <i className="ti ti-plus"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border-color rounded-[32px]">
              <p className="font-bold text-lg mt-4 text-text-muted">Không tìm thấy sản phẩm phù hợp!</p>
            </div>
          )}
        </section>

        {/* 4.1. INTERACTIVE STYLE FINDER QUIZ */}
        <StyleQuiz
          products={mockProducts}
          onAddToCart={addToCart}
          onShowToast={showToastNotification}
        />

        {/* 4.2. SOCIAL PROOF WALL: #OMNISHOESTYLE */}
        <section className="max-w-[1440px] mx-auto px-8 md:px-12 my-16 text-center">
          <div className="mb-10">
            <span className="text-accent text-xs font-black tracking-wider uppercase">Cộng đồng Streetwear</span>
            <h2 className="text-2xl md:text-4xl font-black mt-1 uppercase tracking-tight">NHỊP ĐẬP SNEAKER #OMNISHOESTYLE</h2>
            <p className="text-xs text-text-muted mt-2 font-semibold">Tag ngay @OmniShoe.vn trên Instagram để xuất hiện trong góc phối đồ cực chất!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, user: "@namstreetwear", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80", shoe: "Air Max 270", size: "social-card-large" },
              { id: 2, user: "@lanahype", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80", shoe: "Jordan 1 High", size: "" },
              { id: 3, user: "@sneakerhead_vn", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80", shoe: "990v6 Made in USA", size: "social-card-large" },
              { id: 4, user: "@quanganh_oootd", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80", shoe: "RS-X Bold", size: "" },
            ].map((card) => (
              <div
                key={card.id}
                className={`social-card group ${card.size}`}
              >
                <img src={card.image} alt={card.user} />
                <div className="social-card-overlay">
                  <span className="font-extrabold text-sm text-foreground">{card.user}</span>
                  <span className="text-[10px] text-accent font-black tracking-wider uppercase mt-0.5">Diện đôi: {card.shoe}</span>
                  <span className="text-xs font-bold text-text-muted mt-2 flex items-center gap-1">
                    <i className="ti ti-heart-filled text-red-500"></i> 1.2K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4.3. CUSTOMER TESTIMONIALS */}
        <section className="bg-bg-secondary/40 border-t border-b border-border-color py-16 px-8 md:px-12 my-16">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent text-xs font-black tracking-wider uppercase">Được tin tưởng bởi các Sneakerhead</span>
              <h2 className="text-2xl md:text-4xl font-black mt-1 uppercase tracking-tight text-center">PHẢN HỒI THỰC TẾ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  name: "Hoàng Nam",
                  username: "@namstreetwear",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
                  rating: 5,
                  shoe: "RS-X Bold",
                  comment: "Giao hàng siêu tốc chỉ trong 2 giờ nội thành. Giày fullbox, thơm phức, tag mác và giấy chứng nhận đầy đủ. Rất an tâm khi chọn mua tại OmniShoe!"
                },
                {
                  id: 2,
                  name: "Khánh Linh",
                  username: "@linh.kicks",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
                  rating: 5,
                  shoe: "Air Max 270 React",
                  comment: "Chăm sóc khách hàng siêu nhiệt tình, tư vấn size cực chuẩn. Đôi 270 này mang đi bộ cả ngày không lo đau chân, phối màu cam neon quá xuất sắc!"
                },
                {
                  id: 3,
                  name: "Đức Huy",
                  username: "@huy_hypebeast",
                  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
                  rating: 5,
                  shoe: "Air Jordan 1 High OG",
                  comment: "Là một sneakerhead lâu năm, mình cực kỳ khó tính về tính chính xác của giày. OmniShoe đã thuyết phục hoàn toàn bằng sự minh bạch và bảo hành đền gấp 10 lần."
                }
              ].map((t) => (
                <div key={t.id} className="bg-background border border-border-color p-8 rounded-[24px] flex flex-col justify-between gap-6 hover:border-accent/40 transition-colors duration-300 text-left">
                  <div className="flex flex-col gap-4">
                    {/* Stars */}
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <i key={i} className="ti ti-star-filled text-sm"></i>
                      ))}
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed italic font-medium">
                      "{t.comment}"
                    </p>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-border-color" />
                    <div className="text-left">
                      <h4 className="font-extrabold text-sm text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-text-muted font-bold tracking-wide">{t.username}</p>
                      <p className="text-[9px] text-accent font-black tracking-wider uppercase mt-0.5">Đã mua: {t.shoe}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. VALUE PROPOSITION SECTION */}
      <section className="values">
        <div className="values-container">
          <div className="value-card">
            <div className="value-icon"><i className="ti ti-truck"></i></div>
            <h3>Giao hàng miễn phí</h3>
            <p>Miễn phí vận chuyển cho tất cả đơn hàng nội thành Hà Nội & TP. HCM với hóa đơn trên 1 triệu.</p>
          </div>

          <div className="value-card">
            <div className="value-icon"><i className="ti ti-arrows-right-left"></i></div>
            <h3>Đổi trả 30 ngày</h3>
            <p>Chính sách đổi hàng dễ dàng trong vòng 30 ngày kể từ khi nhận sản phẩm nếu không vừa size.</p>
          </div>

          <div className="value-card">
            <div className="value-icon"><i className="ti ti-shield-check"></i></div>
            <h3>Chính hãng 100%</h3>
            <p>Cam kết đền gấp 10 lần giá trị sản phẩm nếu phát hiện hàng giả hàng nhái, bảo hành uy tín.</p>
          </div>
        </div>
      </section>

      {/* 5.1. FAQ ACCORDION SECTION */}
      <section className="max-w-[800px] mx-auto px-8 my-16 text-left w-full">
        <div className="text-center mb-10">
          <span className="text-accent text-xs font-black tracking-wider uppercase">Giải đáp thắc mắc</span>
          <h2 className="text-2xl md:text-4xl font-black mt-1 uppercase tracking-tight text-center">CÂU HỎI THƯỜNG GẶP</h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              q: "OmniShoe cam kết chất lượng sản phẩm như thế nào?",
              a: "OmniShoe cam kết 100% sản phẩm phân phối là hàng chính hãng từ các thương hiệu hàng đầu thế giới. Chúng tôi áp dụng chính sách đền bù gấp 10 lần giá trị đơn hàng nếu phát hiện hàng giả, hàng nhái, cùng thẻ bảo hành chính hãng đi kèm mỗi đôi giày."
            },
            {
              q: "Nếu tôi chọn size không vừa thì có được hỗ trợ đổi không?",
              a: "Hoàn toàn ĐƯỢC! OmniShoe hỗ trợ đổi size hoàn toàn miễn phí trong vòng 30 ngày kể từ khi nhận hàng. Sản phẩm đổi yêu cầu chưa qua sử dụng, còn nguyên tag mác, hộp giày nguyên vẹn. Bạn chỉ cần liên hệ hotline, shipper sẽ qua tận nơi hỗ trợ đổi."
            },
            {
              q: "Thời gian và chi phí giao hàng mất bao lâu?",
              a: "Chúng tôi áp dụng chương trình miễn phí giao hàng cho tất cả các đơn hàng trên 1 triệu đồng. Thời gian nhận hàng là siêu tốc 2 giờ đối với khu vực nội thành Hà Nội & TP. HCM, và từ 2-3 ngày làm việc đối với các tỉnh thành khác trên toàn quốc."
            },
            {
              q: "Tôi có thể kiểm tra sản phẩm trước khi thanh toán không?",
              a: "Có, tất cả các đơn hàng gửi qua đối tác vận chuyển của OmniShoe đều cho phép khách hàng đồng kiểm trước khi nhận. Bạn hoàn toàn có thể kiểm tra tem mác, độ nguyên vẹn của hộp và sản phẩm trước khi thanh toán tiền cho shipper."
            }
          ].map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-bg-secondary/40 border border-border-color rounded-2xl overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-extrabold text-sm md:text-base text-foreground hover:text-accent transition-colors duration-200 outline-none"
                >
                  <span>{faq.q}</span>
                  <i className={`ti ${isOpen ? "ti-chevron-up" : "ti-chevron-down"} text-accent transition-transform duration-300 text-lg`}></i>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[200px] border-t border-border-color p-6 bg-black/25" : "max-h-0"
                    }`}
                >
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed font-semibold">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter">
        <div className="newsletter-box">
          <div className="newsletter-info">
            <span className="newsletter-tag">Sneaker Newsletter</span>
            <h3>NHẬN NGAY VOUCHER 100K</h3>
            <p>Đăng ký email để nhận tin tức các đợt Restock & đợt phát hành hot nhất sớm nhất.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToastNotification("Đăng ký nhận tin thành công! 🎉 Hãy check hộp thư.");
              (e.target as HTMLFormElement).reset();
            }}
            className="newsletter-form"
          >
            <input
              type="email"
              required
              placeholder="Nhập email của bạn..."
            />
            <button type="submit" className="btn-subscribe">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="footer">
        <div className="footer-container">

          {/* Brand Column */}
          <div className="footer-col brand-col">
            <a href="#" className="logo">
              OMNI<span>SHOE</span>
            </a>
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
                <span>Email: support@omnishoe.vn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OmniShoe. Bản quyền thuộc về sneakerhead Việt Nam.</p>

          <div className="bottom-links">
            <a href="#">Điều khoản dịch vụ</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Quản lý Cookie</a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE TOAST NOTIFICATION */}
      <div className={`toast ${toast.show ? "show" : ""}`}>
        <div className="toast-icon">
          <i className="ti ti-info-circle"></i>
        </div>
        <p className="toast-message">{toast.message}</p>
      </div>

    </div>
  );
}
