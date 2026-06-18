import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <Header />

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
      <Footer />
    </div>
  );
}
