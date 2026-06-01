# Đặc tả Thiết kế Kỹ thuật Trang Chi tiết Sản phẩm OmniShoe (Hybrid Server/Client)

Tài liệu này định nghĩa chi tiết kiến trúc tệp tin, luồng dữ liệu, quản lý trạng thái và giao diện tương tác động (UI/UX) để xây dựng trang chi tiết sản phẩm tại đường dẫn `/products/[id]` trên nền tảng Next.js (App Router, Tailwind CSS, TypeScript, Framer Motion) của dự án **OmniShoe**.

---

## 1. Kiến trúc Cấu trúc Tệp tin (File Architecture)

Chúng ta sẽ tích hợp các tệp tin mới và chỉnh sửa các thành phần hiện tại theo mô hình Hybrid (Server Component làm khung tĩnh phục vụ SEO, Client Component con phục vụ tương tác động):

*   **`[NEW] frontend/src/context/AppContext.tsx`**: Khai báo `AppContext` và `AppProvider` để quản lý trạng thái giỏ hàng (`cart`) và danh sách yêu thích (`wishlist`) toàn cục.
*   **`[MODIFY] frontend/src/app/layout.tsx`**: Nhúng `AppProvider` bao bọc phần `children` để chia sẻ trạng thái cho toàn hệ thống.
*   **`[MODIFY] frontend/src/app/page.tsx`**: Chuyển đổi state giỏ hàng/yêu thích cục bộ sang sử dụng context tập trung qua hook `useAppContext()`.
*   **`[NEW] frontend/src/app/products/[id]/page.tsx`**: Dynamic Route (Server Component) quản lý SEO Metadata, sinh JSON-LD cấu trúc và dựng bố cục chia lưới (Grid).
*   **`[NEW] frontend/src/components/ProductGallery.tsx`**: Client Component quản lý ảnh chính, ảnh xem trước thu nhỏ (thumbnails), hiệu ứng zoom kính lúp và lightbox toàn màn hình.
*   **`[NEW] frontend/src/components/ProductInfo.tsx`**: Client Component quản lý khối thông tin mua hàng (chọn size, chọn số lượng, nút mua ngay, nút thêm giỏ hàng có animation, nút yêu thích tim đập).
*   **`[NEW] frontend/src/components/ProductTabs.tsx`**: Client Component hiển thị các tab thông tin chi tiết (Mô tả, Thông số kỹ thuật chất liệu, Đánh giá từ Sneakerhead) với hiệu ứng chuyển động mượt mà.
*   **`[NEW] frontend/src/components/RelatedProducts.tsx`**: Client Component hiển thị danh sách 3-4 đôi sneaker liên quan để tối ưu SEO nội bộ và tăng giá trị giỏ hàng.

---

## 2. Quản lý Trạng thái Toàn cục (Global State Management)

### 2.1. Cấu trúc Dữ liệu Context (`AppContext.tsx`)
```typescript
interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  photoId: string;
  selectedSize: number;
  quantity: number;
  glowColor: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: any, size: number, quantity: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  toggleWishlist: (productId: number) => void;
  toast: { show: boolean; message: string };
  showToast: (msg: string) => void;
}
```

### 2.2. Đồng bộ hóa với LocalStorage
Tự động khôi phục trạng thái `cart` và `wishlist` từ `localStorage` khi ứng dụng mount trên Client (sử dụng hiệu quả `useEffect` để tránh lỗi HydrationMismatch của Next.js).

---

## 3. Thiết lập Server Component & SEO Động (`app/products/[id]/page.tsx`)

### 3.1. Tạo Metadata Động (Tối ưu SEO)
```typescript
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const productId = parseInt(params.id);
  const product = mockProducts.find(p => p.id === productId);
  
  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | OmniShoe",
    };
  }
  
  return {
    title: `${product.name} — ${product.brand} | OmniShoe`,
    description: `Mua ngay ${product.name} chính hãng 100% tại OmniShoe. Hỗ trợ đổi trả 30 ngày miễn phí, cam kết đền gấp 10 lần nếu phát hiện hàng giả. Đón đầu xu hướng sneaker culture Gen Z.`,
    openGraph: {
      title: `${product.name} | OmniShoe VN`,
      description: `Khám phá phối màu cực chất của ${product.name}. Bảo hành uy tín 100% chính hãng.`,
      images: [
        {
          url: product.photoId.startsWith("/") ? product.photoId : `https://images.unsplash.com/${product.photoId}`,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ]
    }
  };
}
```

### 3.2. Sinh Dữ liệu Cấu trúc JSON-LD cho Google Search Console
Server component tự động kết xuất thẻ script chứa cấu trúc schema `Product` của Google để tối ưu khả năng hiển thị kết quả tìm kiếm nâng cao (Rich Results):
```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Court Vision Low Next Nature",
    "image": "https://images.unsplash.com/...",
    "description": "...",
    "brand": {
      "@type": "Brand",
      "name": "Nike"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": "1909000",
      "availability": "https://schema.org/InStock"
    }
  }
