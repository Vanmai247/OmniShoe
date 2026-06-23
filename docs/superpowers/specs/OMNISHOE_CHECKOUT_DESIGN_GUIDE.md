# Hướng dẫn thiết kế trang thanh toán OMNISHOE - Phiên bản hiện đại

## Tổng quan

Trang thanh toán mới của OMNISHOE được thiết kế lại hoàn toàn theo phong cách **Dark Mode** kết hợp **Glassmorphism**, đồng nhất với phong cách hiện đại, mạnh mẽ của trang chủ. Thiết kế này tập trung vào việc tạo ra trải nghiệm người dùng mượt mà, chuyên nghiệp và thu hút, giúp giảm tỷ lệ bỏ giỏ hàng và tăng tỷ lệ chuyển đổi.

## Các tính năng chính

### 1. Thiết kế Dark Mode với Glassmorphism

Trang thanh toán sử dụng nền tối (Dark Mode) với các thành phần có hiệu ứng Glassmorphism (kính mờ). Điều này tạo ra cảm giác hiện đại, cao cấp và phù hợp với xu hướng thiết kế 2024-2025.

**Bảng màu chính:**
- Nền chính: `#0f0f0f` (đen sâu)
- Nền phụ: `#1a1a1a` (đen nhạt hơn)
- Màu cam chủ đạo: `#FF8C00` (nút CTA, tiêu đề)
- Màu xanh lá cây: `#00d084` (các yếu tố tích cực)
- Màu xanh dương: `#00a8ff` (các yếu tố thông tin)
- Chữ sáng: `#e0e0e0` (chữ chính)
- Chữ mờ: `#a0a0a0` (chữ phụ)

### 2. Bố cục 2 cột (Desktop) / 1 cột (Mobile)

**Desktop:**
- **Cột trái**: Chứa các form nhập liệu (thông tin nhận hàng, phương thức vận chuyển, thanh toán)
- **Cột phải**: Tóm tắt đơn hàng (Order Summary) cố định khi cuộn trang

**Mobile:**
- Bố cục chuyển sang 1 cột, tóm tắt đơn hàng nằm trên cùng hoặc dưới cùng

### 3. Thanh tiến trình (Progress Bar)

Thanh tiến trình hiển thị 3 bước:
1. **Giỏ hàng** (✓ Hoàn tất)
2. **Thông tin** (✓ Hoàn tất)
3. **Thanh toán** (● Đang thực hiện)

Các bước hoàn tất sẽ hiển thị dấu tích (✓) màu xanh lá cây, bước hiện tại sẽ có vòng tròn màu cam với hiệu ứng phát sáng.

### 4. Các phần (Sections)

Trang thanh toán được chia thành 3 phần chính:

#### Phần 1: Thông tin nhận hàng
- Họ và tên
- Số điện thoại
- Email
- Địa chỉ giao hàng
- Thành phố / Quận huyện
- Ghi chú đơn hàng (tùy chọn)

#### Phần 2: Phương thức vận chuyển
- Giao hàng tiêu chuẩn (1-3 ngày, 20.000₫)
- Giao hàng hỏa tốc (Hôm nay, 50.000₫)

Mỗi tùy chọn hiển thị ngày giao hàng dự kiến cụ thể, không chỉ "tốc độ giao hàng".

#### Phần 3: Phương thức thanh toán
- Thanh toán khi nhận hàng (COD)
- Chuyển khoản ngân hàng (QR Code)
- Ví điện tử / Cổng thanh toán (MoMo, VNPay)

### 5. Tóm tắt đơn hàng (Order Summary)

Hiển thị:
- Danh sách sản phẩm với hình ảnh, tên, size, số lượng
- Tạm tính
- Phí vận chuyển
- Giảm giá
- **Tổng cộng** (nổi bật với màu cam)

Cột này cố định khi cuộn trên desktop, giúp khách hàng luôn thấy thông tin đơn hàng.

### 6. Nút hành động (Call-to-Action)

- **Nút chính (Xác nhận đặt hàng)**: Gradient cam, có hiệu ứng hover (nâng lên), có shadow phát sáng
- **Nút phụ (Quay lại)**: Viền mỏng, nền trong suốt, chuyển sang cam khi hover

### 7. Yếu tố tạo sự tin cậy (Trust Signals)

Hiển thị các biểu tượng và text:
- 🔒 Thanh toán an toàn (SSL)
- ✓ Được bảo vệ bởi OMNISHOE
- ↩️ Đổi trả 30 ngày

## Các hiệu ứng và tương tác

### Hiệu ứng Hover

