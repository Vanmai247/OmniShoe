# Đặc tả Kỹ thuật Giao diện Trang chủ OmniShoe (HTML/CSS/JS thuần)

Tài liệu này xác định thiết kế kiến trúc và đặc tả chi tiết để xây dựng trang chủ thương mại điện tử **OmniShoe** bằng công nghệ web thuần túy (Vanilla HTML/CSS/JS) tại thư mục gốc của dự án.

---

## 1. Kiến trúc Tệp & Cấu trúc Thư mục

Để đảm bảo dự án gọn gàng và không phụ thuộc vào framework, chúng ta sẽ tạo 3 file cốt lõi trực tiếp ở thư mục gốc:

*   **`c:\OmniShoe\index.html`**: Chứa toàn bộ thẻ HTML5 ngữ nghĩa và cấu trúc trang web.
*   **`c:\OmniShoe\style.css`**: Định nghĩa biến CSS, lớp tiện ích, và responsive.
*   **`c:\OmniShoe\app.js`**: Quản lý trạng thái giao diện và các tương tác động của người dùng.

---

## 2. Đặc tả Giao diện & Phong cách (UI/UX)

### 2.1. Cấu trúc Hệ thống Màu sắc & Biến CSS (`style.css`)
Hỗ trợ chuyển đổi Dark/Light mode thông qua thuộc tính `data-dark` ở thẻ `<html>`:

```css
:root {
  --background: #ffffff;
  --foreground: #111111;
  --accent: #FF5722;       /* Cam neon thể thao */
  --bg-secondary: #f5f5f7;  /* Xám nhạt */
  --text-muted: #666666;
  --border-color: #e5e5e5;
  --card-background: #ffffff;
  --bg-rgb: 255, 255, 255;
  --shadow-color: 0, 0, 0;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Kích hoạt khi thẻ <html> có thuộc tính data-dark */
html[data-dark] {
  --background: #0a0a0a;
  --foreground: #ededed;
  --bg-secondary: #161616;
  --text-muted: #a0a0a0;
  --border-color: #262626;
  --card-background: #121212;
  --bg-rgb: 10, 10, 10;
}
```

