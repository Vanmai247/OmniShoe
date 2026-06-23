# PRODUCT DETAIL PAGE (PDP) - TRANG CHI TIẾT SẢN PHẨM GIÀY

## 1. Mục tiêu

Trang chi tiết sản phẩm (Product Detail Page - PDP) cung cấp đầy đủ thông tin về sản phẩm, hỗ trợ khách hàng tìm hiểu, đánh giá và thực hiện hành động mua hàng.

Hệ thống cần được thiết kế linh hoạt để hỗ trợ việc bổ sung dữ liệu sản phẩm trong tương lai, đặc biệt là hình ảnh sản phẩm.

---

# 2. Thông tin sản phẩm chính

## 2.1 Hình ảnh sản phẩm

### Mục đích

Hiển thị hình ảnh trực quan của sản phẩm.

### Trường hợp dữ liệu thực tế chưa đầy đủ

Trong giai đoạn phát triển:

* Cho phép sử dụng ảnh placeholder.
* Không phụ thuộc vào số lượng ảnh thực tế.
* Có thể bổ sung ảnh sau mà không cần sửa code.

### Quy tắc hiển thị

| Số lượng ảnh | Cách hiển thị                    |
| ------------ | -------------------------------- |
| 0 ảnh        | Hiển thị ảnh mặc định (no-image) |
| 1 ảnh        | Chỉ hiển thị ảnh chính           |
| 2 - 4 ảnh    | Hiển thị thumbnail bên dưới      |
| > 4 ảnh      | Hiển thị carousel hoặc slider    |

### Tính năng

* Xem ảnh lớn
* Zoom ảnh
* Chuyển đổi ảnh qua thumbnail
* Responsive trên mobile

### Dữ liệu đề xuất

```json
{
  "images": [
    "/images/placeholder-shoe.jpg",
    "/images/placeholder-shoe.jpg"
  ]
}
```

---

## 2.2 Thông tin cơ bản

### Bao gồm

* Tên sản phẩm
* Mã sản phẩm (SKU)
* Thương hiệu
* Danh mục
* Giá hiện tại
* Giá gốc
* Phần trăm giảm giá
* Tình trạng kho
* Số lượng còn lại

### Ví dụ

Tên sản phẩm: Nike Air Force 1

SKU: AF1-2026

Giá hiện tại: 2.790.000 VNĐ

Giá gốc: 3.290.000 VNĐ

Giảm giá: 15%

Tồn kho: 12 sản phẩm

---

# 3. Đánh giá nhanh

## Bao gồm

* Điểm đánh giá trung bình
* Tổng số đánh giá
* Tổng số lượt bán

### Ví dụ

⭐ 4.8/5

245 đánh giá

1.200 lượt mua

---

# 4. Biến thể sản phẩm

## 4.1 Màu sắc

### Chức năng

Cho phép khách hàng lựa chọn màu sắc của sản phẩm.

### Ví dụ

* White
* Black
* Blue
* Red

### Yêu cầu

* Hiển thị dạng màu sắc trực quan.
* Có thể thay đổi ảnh theo màu (nếu dữ liệu có).

---

## 4.2 Kích thước (Size)

### Ví dụ

* 38
* 39
* 40
* 41
* 42
* 43

### Yêu cầu

* Disable size hết hàng.
* Hiển thị bảng hướng dẫn chọn size.
* Hiển thị bảng quy đổi size.

---

# 5. Khu vực mua hàng

## Thành phần

### Chọn số lượng

* Tăng số lượng
* Giảm số lượng

### Hành động

* Thêm vào giỏ hàng
* Mua ngay
* Thêm vào yêu thích
* Chia sẻ sản phẩm

### Kiểm tra

* Kiểm tra tồn kho.
* Kiểm tra biến thể đã chọn.
* Hiển thị thông báo thành công hoặc lỗi.

---

# 6. Chính sách bán hàng

## Miễn phí vận chuyển

Ví dụ:

* Miễn phí giao hàng toàn quốc.

## Đổi trả

Ví dụ:

* Đổi trả trong vòng 30 ngày.

## Bảo hành

Ví dụ:

* Bảo hành keo đế 6 tháng.

## Thanh toán

Ví dụ:

* Thanh toán khi nhận hàng (COD).

---

# 7. Mô tả sản phẩm

## Thông tin mô tả

### Giới thiệu

Mô tả tổng quan về sản phẩm.

### Chất liệu

Ví dụ:

* Da tổng hợp
* Vải Mesh
* Cao su tự nhiên

### Công nghệ

Ví dụ:

* Air Cushion
* Boost
* React Foam

### Đối tượng sử dụng

* Nam
* Nữ
* Unisex

---

# 8. Thông số kỹ thuật

