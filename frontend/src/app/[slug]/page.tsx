import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPageConfig(slug: string) {
  // Prevent catching system paths, routing assets, or API namespaces
  if (
    slug.startsWith("_") || 
    slug === "favicon.ico" || 
    slug === "not-found" ||
    slug === "admin" ||
    slug === "api" ||
    slug === "products"
  ) {
    return null;
  }

  try {
    const cwd = process.cwd();
    const dataPath = cwd.endsWith("frontend") 
      ? path.join(cwd, "src/data/pages.json") 
      : path.join(cwd, "frontend/src/data/pages.json");
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);
    
    const page = pages.find((p: any) => p.key === slug);
    if (!page || page.status !== "published") {
      return null;
    }
    return page;
  } catch (error) {
    console.error("Failed to load dynamic page config:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPageConfig(resolvedParams.slug);
  if (!page) return { title: "Không tìm thấy trang | OmniShoe" };
  
  return {
    title: page.metadata?.seoTitle || `${page.title} | OmniShoe`,
    description: page.metadata?.seoDescription || "",
  };
}

// Simple internal markdown rendering helper to display rich paragraphs, lists, bold text, and headings.
function renderMarkdown(md: string) {
  if (!md) return null;
  
  const lines = md.split("\n");
  
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-foreground font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-4" />;
    
    // Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-lg font-black uppercase tracking-tight mt-6 mb-3 text-foreground">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-xl font-black uppercase tracking-tight mt-8 mb-4 border-b border-border-color pb-2 text-foreground">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-3xl font-black uppercase tracking-tight mt-10 mb-6 text-foreground">
          {trimmed.slice(2)}
        </h1>
      );
    }
    
    // Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <li key={idx} className="list-disc ml-5 mb-2 text-text-muted font-semibold leading-relaxed">
          {parseInline(trimmed.slice(2))}
        </li>
      );
    }

    // Default paragraph
    return (
      <p key={idx} className="mb-4 text-text-muted font-semibold leading-relaxed">
        {parseInline(trimmed)}
      </p>
    );
  });
}

export default async function DynamicCMSPage({ params }: PageProps) {
  const resolvedParams = await params;
  const page = await getPageConfig(resolvedParams.slug);
  if (!page) notFound();

  const bannerBg = page.content?.bannerBg || "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80";

  return (
    <div className="min-h-screen bg-background text-foreground relative z-0 flex flex-col">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/studio_light_bg.png')` }}
      />

      {/* Global Header */}
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
            <Link href="/">Sale</Link>
            <Link href="/">Xu hướng</Link>
            <Link href="/gioi-thieu">Về chúng tôi</Link>
          </nav>
          <div className="header-actions">
            <Link href="/" className="action-btn" aria-label="Home">
              <i className="ti ti-arrow-left"></i> Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </header>

      {/* Banner / Cover Header */}
      <section 
        className="relative h-[250px] md:h-[350px] bg-center bg-cover bg-no-repeat flex items-center justify-center text-center px-6"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(12,12,18,0.6), rgba(12,12,18,0.9)), url('${bannerBg}')` }}
      >
        <div className="flex flex-col gap-2 relative z-10">
          {page.content?.subtitle && (
            <span className="text-accent text-xs font-black tracking-widest uppercase">{page.content.subtitle}</span>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
            {page.title}
          </h1>
        </div>
      </section>

      {/* Page Body Container */}
      <main className="flex-grow max-w-[900px] mx-auto px-8 md:px-12 py-16 w-full text-left">
        <div className="bg-card-background/40 backdrop-blur-md border border-border-color p-8 md:p-12 rounded-[32px] shadow-sm select-text">
          {renderMarkdown(page.content?.body || "")}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer border-t border-border-color">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo-link">
              <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" className="footer-logo-image" />
            </Link>
            <p>Dẫn đầu xu hướng, khẳng định chất riêng. OmniShoe mang văn hóa sneaker thực thụ đến cộng đồng Gen Z Việt Nam.</p>
            <div className="social-links">
              {["instagram", "tiktok", "facebook", "youtube"].map((social) => (
                <a key={social} href="#" aria-label={social}>
                  <i className={`ti ti-brand-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>MUA SẮM</h4>
            <ul>
              {["Sản phẩm Nam", "Sản phẩm Nữ", "Thương hiệu nổi bật", "Đặc quyền VIP", "Bộ sưu tập Sale"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>HỖ TRỢ</h4>
            <ul>
              {["Chính sách giao hàng", "Chính sách đổi trả 30 ngày", "Hướng dẫn chọn size giày", "Bảo hành sản phẩm", "Liên hệ hỗ trợ"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>CỬA HÀNG</h4>
            <ul>
              <li>
                <i className="ti ti-map-pin"></i>
                <span>123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội.</span>
              </li>
              <li>
                <i className="ti ti-phone"></i>
                <span>Hotline: 1900 8198 (8h00 - 22h00)</span>
              </li>
              <li>
                <i className="ti ti-mail"></i>
                <span>Email: vanmai756@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OmniShoe. Bản quyền thuộc về sneakerhead Việt Nam.</p>

          <div className="bottom-social-links flex gap-4 my-2 sm:my-0">
            {["instagram", "tiktok", "facebook", "youtube"].map((social) => (
              <a key={social} href="#" aria-label={social} className="text-text-muted hover:text-accent transition-colors text-lg">
                <i className={`ti ti-brand-${social}`}></i>
              </a>
            ))}
          </div>

          <div className="bottom-links">
            <a href="#">Điều khoản dịch vụ</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Quản lý Cookie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
