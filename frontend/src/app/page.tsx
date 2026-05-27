"use client";

import { useState, useEffect } from "react";
import ShoeSlider from "@/components/ShoeSlider";


// Mock products data
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
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Air Max 270 React",
    brand: "Nike",
    price: "3,490,000₫",
    oldPrice: "4,200,000₫",
    rating: 4.8,
    reviews: 120,
    badge: "Bestseller",
    photoId: "photo-1542291026-7eec264c27ff",
    category: "Lifestyle",
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
  },
  {
    id: 3,
    name: "Air Jordan 1 High OG",
    brand: "Jordan",
    price: "5,800,000₫",
    rating: 4.9,
    reviews: 210,
    badge: "Hot",
    photoId: "photo-1600185365483-26d7a4cc7519",
    category: "Basketball",
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
  },
  {
    id: 5,
    name: "990v6 Made in USA",
    brand: "New Balance",
    price: "6,200,000₫",
    rating: 4.8,
    reviews: 43,
    badge: "Limited",
    photoId: "photo-1539185441755-769473a23570",
    category: "Lifestyle",
  },
  {
    id: 6,
    name: "Chuck 70 Hi",
    brand: "Converse",
    price: "1,890,000₫",
    oldPrice: "2,100,000₫",
    rating: 4.6,
    reviews: 150,
    badge: "Classic",
    photoId: "photo-1514989940723-e8e51635b782",
    category: "Lifestyle",
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
];

const categories = ["Tất cả", "Lifestyle", "Running", "Basketball"];

export default function Home() {
  // App States
  const [isDark, setIsDark] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
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

  // Add to cart action
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    showToastNotification(`Đã thêm ${product.name} vào giỏ hàng! 🛒`);
  };

  // Filter products
  const filteredProducts = mockProducts.filter((p) => {
    if (activeFilter === "Tất cả") return true;
    return p.category === activeFilter;
  });

  // Main render
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      
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
                className="btn btn-primary"
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

        {/* 3. FEATURED BRANDS */}
        <section className="brands">
          <p className="brands-subtitle">Thương hiệu đối tác nổi bật</p>
          <div className="brands-container">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  showToastNotification(`Đang hiển thị sản phẩm liên quan đến ${brand}`);
                }}
              >
                <i className="ti ti-brand-kickstarter"></i>
                {brand}
              </button>
            ))}
          </div>
        </section>

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
                const isWishlisted = wishlist.includes(product.id);
                
                return (
                  <div key={product.id} className="product-card">
                    {/* Badge */}
                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`wishlist-btn-card ${isWishlisted ? "active" : ""}`}
                      aria-label="Yêu thích"
                    >
                      <i className={isWishlisted ? "ti ti-heart-filled" : "ti ti-heart"}></i>
                    </button>

                    {/* Image container */}
                    <div className="product-img">
                      <img
                        src={`https://images.unsplash.com/${product.photoId}?w=480&q=80`}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=480&q=80";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="product-info">
                      <div>
                        <span className="product-brand">{product.brand}</span>
                        <h3 className="product-name">{product.name}</h3>
                        
                        {/* Stars Rating */}
                        <div className="product-rating">
                          <i className="ti ti-star-filled"></i>
                          <span className="rating-value">{product.rating}</span>
                          <span className="reviews-count">({product.reviews} đánh giá)</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="product-meta">
                        <div className="product-price">
                          <span className="current-price">{product.price}</span>
                          {product.oldPrice && (
                            <span className="old-price">{product.oldPrice}</span>
                          )}
                        </div>

                        {/* Add to Cart button */}
                        <button
                          onClick={() => addToCart(product)}
                          className="add-to-cart-btn"
                          aria-label="Thêm vào giỏ hàng"
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border-color rounded-3xl">
              <p className="font-bold text-lg mt-4">Không tìm thấy sản phẩm phù hợp!</p>
            </div>
          )}
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
