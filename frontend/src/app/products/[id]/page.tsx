import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";

// Shared mock database matching frontend/src/app/page.tsx
const mockProducts = [
  {
    id: 1,
    name: "Court Vision Low Next Nature",
    brand: "Nike",
    price: "1,909,000₫",
    rating: 4.8,
    reviews: 120,
    badge: "Hot",
    photoId: "/Nike_4-removebg-preview.png",
    category: "Lifestyle",
    glowColor: "rgba(255, 255, 255, 0.45)",
    sizes: [39, 40, 41, 42, 43],
    description: "Hòa quyện giữa nét cổ điển thập niên 80 và nhịp sống hiện đại. Phối màu thanh lịch mang tính biểu tượng.",
    materials: "Da tổng hợp tái chế, Đế cao su chống trượt",
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
    glowColor: "rgba(0, 150, 255, 0.45)",
    sizes: [40, 41, 42, 43, 44],
    description: "Công nghệ đế Boost êm ái đàn hồi đỉnh cao của Adidas, thân giày dệt sợi Primeknit thoáng mát.",
    materials: "Primeknit dệt sợi, Đệm Boost hạt, Đế ngoài Continental",
  },
  {
    id: 3,
    name: "Air Jordan 11 Low 'Mother's Day'",
    brand: "Jordan",
    price: "5,589,000₫",
    rating: 4.9,
    reviews: 210,
    badge: "Hot",
    photoId: "/Air Jordan 11 Low 'Mother's Day'.png",
    category: "Basketball",
    glowColor: "rgba(244, 114, 182, 0.45)",
    sizes: [39, 40, 41, 42, 43],
    description: "Phối màu đặc biệt kỷ niệm ngày của mẹ với lớp phủ nhung vàng óng quyến rũ, cực kỳ sang chảnh.",
    materials: "Da bóng patent leather cao cấp, Lớp đệm Air full-length",
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
    glowColor: "rgba(52, 211, 153, 0.45)",
    sizes: [38, 39, 40, 41, 42],
    description: "Thiết kế hầm hố retro-chunky cá tính với các mảng màu tương phản rực rỡ, ôm chân cực chuẩn.",
    materials: "Lưới dệt Mesh thoáng khí, Lớp phủ Nubuck cá tính",
  },
  {
    id: 5,
    name: "ABZORB 2010 Grey Days",
    brand: "New Balance",
    price: "3,625,000₫",
    rating: 4.8,
    reviews: 43,
    badge: "Limited",
    photoId: "/ABZORB 2010 Grey Day's.png",
    category: "Lifestyle",
    glowColor: "rgba(163, 163, 163, 0.45)",
    sizes: [40, 41, 42, 43, 44],
    description: "Tôn vinh sắc xám trường tồn huyền thoại của New Balance kết hợp công nghệ Abzorb giảm xóc ấn tượng.",
    materials: "Da lộn Premium Suede, Đệm giảm chấn ABZORB",
  },
  {
    id: 6,
    name: "Air Max 90 'Hypervenom'",
    brand: "Nike",
    price: "4,109,000₫",
    rating: 4.8,
    reviews: 150,
    badge: "Limited",
    photoId: "/Nike Air Max 90 'Hypervenom'.png",
    category: "Lifestyle",
    glowColor: "rgba(132, 204, 22, 0.45)",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Mẫu giày kỷ niệm dòng Hypervenom bóng đá nổi tiếng với tông xanh chuối sặc sỡ và lớp đệm khí Air max.",
    materials: "Da lộn kết hợp lưới Mesh, Cửa sổ đệm khí Max Air",
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = mockProducts.find((p) => p.id === parseInt(resolvedParams.id));
  if (!product) return { title: "Không tìm thấy sản phẩm | OmniShoe" };
  return {
    title: `${product.name} — ${product.brand} | OmniShoe`,
    description: `${product.description} Mua giày chính hãng 100% bảo hành uy tín tại Việt Nam.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = mockProducts.find((p) => p.id === parseInt(resolvedParams.id));
  if (!product) notFound();

  // Structural JSON-LD
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand,
    },
    "image": product.photoId.startsWith("/") ? product.photoId : `https://images.unsplash.com/${product.photoId}`,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "price": product.price.replace(/[^\d]/g, ""),
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative z-0 flex flex-col">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/Gemini_Generated_Image_kb01qnkb01qnkb01.png')` }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Header clone for Detail Page navigation */}
      <header className="header w-full">
        <div className="header-container">
          <Link href="/" className="header-logo-link">
            <img src="/logo.png" alt="OmniShoe Logo" className="header-logo-image" />
          </Link>
          <nav className="nav-links">
            {["Nam", "Nữ", "Thương hiệu", "Sale", "Xu hướng"].map((link) => (
              <Link key={link} href="/">
                {link}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/" className="action-btn" aria-label="Home">
              <i className="ti ti-arrow-left"></i> Quay lại
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto px-8 md:px-12 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-xs text-text-muted font-bold mb-8 items-center">
          <Link href="/" className="hover:text-accent transition-colors">TRANG CHỦ</Link>
          <i className="ti ti-chevron-right text-[10px]"></i>
          <span className="text-accent">{product.brand.toUpperCase()}</span>
          <i className="ti ti-chevron-right text-[10px]"></i>
          <span className="text-foreground">{product.name.toUpperCase()}</span>
        </div>

        {/* Core Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {/* Details & Specs Tabs */}
        <div className="mt-16 border-t border-border-color pt-12">
          <ProductTabs product={product} />
        </div>

        {/* Related Products Grid */}
        <div className="mt-16 border-t border-border-color pt-12">
          <RelatedProducts currentProduct={product} allProducts={mockProducts} />
        </div>
      </main>
    </div>
  );
}