</script>
```

---

## 4. Thiết kế Giao diện Chi tiết & Trải nghiệm Tương tác (UI/UX)

### 4.1. Khối Thư viện Ảnh (`ProductGallery.tsx`)
*   **Danh sách ảnh góc chụp:** Gồm 4 góc chụp khác nhau (ví dụ: ảnh nghiêng, ảnh đế, ảnh chính diện, ảnh gót giày).
*   **Hiệu ứng Kính lúp (Magnifier Lens):**
    *   Sử dụng thẻ chứa ảnh chính có `relative overflow-hidden cursor-zoom-in`.
    *   Lắng nghe các sự kiện `onMouseMove`, `onMouseEnter`, `onMouseLeave` trên Client.
    *   Di chuyển một lớp ảnh thứ hai có kích thước phóng to gấp 2 lần bám sát tọa độ chuột, tạo trải nghiệm kính lúp chân thực.
*   **Lightbox overlay:** Khi click ảnh chính, hiện màn hình overlay đen bóng mờ phủ toàn trang. Sử dụng `framer-motion` cho animation phóng to từ vị trí ảnh cũ đến vị trí giữa màn hình.

### 4.2. Khối Thông tin & Mua hàng (`ProductInfo.tsx`)
*   **Size Selector:**
    *   Hiển thị danh sách size giày mẫu (`sizes: [39, 40, 41, 42, 43, 44]`).
    *   Trạng thái size đang chọn được làm nổi bật với viền dày màu cam `#FF5722` và nền sáng nhẹ.
    *   Nút **Size Guide** sẽ mở ra một chiếc Drawer trượt nhẹ nhàng từ cạnh phải màn hình hiển thị bảng hướng dẫn đo chân chuẩn xác.
*   **CTA Add To Cart:**
    *   Khi click "Thêm vào giỏ hàng", nút chuyển từ màu cam sang màu xanh lục, icon dấu cộng quay tròn rồi đổi thành hình dấu tích xanh.
    *   Bắn một luồng pháo giấy nhỏ bằng canvas nhẹ xung quanh khu vực nút để kích thích giác quan người dùng.
*   **CTA Buy Now:**
    *   Nút to bản tràn viền với hiệu ứng dải màu (gradient) chuyển động liên tục từ đỏ cam sang vàng neon. Có hiệu ứng viền phát sáng nhịp đập (pulse outline shadow) độc quyền.

### 4.3. Tabs Đặc tính kỹ thuật (`ProductTabs.tsx`)
*   Sử dụng một thanh điều hướng tab ngang gồm: `Mô tả`, `Thông số kỹ thuật`, `Đánh giá (150+)`.
*   Hiệu ứng gạch chân trượt mượt mà (chỉ báo tab active) sử dụng `<motion.div layoutId="activeTabIndicator" />`.
*   Tab Đánh giá hiển thị xếp hạng sao tổng quan và danh sách reviews chất lượng với bộ lọc (Ví dụ: xem các đánh giá 5 sao, đánh giá kèm ảnh).

---

## 5. Kế hoạch Kiểm thử & Xác minh (Verification Plan)

### 5.1. Kiểm thử Tương tác Động (Client)
*   **Đồng bộ giỏ hàng:** Thực hiện thêm sản phẩm ở Trang chi tiết `/products/1` -> Trở về trang chủ `/` kiểm tra số lượng giỏ hàng trên Header xem có cập nhật đúng không. F5 trang xem giỏ hàng có bị mất không (kiểm tra khả năng khôi phục từ localStorage).
*   **Hoạt động kính lúp:** Di chuột qua lại các vị trí rìa ảnh lớn để đảm bảo vùng kính lúp chuyển động trơn tru không bị giật lag, độ trễ phản hồi thấp dưới 16ms (60 FPS).
*   **Chọn size:** Đảm bảo size mặc định luôn được chọn trước, và khi click size mới sẽ tự động cập nhật dữ liệu khi bấm nút Add to Cart.

### 5.2. Kiểm thử Tương thích & Responsive
*   Kiểm tra giao diện trên phiên bản di động (375px):
    *   Thư viện ảnh chuyển từ cột dọc thumbnails sang dạng slider vuốt ngang (Swipeable carousel) bằng Framer Motion.
    *   Nút CTA Dock tự động chuyển sang chế độ ghim chặt ở đáy màn hình điện thoại (Sticky bottom bar) giúp người dùng dễ dàng bấm mua chỉ bằng ngón cái.
*   Xác nhận thẻ `<html>` duy trì chế độ `data-dark="true"` vĩnh viễn và màu sắc hiển thị đúng chuẩn phong cách Cyberpunk Sneaker.
