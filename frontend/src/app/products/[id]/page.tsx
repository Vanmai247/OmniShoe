import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

function mapDbProductToFrontend(dbProduct: any) {
  let glowColor = "rgba(255, 255, 255, 0.45)";
  if (dbProduct.brand === "Adidas") {
    glowColor = "rgba(0, 150, 255, 0.45)";
  } else if (dbProduct.brand === "Jordan") {
    glowColor = "rgba(244, 114, 182, 0.45)";
  } else if (dbProduct.brand === "Puma") {
    glowColor = "rgba(52, 211, 153, 0.45)";
  }

  const sizes = dbProduct.category?.name === "Running" 
    ? [40, 41, 42, 43, 44] 
    : [39, 40, 41, 42, 43];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    price: dbProduct.price.toLocaleString("vi-VN") + "₫",
    oldPrice: dbProduct.originalPrice ? dbProduct.originalPrice.toLocaleString("vi-VN") + "₫" : undefined,
    rating: 4.8,
    reviews: 120,
    badge: dbProduct.badge || "",
    photoId: dbProduct.image,
    category: dbProduct.category?.name || "Lifestyle",
    glowColor,
    sizes
  };
}

async function getProducts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    const dbProducts = await res.json();
    const mappedProducts = dbProducts.map(mapDbProductToFrontend);

    // Merge reviews and ratings from local products.json if they exist
    try {
      const cwd = process.cwd();
      const dataPath = cwd.endsWith("frontend") 
        ? path.join(cwd, "src/data/products.json") 
        : path.join(cwd, "frontend/src/data/products.json");
      const fileData = await fs.readFile(dataPath, "utf8");
      const jsonProducts = JSON.parse(fileData);

      return mappedProducts.map((p: any) => {
        const jsonProduct = jsonProducts.find((jp: any) => jp.id === p.id);
        if (jsonProduct) {
          return {
            ...p,
            rating: jsonProduct.rating ?? p.rating,
            reviews: jsonProduct.reviews ?? p.reviews,
            reviewsList: jsonProduct.reviewsList ?? []
          };
        }
        return p;
      });
    } catch (err) {
      // If reading products.json fails, just return mapped products
    }

    return mappedProducts;
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

      {/* Global Header */}
      <Header />

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

      <Footer />
    </div>
  );
}
