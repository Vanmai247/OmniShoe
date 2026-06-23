# Design Spec: OMNISHOE Modern Login Redesign
Date: 2026-06-23

## 1. Overview & Goals
The goal of this redesign is to upgrade the current OMNISHOE login page (`modern_login.html`) to follow modern premium web design trends (2024-2026).
It adopts a split-screen glassmorphic design with high-quality sneaker visuals, deep 3D interactive parallax, custom glowing inputs, and a Bento Grid layout for social media logins.

---

## 2. Detailed UI Specifications

### 2.1 Cột Trái: Form Đăng nhập & Bento Grid
*   **Thẻ Kính mờ (Glassmorphism Card):**
    *   Nền: `rgba(13, 13, 13, 0.4)`
    *   Bộ lọc nền: `backdrop-filter: blur(24px)`
    *   Viền: `1px solid rgba(255, 255, 255, 0.08)`
    *   Bóng đổ: `box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8)`
*   **Bento Grid Đăng nhập MXH:**
    *   **Ô Google:** Chiếm 2/3 chiều rộng, có logo Google và chữ "Tiếp tục với Google".
    *   **Ô Apple:** Chiếm 1/6 chiều rộng, chỉ có icon Apple.
    *   **Ô Facebook:** Chiếm 1/6 chiều rộng, chỉ có icon Facebook.
    *   *Hover Effect:* Làm sáng nền nhẹ và di chuyển lên 2px với độ trễ chuyển động.
*   **Hiệu ứng viền sáng chạy dọc (Input Border Glow):**
    *   Các ô Email/Password có hiệu ứng focus đặc biệt. Khi focus, một đường viền gradient màu cam thương hiệu (`#FF6B00` -> `#FF8C00`) chạy dọc bao quanh viền của ô input bằng cách dùng SVG path động hoặc CSS background-clip.

### 2.2 Cột Phải: Trình diễn Sneaker & Hiệu ứng Parallax 3D
*   **Floating Sneaker:**
    *   Hình ảnh Sneaker trôi nổi nhẹ nhàng bằng CSS `@keyframes float` (trượt dọc `15px`, xoay nhẹ `-3deg` đến `3deg`, thời gian `6s` lặp vô tận).
*   **Tương tác Parallax 3D bằng Vanilla JS:**
    *   Lắng nghe sự kiện `mousemove` trên thẻ container chính.
    *   Tính toán tọa độ chuột so với tâm màn hình.
    *   Dịch chuyển các phần tử theo tỷ lệ để tạo cảm giác 3D:
        *   **Ảnh Sneaker:** Di chuyển cùng hướng chuột (`X: 15px`, `Y: 15px`) với gia tốc mượt.
        *   **Quầng sáng nền & Tia sáng:** Di chuyển cùng hướng chuột (`X: 25px`, `Y: 25px`) với cường độ lớn hơn để mô phỏng ánh sáng thay đổi.
        *   **Slogan & Tiêu đề:** Di chuyển ngược hướng chuột (`X: -10px`, `Y: -10px`) để tạo độ sâu thị giác.

---

## 3. Tech Stack & Integration
*   **HTML & CSS:** Vanilla HTML5, CSS3, Tailwind CSS (via CDN).
*   **Icons & Fonts:** FontAwesome (v6), Google Fonts (Inter).
*   **JavaScript:** Vanilla Javascript (không cần thư viện ngoài để tối ưu hiệu suất tải trang).
*   **File đích:** `c:\OmniShoe\modern_login.html`.

---

## 4. Verification Plan
*   **Giao diện:** Kiểm tra hiển thị tốt trên máy tính (Desktop) và di động (Mobile - ẩn cột phải, hiển thị cột trái căn giữa).
*   **Tương tác:** Di chuyển chuột trên màn hình để kiểm tra chuyển động Parallax mượt mà, không bị giật lag.
*   **Trạng thái Focus:** Bấm vào các ô nhập liệu kiểm tra hiệu ứng viền sáng chạy dọc.
