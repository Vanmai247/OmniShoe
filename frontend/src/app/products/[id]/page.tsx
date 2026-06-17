import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const cwd = process.cwd();
    const dataPath = cwd.endsWith("frontend") 
      ? path.join(cwd, "src/data/products.json") 
      : path.join(cwd, "frontend/src/data/products.json");
    const fileData = await fs.readFile(dataPath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Failed to load products dynamically:", error);
    return [];
  }
}

async function getPageConfig(key: string) {
  try {
    const cwd = process.cwd();
    const dataPath = cwd.endsWith("frontend") 
      ? path.join(cwd, "src/data/pages.json") 
      : path.join(cwd, "frontend/src/data/pages.json");
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);
    return pages.find((p: any) => p.key === key) || null;
  } catch (error) {
    console.error("Failed to load page config dynamically:", error);
    return null;
  }
}

const brands = [
  "Nike",
  "Adidas",
  "Jordan",
  "Puma",
  "New Balance",
  "Converse",
  "Vans",
  "MLB",
];

const brandLogos: Record<string, string> = {
  "Nike": "/Nike-logo.jpg",
  "Adidas": "/adidas-logo.png",
  "Jordan": "/Jordan-logo.jpg",
  "Puma": "/puma-logo-3.jpg",
  "New Balance": "/newbalance-logo.png",
  "Converse": "/converse-logo.jpg",
  "Vans": "/vanz-logo.jpg",
  "MLB": "/mlb-logo.png",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p: any) => p.id === parseInt(resolvedParams.id));
  if (!product) return { title: "Không tìm thấy sản phẩm | OmniShoe" };

  const pageConfig = await getPageConfig("product");
  const titlePattern = pageConfig?.metadata?.seoTitlePattern || "{product_name} — {product_brand} | OmniShoe";
  const seoTitle = titlePattern
    .replace("{product_name}", product.name)
    .replace("{product_brand}", product.brand);

  return {
    title: seoTitle,
    description: `${product.description || ""} Mua giày chính hãng 100% bảo hành uy tín tại Việt Nam.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p: any) => p.id === parseInt(resolvedParams.id));
  if (!product) notFound();

  const pageConfig = await getPageConfig("product");

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
            <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" className="header-logo-image" />
          </Link>
          <nav className="nav-links">
            <Link href="/#product-section">Sản phẩm</Link>
            <div className="nav-item-has-submenu">
              <Link href="/" className="nav-link-trigger">Nam</Link>
              <div className="mega-menu !w-[480px]">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-accent mb-3">Dòng sản phẩm</h4>
                    <ul className="flex flex-col gap-2.5">
                      {["Lifestyle Sneaker", "Running / Performance", "Basketball / Cổ cao", "Classic Canvas", "Chunky Sneaker", "Sandal & Dép"].map((item) => (
                        <li key={item}>
                          <Link 
                            href="/" 
                            className="text-xs font-bold text-zinc-500 hover:text-accent transition-colors block py-0.5"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div 
                    className="flex flex-col justify-between p-4 rounded-2xl relative overflow-hidden min-h-[170px] group/banner text-white border border-zinc-200/10"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0.4) 100%), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="relative z-10 text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30">Hot Drop</span>
                      <h5 className="text-xs font-black text-white mt-3 leading-tight uppercase">Men's Sneaker</h5>
                      <p className="text-[10px] !text-zinc-200 mt-1.5 leading-normal font-semibold">Những phối màu và thiết kế độc quyền dành riêng cho Nam.</p>
                    </div>
                    <Link 
                      href="/" 
                      className="relative z-10 text-[10px] font-black uppercase tracking-wider !text-white hover:!text-accent transition-all flex items-center gap-1 mt-3 group-hover/banner:translate-x-1"
                    >
                      Xem tất cả <i className="ti ti-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item-has-submenu">
              <Link href="/" className="nav-link-trigger">Nữ</Link>
              <div className="mega-menu !w-[480px]">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-accent mb-3">Dòng sản phẩm</h4>
                    <ul className="flex flex-col gap-2.5">
                      {["Lifestyle Sneaker", "Running / Performance", "Chunky / Platform", "Classic Canvas", "Sandal & Dép"].map((item) => (
                        <li key={item}>
                          <Link 
                            href="/" 
                            className="text-xs font-bold text-zinc-500 hover:text-accent transition-colors block py-0.5"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div 
                    className="flex flex-col justify-between p-4 rounded-2xl relative overflow-hidden min-h-[170px] group/banner text-white border border-zinc-200/10"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0.4) 100%), url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="relative z-10 text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30">Sporty Chic</span>
                      <h5 className="text-xs font-black text-white mt-3 leading-tight uppercase">Women's Sneaker</h5>
                      <p className="text-[10px] !text-zinc-200 mt-1.5 leading-normal font-semibold">Những phối màu tinh tế và êm ái dành riêng cho Nữ.</p>
                    </div>
                    <Link 
                      href="/" 
                      className="relative z-10 text-[10px] font-black uppercase tracking-wider !text-white hover:!text-accent transition-all flex items-center gap-1 mt-3 group-hover/banner:translate-x-1"
                    >
                      Xem tất cả <i className="ti ti-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-item-has-submenu">
              <Link href="/" className="nav-link-trigger">Thương hiệu</Link>
              <div className="mega-menu">
                <div className="mega-menu-grid">
                  {brands.map((brand) => (
                    <Link 
                      key={brand}
                      href={`/?brand=${brand}`}
                      className="mega-menu-item"
                    >
                      <img src={brandLogos[brand]} alt={brand} />
                      <span>{brand}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/">Sale</Link>
            <Link href="/">Xu hướng</Link>
            <Link href="/gioi-thieu">Về chúng tôi</Link>
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
          <ProductTabs product={product} pageConfig={pageConfig} />
        </div>

        {/* Related Products Grid */}
        <div className="mt-16 border-t border-border-color pt-12">
          <RelatedProducts 
            currentProduct={product} 
            allProducts={products} 
            limit={pageConfig?.content?.relatedCount || 3} 
          />
        </div>
      </main>
    </div>
  );
}
