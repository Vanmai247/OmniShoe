markdown_content = """# Gợi ý Thiết kế Giao diện OmniShoe CMS (Tông màu Sáng - Light Mode)

Tài liệu này tổng hợp giải pháp chuyển đổi giao diện từ tông tối hiện tại sang **tông màu sáng (Light Mode)** cho trang quản trị Admin của OmniShoe. Mục tiêu là đảm bảo tính **sạch sẽ, rõ ràng, dễ đọc** khi làm việc trong thời gian dài, nhưng vẫn giữ được chất thể thao, năng động và độ nhận diện của thương hiệu sneaker.

---

## 1. Bảng màu chủ đạo mới (Color Palette)

Để không làm mất đi nhận diện đặc trưng của OmniShoe, hệ thống sẽ giữ lại màu cam làm màu nhấn (Accent color) và thay đổi toàn bộ hệ thống màu nền, màu chữ.

| Thành phần | Mã màu gợi ý | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Nền chính (Main Background)** | `#F4F6F9` hoặc `#F8F9FA` | Màu xám siêu nhẹ, giúp mắt không bị mỏi so với màu trắng tinh `#FFFFFF`. |
| **Nền các thẻ (Card Background)** | `#FFFFFF` | Trắng tinh khôi để tạo độ nổi bật trên nền xám nhẹ. |
| **Màu chữ chính (Primary Text)** | `#1A1D20` hoặc `#212529` | Đen xám (tránh dùng đen tuyền `#000000` giúp chữ nhìn mượt và dễ chịu hơn). |
| **Màu chữ phụ (Secondary Text)** | `#6C757D` | Xám cho các thông tin phụ như ID, danh mục, thương hiệu, sub-title. |
| **Màu nhấn (Accent/Brand Color)** | `#FF6B00` (hoặc giữ nguyên mã cam hiện tại) | Màu Cam Cháy/Cam Thể Thao để làm nổi bật các nút quan trọng và trạng thái active. |
| **Nền Banner (Banner Light)** | `#FFF0E6` | Màu cam pastel nhẹ dùng làm nền cho khối chào mừng. |

---

## 2. Chi tiết thay đổi cho từng khu vực

### 🧭 2.1. Thanh Menu bên trái (Sidebar)
Bạn có thể lựa chọn 1 trong 2 phong cách phối dưới đây tùy thuộc vào trải nghiệm mong muốn:
* **Phương án 1 (Hiện đại, tối giản hoàn toàn):** Đổi sang nền `#FFFFFF` (Trắng). Các icon và chữ đổi thành màu xám đậm `#495057`. Khi mục nào được chọn (như "Tổng quan"), mục đó sẽ chuyển sang nền cam chữ trắng. Giữa sidebar và nội dung chính phân cách bằng đường kẻ dọc mảnh màu `#E9ECEF`.
* **Phương án 2 (Tương phản mạnh - Semi-Light):** Giữ nguyên Sidebar màu tối như hiện tại để tạo chiều sâu và cảm giác cá tính, chỉ chuyển toàn bộ vùng nội dung bên phải sang màu sáng. Đây là xu hướng thiết kế dashboard rất được ưa chuộng.

### 🎛️ 2.2. Khối Banner chào mừng ("CHÀO MỪNG TRỞ LẠI, ADMIN!")
* **Nền Banner:** Thay vì màu nâu đen hiện tại, chuyển sang màu cam nhạt pastel (`#FFF0E6`) hoặc hiệu ứng gradient chuyển nhẹ từ trắng sang cam pastel.
* **Hệ thống chữ:** Dòng chữ phụ đổi thành màu xám đậm, riêng từ khóa `"ADMIN!"` giữ màu cam thương hiệu đậm để tạo điểm nhấn thị giác.
* **Icon giày ẩn phía sau:** Đổi từ màu nâu tối sang màu cam gradient cực kỳ mờ (opacity tầm 5% - 8%) để tạo chiều sâu tinh tế.

### 📊 2.3. Các thẻ chỉ số (Sản phẩm, Thương hiệu, Đánh giá...)
* **Nền Card:** Đổi toàn bộ thành trắng tinh (`#FFFFFF`).
* **Đường viền & Đổ bóng:** Sử dụng đường viền siêu mảnh `border: 1px solid #E9ECEF` kết hợp đổ bóng mờ (box-shadow) để các thẻ nổi lên một cách mềm mại: