"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
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
  );
}
