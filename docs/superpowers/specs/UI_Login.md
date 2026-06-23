# Phân tích và Ý tưởng Thiết kế Trang Login OMNISHOE

## 1. Phân tích hiện tại
- **Bố cục:** Chia đôi màn hình truyền thống (Trái: Form, Phải: Hình ảnh).
- **Màu sắc:** Nền tối (Dark mode) với điểm nhấn màu cam.
- **Form:** Thiết kế dạng card trắng đè lên nền tối, bo góc khá lớn.
- **Ưu điểm:** Rõ ràng, dễ sử dụng, hình ảnh sneaker nổi bật.
- **Nhược điểm:** Cảm giác hơi "cũ", thiếu sự mượt mà và tính tương tác hiện đại. Card trắng quá tương phản với nền tối gây cảm giác tách biệt mạnh.

## 2. Ý tưởng nâng cấp hiện đại (2024-2026)

### A. Phong cách Glassmorphism (Kính mờ)
- Thay thế card trắng đặc bằng hiệu ứng **Glassmorphism**. Card login sẽ có nền trong suốt mờ (backdrop-filter: blur), giúp nó hòa quyện hơn với nền phía sau nhưng vẫn đủ tách biệt để đọc nội dung.
- Sử dụng viền mỏng (border) màu trắng cực nhẹ để tạo độ sâu.

### B. Tương tác và Chuyển động (Motion Design)
- **Parallax Effect:** Khi di chuột, hình ảnh sneaker và các tia sáng nền sẽ chuyển động nhẹ theo các hướng khác nhau tạo độ sâu 3D.
- **Floating Sneaker:** Giày sneaker không đứng yên mà "bay" nhẹ nhàng (floating animation).
- **Input Animation:** Khi focus vào ô nhập liệu, viền sẽ có hiệu ứng ánh sáng chạy dọc (glow effect).

### C. Bố cục Bento Grid hoặc Tối giản
- Có thể thử nghiệm bố cục **Bento Grid** cho phần đăng nhập mạng xã hội hoặc các thông tin bổ sung bên dưới.
- Hoặc tối giản hóa form hơn nữa bằng cách bỏ bớt các đường kẻ không cần thiết, tập trung vào typography.

### D. Typography & Hình ảnh
- Sử dụng font chữ hiện đại hơn (ví dụ: Inter, Montserrat hoặc các font Sans-serif mạnh mẽ).
- Hình ảnh sneaker nên có chất lượng cực cao, có thể là ảnh 3D render để tăng tính công nghệ.

## 3. Đề xuất bộ màu sắc (Color Palette)
- **Chủ đạo:** #0D0D0D (Deep Black)
- **Điểm nhấn:** #FF6B00 (Vibrant Orange - giữ nguyên bản sắc thương hiệu nhưng làm rực rỡ hơn)
- **Bổ trợ:** #FFFFFF (White cho text), rgba(255, 255, 255, 0.1) cho glassmorphism.