- **Form input**: Khi focus, viền chuyển sang cam, background sáng hơn, có shadow cam mờ
- **Nút**: Nâng lên 2px, shadow tăng
- **Option item**: Background chuyển sang cam mờ, viền chuyển sang cam

### Hiệu ứng Backdrop Filter

Tất cả các card chính sử dụng `backdrop-filter: blur(20px)` để tạo hiệu ứng kính mờ, kết hợp với `background: rgba(255, 255, 255, 0.05)` để tạo độ trong suốt.

### Hiệu ứng Animation

- **Slide In**: Các card chính sẽ có hiệu ứng trượt vào từ dưới lên khi trang load, với độ trễ (delay) tăng dần

### Transition

Tất cả các thay đổi trạng thái (hover, focus, active) sử dụng `transition: all 0.3s ease` để tạo sự mượt mà.

## Responsive Design

### Breakpoint chính: 768px

Dưới 768px (mobile):
- Bố cục chuyển sang 1 cột
- Form row chuyển sang 1 cột
- Order Summary không cố định, nằm ở vị trí bình thường
- Header có thể bị thu gọn

### Điều chỉnh cho tablet (768px - 1024px)

- Có thể duy trì bố cục 2 cột nhưng với khoảng cách nhỏ hơn
- Font size có thể nhỏ hơn một chút

## Hướng dẫn sử dụng file HTML

File `omnishoe_checkout_modern.html` là một file HTML độc lập, chứa toàn bộ CSS và JavaScript cần thiết. Bạn có thể:

1. **Mở trực tiếp trong trình duyệt**: Chỉ cần double-click file hoặc kéo vào trình duyệt
2. **Sử dụng làm tham khảo**: Copy các phần CSS/HTML vào dự án của bạn
3. **Tích hợp vào framework**: Chuyển đổi thành React, Vue, hoặc Angular component

## Hướng dẫn tích hợp vào dự án React/Tailwind

Nếu bạn đang sử dụng React + Tailwind CSS, có thể tạo component `CheckoutPage.jsx` như sau:

```jsx
import React, { useState } from 'react';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    note: '',
    shipping: 'standard',
    payment: 'cod'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    alert('Đơn hàng của bạn đã được xác nhận!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-[#e0e0e0]">
      {/* Header */}
      <header className="sticky top-0 z-100 bg-black/80 backdrop-blur-md border-b border-[rgba(255,140,0,0.2)] px-8 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-[#FF8C00]">◆ OMNISHOE</a>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#a0a0a0]">Bước 3 / 3: Thanh toán</span>
          <button className="px-4 py-2 border border-[rgba(255,140,0,0.2)] rounded-lg hover:bg-white/5 hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all">
            ← Quay lại giỏ hàng
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#2a2a2a] z-0"></div>
          
          {[
            { label: 'Giỏ hàng', completed: true },
            { label: 'Thông tin', completed: true },
            { label: 'Thanh toán', completed: false }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                step.completed 
                  ? 'bg-[#00d084] border-[#00d084] text-white' 
                  : 'bg-[#FF8C00] border-[#FF8C00] text-white shadow-lg shadow-[rgba(255,140,0,0.5)]'
              } border-2`}>
                {step.completed ? '✓' : idx + 1}
              </div>
              <span className="text-xs uppercase tracking-wider text-[#a0a0a0]">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-[rgba(255,140,0,0.2)] transition-all">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[rgba(255,140,0,0.2)]">
                <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold">1</div>
                <h3 className="text-lg font-bold uppercase tracking-wider">Thông tin nhận hàng</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Họ và tên *</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Địa chỉ giao hàng *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập số nhà, tên đường..."
                    className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Thành phố *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                    >
                      <option>Chọn thành phố</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Quận/Huyện *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                    >
                      <option>Chọn quận/huyện</option>
                      <option>Quận 1</option>
                      <option>Quận 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">Ghi chú đơn hàng</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] placeholder-[#a0a0a0] focus:outline-none focus:bg-white/10 focus:border-[#FF8C00] focus:shadow-lg focus:shadow-[rgba(255,140,0,0.2)] transition-all"
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Section 2 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-[rgba(255,140,0,0.2)] transition-all">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[rgba(255,140,0,0.2)]">
                <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold">2</div>
                <h3 className="text-lg font-bold uppercase tracking-wider">Phương thức vận chuyển</h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'standard', label: '🚚 Giao hàng tiêu chuẩn', desc: 'Dự kiến giao vào Thứ Tư, 26/06/2024 (1-3 ngày)', price: '20.000₫' },
                  { id: 'express', label: '⚡ Giao hàng hỏa tốc (FAST)', desc: 'Dự kiến giao vào Thứ Ba, 25/06/2024 (Hôm nay)', price: '50.000₫' }
                ].map(option => (
                  <label key={option.id} className="flex items-start gap-4 p-4 bg-white/3 border border-[rgba(255,140,0,0.2)] rounded-lg cursor-pointer hover:bg-[rgba(255,140,0,0.1)] hover:border-[#FF8C00] transition-all">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={formData.shipping === option.id}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-bold">{option.label}</div>
                      <div className="text-sm text-[#a0a0a0]">{option.desc}</div>
                    </div>
                    <div className="font-bold text-[#FF8C00]">{option.price}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-[rgba(255,140,0,0.2)] transition-all">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[rgba(255,140,0,0.2)]">
                <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold">3</div>
                <h3 className="text-lg font-bold uppercase tracking-wider">Phương thức thanh toán</h3>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { id: 'cod', label: '💵 Thanh toán khi nhận hàng (COD)', desc: 'Nhận hàng, kiểm tra rồi thanh toán cho nhân viên giao hàng' },
                  { id: 'qr', label: '📱 Chuyển khoản ngân hàng (QR Code)', desc: 'Hỗ trợ tất cả ngân hàng, thanh toán tức thì qua ứng dụng' },
                  { id: 'ewallet', label: '💳 Ví điện tử / Cổng thanh toán (Momo, VNPay)', desc: 'Thanh toán an toàn qua các ứng dụng ví điện tử phổ biến' }
                ].map(option => (
                  <label key={option.id} className="flex items-start gap-4 p-4 bg-white/3 border border-[rgba(255,140,0,0.2)] rounded-lg cursor-pointer hover:bg-[rgba(255,140,0,0.1)] hover:border-[#FF8C00] transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={formData.payment === option.id}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-bold">{option.label}</div>
                      <div className="text-sm text-[#a0a0a0]">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 text-xs text-[#a0a0a0] pt-4 border-t border-[rgba(255,140,0,0.2)] flex-wrap">
                <div>🔒 Thanh toán an toàn (SSL)</div>
                <div>✓ Được bảo vệ bởi OMNISHOE</div>
                <div>↩️ Đổi trả 30 ngày</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-6 py-3 border border-[rgba(255,140,0,0.2)] rounded-lg text-[#e0e0e0] font-bold uppercase tracking-wider hover:bg-white/5 hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all">
                ← Quay lại
              </button>
              <button onClick={handleSubmit} className="px-6 py-3 bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[rgba(255,140,0,0.3)] hover:shadow-[rgba(255,140,0,0.5)] hover:-translate-y-0.5 transition-all">
                ✓ Xác nhận đặt hàng
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sticky top-24 h-fit">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-4 border-b border-[rgba(255,140,0,0.2)]">📦 Đơn hàng của bạn</h3>

              <div className="space-y-4 mb-6">
                {[
                  { name: 'Nike Air Jordan 1', size: '41', qty: 1, price: '8.990.000₫' },
                  { name: 'Converse Chuck Taylor', size: '41', qty: 1, price: '2.490.000₫' }
                ].map((product, idx) => (
                  <div key={idx} className="flex gap-3 pb-4 border-b border-[rgba(255,140,0,0.2)]">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg flex items-center justify-center text-3xl flex-shrink-0">👟</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{product.name}</div>
                      <div className="text-xs text-[#a0a0a0]">Size: {product.size} | Số lượng: {product.qty}</div>
                      <div className="text-[#FF8C00] font-bold mt-1">{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>11.480.000₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>20.000₫</span>
                </div>
                <div className="flex justify-between text-[#00d084]">
                  <span>Giảm giá:</span>
                  <span>-108.000₫</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#FF8C00] pt-4 border-t border-[rgba(255,140,0,0.2)]">
                  <span>Tổng cộng:</span>
                  <span>11.392.000₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Tối ưu hóa SEO và Performance

- Sử dụng semantic HTML
- Lazy loading cho hình ảnh
- Minify CSS/JavaScript
- Sử dụng CDN cho các tài nguyên tĩnh
- Tối ưu hóa font loading

## Bảo mật

- Validate dữ liệu form trên cả client và server
- Sử dụng HTTPS
- Implement CSRF protection
- Sanitize user input
- Sử dụng secure payment gateway

## Kết luận

Thiết kế trang thanh toán mới của OMNISHOE kết hợp các xu hướng hiện đại (Dark Mode, Glassmorphism) với các nguyên tắc UX tốt nhất, tạo ra một trải nghiệm mua sắm chuyên nghiệp, thu hút và đáng tin cậy. Thiết kế này sẽ giúp tăng tỷ lệ chuyển đổi và giảm tỷ lệ bỏ giỏ hàng đáng kể.