### 2.2. Font chữ & Icon CDN
- **Font chữ:** Tải font **Outfit** từ Google Fonts (weights: 300, 400, 500, 600, 700, 800, 900) để đảm bảo phong cách thể thao, năng động của thế hệ Gen Z.
- **Icons:** Sử dụng **Tabler Icons** dạng Outline thông qua CDN:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
  ```
- **Quy tắc sử dụng icon:** Dùng thẻ `<i class="ti ti-[icon-name]"></i>`.

### 2.3. Breakpoints & Responsive
- **Desktop (1440px):** Giao diện lưới 3 cột hiển thị đầy đủ menu, thanh tìm kiếm và các biểu tượng ở Header.
- **Mobile (375px):**
  - **Header:** Ẩn menu điều hướng chính, ẩn thanh tìm kiếm. Kích hoạt menu trượt (Mobile Menu Drawer) bằng nút Hamburger (`ti-menu-2`).
  - **Hero:** Chuyển sang 1 cột dọc (Ẩn ảnh minh họa để tăng độ thoáng cho text kêu gọi hành động).
  - **Product Grid:** Tự động co giãn về **2 cột** giúp dễ vuốt chạm và hiển thị giày to rõ ràng trên di động.
  - **Value Proposition & Footer:** Xếp chồng dọc (1 cột).

---

## 3. Đặc tả Tương tác Client-Side (`app.js`)

Chúng ta sẽ triển khai các chức năng tương tác động bằng JavaScript thuần (ES6+):

1.  **Light/Dark Mode Toggle:**
    *   Lắng nghe sự kiện click trên nút Moon/Sun icon ở Header.
    *   Khi bật chế độ tối: Thêm thuộc tính `data-dark="true"` vào phần tử `<html>`, đổi icon sang hình mặt trời và lưu trạng thái `theme: dark` vào `localStorage`.
    *   Khi tắt: Xóa thuộc tính `data-dark` khỏi `<html>`, đổi icon sang hình mặt trăng và lưu `theme: light` vào `localStorage`.
2.  **Hệ thống Danh sách Yêu thích (Wishlist):**
    *   Quản lý danh sách ID sản phẩm được yêu thích bằng một mảng `wishlist`.
    *   Khi click vào icon Trái tim trên Product Card: Thêm hoặc xóa ID đó khỏi mảng, đổi màu trái tim sang màu đỏ đậm (`text-red-500` / `ti-heart-filled`) và cập nhật số lượng badge nhấp nháy trên Header theo thời gian thực.
3.  **Thêm Giỏ Hàng & Toast Notification:**
    *   Lắng nghe sự kiện click vào nút `+` trên Product Card.
    *   Tăng số lượng giỏ hàng hiển thị ở badge trên Header.
    *   Hiển thị một thông báo nổi (Toast Notification) ở góc dưới bên phải màn hình: *"Đã thêm [Tên giày] vào giỏ hàng! 🛒"*, tự động ẩn sau 3 giây.
4.  **Bộ lọc Sản phẩm (Product Filtering):**
    *   Lắng nghe sự kiện click trên các pill lọc danh mục (Tất cả, Lifestyle, Running, Basketball).
    *   Duyệt qua danh sách các Product Card và ẩn/hiển thị dựa trên thuộc tính `data-category` của thẻ.
5.  **Menu Mobile (Drawer):**
    *   Bật/tắt thanh Menu trượt (Mobile Menu Drawer) khi nhấn nút Hamburger trên di động.

---

## 4. Dữ liệu Sản phẩm mẫu (Mock Data)

Tích hợp trực tiếp 6 sản phẩm mẫu chất lượng cao từ Unsplash (`?w=480&q=80`):
1.  **Air Max 270 React** (Nike) - 3,490,000₫ (Bestseller) - Ảnh: `photo-1542291026-7eec264c27ff` - Thể loại: *Lifestyle*
2.  **Ultraboost 23** (Adidas) - 4,150,000₫ (New Drop) - Ảnh: `photo-1587563871167-1ee9c731aefb` - Thể loại: *Running*
3.  **Air Jordan 1 High OG** (Jordan) - 5,800,000₫ (Hot) - Ảnh: `photo-1600185365483-26d7a4cc7519` - Thể loại: *Basketball*
4.  **RS-X Bold** (Puma) - 2,290,000₫ (-18%) - Ảnh: `photo-1608231387042-66d1773070a5` - Thể loại: *Lifestyle*
5.  **990v6 Made in USA** (New Balance) - 6,200,000₫ (Limited) - Ảnh: `photo-1539185441755-769473a23570` - Thể loại: *Lifestyle*
6.  **Chuck 70 Hi** (Converse) - 1,890,000₫ (Classic) - Ảnh: `photo-1514989940723-e8e51635b782` - Thể loại: *Lifestyle*

---

## 5. Kế hoạch Kiểm thử & Xác minh

- **Xác minh hiển thị:** Mở trực tiếp file `index.html` trên trình duyệt Chrome/Edge/Firefox để kiểm tra độ tương thích.
- **Xác minh Responsive:** Sử dụng công cụ DevTools của Chrome, chuyển sang kích thước 375px (iPhone) để xác minh cấu trúc 2 cột của Product Grid và hoạt động của Hamburger Menu.
- **Xác minh Tương tác:**
  - Nhấp vào nút Dark mode để kiểm tra toàn bộ màu nền, chữ, viền, thẻ có chuyển đổi và lưu trạng thái khi F5 không.
  - Nhấp vào wishlist và nút giỏ hàng để xác nhận các badge cập nhật số lượng và Toast hiển thị đúng nội dung.