| Thuộc tính  | Giá trị  |
| ----------- | -------- |
| Thương hiệu | Nike     |
| Chất liệu   | Leather  |
| Giới tính   | Nam      |
| Màu sắc     | Trắng    |
| Xuất xứ     | Việt Nam |
| SKU         | AF1-2026 |
| Trọng lượng | 320g     |

---

# 9. Đánh giá sản phẩm

## Tổng quan

Hiển thị:

* Điểm đánh giá trung bình
* Biểu đồ phân bố số sao

Ví dụ:

* 5 sao: 90%
* 4 sao: 7%
* 3 sao: 2%
* 2 sao: 1%
* 1 sao: 0%

---

## Danh sách đánh giá

### Bao gồm

* Avatar
* Tên khách hàng
* Số sao
* Nội dung đánh giá
* Hình ảnh đánh giá
* Ngày đánh giá
* Nhãn "Đã mua hàng"

### Bộ lọc

* Mới nhất
* Cao nhất
* Thấp nhất
* Có hình ảnh

---

# 10. Hỏi đáp sản phẩm (Q&A)

## Chức năng

Khách hàng có thể gửi câu hỏi về sản phẩm.

### Ví dụ

Q: Giày có chống nước không?

A: Có khả năng chống nước nhẹ.

### Yêu cầu

* Tạo câu hỏi
* Trả lời câu hỏi
* Kiểm duyệt nội dung

---

# 11. Sản phẩm liên quan

## Cùng danh mục

Ví dụ:

* Nike Air Max
* Nike Revolution
* Nike Dunk

## Khách hàng cũng mua

Ví dụ:

* Tất Nike
* Dây giày
* Bộ vệ sinh giày

---

# 12. Wishlist

## Chức năng

Cho phép người dùng lưu sản phẩm yêu thích.

### Bao gồm

* Thêm vào danh sách yêu thích
* Xóa khỏi danh sách yêu thích
* Đồng bộ theo tài khoản

---

# 13. Chia sẻ sản phẩm

## Hỗ trợ

* Facebook
* Zalo
* Messenger
* Copy Link

---

# 14. SEO

## Meta Title

Tên sản phẩm | Thương hiệu

## Meta Description

Mô tả ngắn gọn về sản phẩm.

## Structured Data

* Product Schema
* Review Schema
* Breadcrumb Schema

## URL

```text
/giay/nike-air-force-1
```

---

# 15. Chức năng nâng cao

## Thông báo khi có hàng

Cho phép khách hàng nhập email nhận thông báo.

## So sánh sản phẩm

So sánh nhiều sản phẩm cùng lúc.

## Xem tồn kho tại cửa hàng

Hiển thị:

* Tên chi nhánh
* Số lượng còn

## Recently Viewed

Hiển thị danh sách sản phẩm đã xem gần đây.

---

# 16. Thiết kế dữ liệu hình ảnh

## Bảng Product Images

| Trường     | Kiểu dữ liệu |
| ---------- | ------------ |
| id         | bigint       |
| product_id | bigint       |
| image_url  | varchar      |
| sort_order | int          |
| created_at | datetime     |

### Mục đích

Cho phép:

* Một sản phẩm có nhiều ảnh.
* Thêm ảnh mới mà không cần sửa code.
* Hỗ trợ gallery, slider và zoom.

---

# 17. MVP (Phiên bản tối thiểu nên làm)

Nếu chưa có đủ dữ liệu sản phẩm:

## Bắt buộc

* 1 ảnh placeholder
* Tên sản phẩm
* Giá sản phẩm
* Chọn size
* Chọn số lượng
* Thêm giỏ hàng
* Mua ngay

## Nên có

* 5 review mẫu
* 4 sản phẩm liên quan
* Chính sách bán hàng

## Có thể bổ sung sau

* Video sản phẩm
* Ảnh 360°
* Hỏi đáp sản phẩm
* So sánh sản phẩm
* Thông báo khi có hàng

---

# 18. Wireframe

```text
---------------------------------------------------------
|                  PRODUCT DETAIL PAGE                  |
---------------------------------------------------------

|  Gallery Images  | Product Name                       |
|                  | Rating                             |
|                  | Price                              |
|                  | Color Selection                    |
|                  | Size Selection                     |
|                  | Quantity                           |
|                  | Add To Cart                        |
|                  | Buy Now                            |

---------------------------------------------------------

| Shipping Policy                                    |

---------------------------------------------------------

| Product Description                                |

---------------------------------------------------------

| Specifications                                     |

---------------------------------------------------------

| Reviews & Ratings                                  |

---------------------------------------------------------

| Questions & Answers                                |

---------------------------------------------------------

| Related Products                                   |

---------------------------------------------------------

| Recently Viewed Products                           |

---------------------------------------------------------
```
