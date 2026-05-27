# Tài liệu Yêu cầu Dự án OmniShoe

## 1. Tổng quan dự án
- **Tên dự án:** OmniShoe
- **Mục tiêu:** Xây dựng một website cửa hàng bán giày trực tuyến hiện đại, giao diện cao cấp và trải nghiệm mượt mà.
- **Đối tượng khách hàng:** Người yêu thích giày thể thao, thời trang trẻ trung.

## 2. Công nghệ sử dụng (Tech Stack)
- **Cơ cấu thư mục:** Chia làm 2 phần độc lập: `/frontend` và `/backend`
- **Frontend:** React / Next.js
- **Styling:** Tailwind CSS (cho phong cách hiện đại, responsive nhanh)
- **Backend:** Node.js (Express) (sẽ phát triển sau)
- **Database:** PostgreSQL (sẽ phát triển sau)
- **Mục tiêu hiện tại:** Tập trung xây dựng UI Mockup / Frontend trước để hoàn thiện giao diện và trải nghiệm người dùng (UX).

## 3. Danh sách tính năng cốt lõi (Core Features)
### Giai đoạn 1: MVP (Sản phẩm tối thiểu & Mockup UI)
- [x] Trang chủ giới thiệu sản phẩm nổi bật, banner động (Đã hoàn thành).
- [ ] Trang danh sách sản phẩm (có bộ lọc theo hãng, giá, size).
- [ ] Trang chi tiết sản phẩm (chọn size, màu, thêm vào giỏ, xem ảnh chi tiết).
- [x] Giỏ hàng cơ bản (tính tổng tiền, giao diện đẹp) (Đã mockup badge & toast).

### Giai đoạn 2: Nâng cao & Kết nối Backend (Tính sau)
- [ ] Đăng nhập/Đăng ký tài khoản.
- [ ] Thanh toán online qua cổng thanh toán giả lập.
- [ ] Dashboard Admin quản lý giày (CRUD sản phẩm, thống kê).

## 4. Phong cách thiết kế & Giao diện (UI/UX)
- **Đối tượng hướng đến:** Gen Z (18–28 tuổi) quan tâm đến văn hóa sneaker tại Việt Nam.
- **Tông màu chủ đạo:** Trắng/Đen tối giản làm nền (`#ffffff` / `#0a0a0a`), kết hợp màu accent cam neon (`#FF5722`) cho các nút bấm CTA, badge, giá và các chi tiết nhấn mạnh.
- **Phong cách:** Hiện đại, tối giản giống Apple/Nike. Header sử dụng hiệu ứng glassmorphism (backdrop-filter blur). Tận dụng tối đa khoảng trắng (whitespace) và typography sắc nét.
- **Font chữ:** Outfit (Sans-serif hiện đại, trẻ trung).
- **Responsive:** Tối ưu hóa trên Desktop (1440px) và Mobile (375px) - ẩn bớt các cấu trúc phức tạp trên Mobile, thu gọn lưới sản phẩm về 2 cột.

## 5. Đặc tả chi tiết giao diện Trang chủ (Homepage UI Spec)
*Dưới đây là chi tiết các thành phần giao diện đã được triển khai:*

### 5.1. Header (Sticky & Glassmorphism)
- **Logo:** `OMNI` (chữ thường) + `SHOE` (chữ hoa màu cam accent).
- **Menu:** Nam / Nữ / Thương hiệu / Sale / Xu hướng.
- **Tính năng:** Thanh tìm kiếm bo tròn tự co giãn, biểu tượng Yêu thích & Giỏ hàng có huy hiệu (badge) số lượng cập nhật động, nút chuyển đổi Light/Dark mode.

### 5.2. Hero Section (Layout 2 cột)
- **Cột trái:** Badge "Drop mới" hoạt họa nhấp nháy, headline cực lớn cao 40px+, subtext ngắn gọn phong cách Gen Z, 2 nút bấm CTA (Mua ngay & Xem xu hướng), và thanh thống kê số liệu (12K+ sản phẩm, 15+ thương hiệu, 50K+ khách hàng).
- **Cột phải:** Ảnh giày Nike Air Max xoay nghiêng `-4deg` với bóng đổ cam mờ phía sau, nhãn giá bay lơ lửng "Giá từ 1,890,000₫".

### 5.3. Featured Brands (7 Thương hiệu đối tác)
- Nike, Adidas, Jordan, Puma, New Balance, Converse, Vans hiển thị dạng pill.
- Hiệu ứng: Mặc định grayscale mờ, hover chuyển sang màu cam accent và nhấc nhẹ lên (`translateY`).

### 5.4. Product Grid (Bộ lọc & Lưới sản phẩm)
- **Filter Pills:** Tất cả / Lifestyle / Running / Basketball.
- **Lưới sản phẩm:** 3 cột (desktop) / 2 cột (mobile) với 6 sản phẩm mẫu chất lượng từ Unsplash.
- **Thẻ sản phẩm (Product Card):**
  - Badge góc trái (Bestseller, New Drop, Hot, Limited, Classic, -18%).
  - Nút Yêu thích (Trái tim) ở góc phải đổi màu đỏ và cập nhật số lượng khi click.
  - Ảnh giày tự động zoom 1.07x và nâng card lên khi hover.
  - Nút thêm vào giỏ hàng nhanh hình tròn màu đen quay góc 90 độ khi di chuột, hiển thị Toast thông báo khi click.

### 5.5. Value Proposition (3 giá trị cốt lõi)
- Giao hàng miễn phí / Đổi trả 30 ngày / Hàng chính hãng 100% kèm icon bo tròn màu cam nhạt, hover đổi viền cam tinh tế.

### 5.6. Footer (4 cột chuyên nghiệp)
- Cột giới thiệu thương hiệu và 4 mạng xã hội phổ biến (Instagram, TikTok, Facebook, YouTube).
- Cột liên kết mua sắm, hỗ trợ khách hàng, địa chỉ/hotline cửa hàng, và dòng bản quyền dưới đáy.


