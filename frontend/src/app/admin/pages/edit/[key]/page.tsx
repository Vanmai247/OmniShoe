"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

interface PageConfig {
  id: number;
  key: string;
  title: string;
  type: string;
  status: "published" | "draft";
  metadata: {
    seoTitle: string;
    seoDescription: string;
    seoTitlePattern?: string;
  };
  content: Record<string, any>;
}

export default function EditPageConfig({ params }: { params: Promise<{ key: string }> }) {
  const resolvedParams = use(params);
  const key = resolvedParams.key;
  const router = useRouter();
  const { showToast } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // General fields
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoTitlePattern, setSeoTitlePattern] = useState("");

  // Dynamic Content fields
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch(`/api/pages/${key}`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.json();
      })
      .then((data: PageConfig) => {
        setTitle(data.title);
        setStatus(data.status);
        setSeoTitle(data.metadata?.seoTitle || "");
        setSeoDescription(data.metadata?.seoDescription || "");
        setSeoTitlePattern(data.metadata?.seoTitlePattern || "");
        setContent(data.content || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading page details:", err);
        showToast("Không tìm thấy cấu hình trang này! ❌");
        router.push("/admin/pages");
      });
  }, [key]);

  const handleContentChange = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      status,
      metadata: {
        seoTitle: key === "product" ? undefined : seoTitle,
        seoDescription: key === "product" ? undefined : seoDescription,
        seoTitlePattern: key === "product" ? seoTitlePattern : undefined,
      },
      content,
    };

    try {
      const res = await fetch(`/api/pages/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Đã lưu cấu hình trang "${title}" thành công! 🎉`);
        router.push("/admin/pages");
      } else {
        const err = await res.json();
        showToast(`Lỗi: ${err.error || "Không thể lưu cấu hình"} ❌`);
      }
    } catch (error) {
      console.error("Save page config error:", error);
      showToast("Lỗi kết nối máy chủ! ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/pages" className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <i className="ti ti-arrow-left text-lg" />
            </Link>
            <h2 className="text-xl font-black text-zinc-800 uppercase tracking-tight">
              Biên tập: {title}
            </h2>
          </div>
          <div className="text-xs text-zinc-400 font-bold mt-1 ml-6 uppercase tracking-wider flex flex-wrap items-center gap-3">
            <span>Loại: {key === "home" || key === "product" ? "Hệ thống" : "Tùy chọn"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Đường dẫn cửa hàng:{" "}
              <a 
                href={key === "home" ? "/" : key === "product" ? "/products/1" : `/${key}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline normal-case font-extrabold inline-flex items-center gap-1"
              >
                {key === "home" ? "/" : key === "product" ? "/products/[id]" : `/${key}`}
                <i className="ti ti-external-link text-[10px]" />
              </a>
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-bold self-start">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "content" ? "bg-white text-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Nội dung Trang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "seo" ? "bg-white text-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Cấu hình SEO
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl bg-white border border-zinc-200/60 p-8 rounded-3xl flex flex-col gap-6 shadow-sm">
        
        {/* TAB 1: CONTENT EDITING */}
        {activeTab === "content" && (
          <div className="flex flex-col gap-6">
            
            {/* Standard Global Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                  Tiêu đề trang *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Giới thiệu"
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                  Trạng thái xuất bản
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold cursor-pointer"
                >
                  <option value="published">Đã xuất bản (Công khai)</option>
                  <option value="draft">Bản nháp (Ẩn)</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC FORM ACCORDING TO PAGE KEY */}
            
            {/* CASE A: HOME PAGE */}
            {key === "home" && (
              <div className="flex flex-col gap-6">
                
                {/* 1. HERO SECTION GROUP */}
                <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                  <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <i className="ti ti-layout-hero text-lg" /> Khối Banner chính (Hero Section)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Nhãn Badge phụ</label>
                      <input
                        type="text"
                        value={content.heroBadge || ""}
                        onChange={(e) => handleContentChange("heroBadge", e.target.value)}
                        placeholder="Ví dụ: Drop mới"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tiêu đề Hero chính</label>
                      <input
                        type="text"
                        value={content.heroTitle || ""}
                        onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                        placeholder="Ví dụ: NÂNG TẦM PHONG CÁCH SNEAKER"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Mô tả chi tiết</label>
                      <textarea
                        value={content.heroDesc || ""}
                        onChange={(e) => handleContentChange("heroDesc", e.target.value)}
                        placeholder="Nhập mô tả ngắn..."
                        rows={3}
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-medium text-zinc-800 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Đường dẫn hình nền (Background Image URL)</label>
                      <input
                        type="text"
                        value={content.heroBg || ""}
                        onChange={(e) => handleContentChange("heroBg", e.target.value)}
                        placeholder="Ví dụ: /studio_light_bg.png"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. COUNTDOWN EVENT GROUP */}
                <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                      <i className="ti ti-alarm text-lg animate-pulse" /> Sự kiện mở bán đếm ngược (Countdown Event)
                    </h3>
                    {/* Toggle check */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!content.countdownActive}
                        onChange={(e) => handleContentChange("countdownActive", e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-orange-500 accent-orange-500 cursor-pointer"
                      />
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-wider">Kích hoạt hiển thị</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Nhãn sự kiện</label>
                      <input
                        type="text"
                        value={content.countdownBadge || ""}
                        onChange={(e) => handleContentChange("countdownBadge", e.target.value)}
                        placeholder="Ví dụ: Limited Drop"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tiêu đề chính</label>
                      <input
                        type="text"
                        value={content.countdownTitle || ""}
                        onChange={(e) => handleContentChange("countdownTitle", e.target.value)}
                        placeholder="Ví dụ: AIR JORDAN 1 RETRO CHICAGO"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Mô tả sự kiện</label>
                      <textarea
                        value={content.countdownDesc || ""}
                        onChange={(e) => handleContentChange("countdownDesc", e.target.value)}
                        placeholder="Nhập mô tả sự kiện..."
                        rows={3}
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-medium text-zinc-800 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Đường dẫn ảnh sản phẩm</label>
                      <input
                        type="text"
                        value={content.countdownImage || ""}
                        onChange={(e) => handleContentChange("countdownImage", e.target.value)}
                        placeholder="Nhập link ảnh hoặc upload..."
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tên dòng giày</label>
                      <input
                        type="text"
                        value={content.countdownSneakerName || ""}
                        onChange={(e) => handleContentChange("countdownSneakerName", e.target.value)}
                        placeholder="Jordan 1 Retro High Chicago"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tag giới hạn</label>
                      <input
                        type="text"
                        value={content.countdownLimitTag || ""}
                        onChange={(e) => handleContentChange("countdownLimitTag", e.target.value)}
                        placeholder="85 đôi tại Việt Nam"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Thời gian sự kiện diễn ra (ISO format)</label>
                      <input
                        type="text"
                        value={content.countdownTargetDate || ""}
                        onChange={(e) => handleContentChange("countdownTargetDate", e.target.value)}
                        placeholder="2026-06-30T23:59:59"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* CASE B: PRODUCT DETAIL PAGE TEMPLATE */}
            {key === "product" && (
              <div className="flex flex-col gap-6">
                
                {/* CONFIG LISTING */}
                <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                  <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <i className="ti ti-settings text-lg" /> Cấu hình hiển thị
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Số lượng sản phẩm liên quan</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={content.relatedCount || 4}
                        onChange={(e) => handleContentChange("relatedCount", parseInt(e.target.value) || 4)}
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                {/* SERVICE POLICIES */}
                <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                  <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <i className="ti ti-shield-check text-lg" /> Chính sách bán hàng & dịch vụ (3 thẻ chân trang)
                  </h3>

                  <div className="grid grid-cols-1 gap-6 mt-2">
                    {/* Policy 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-zinc-200/40">
                      <span className="text-xs font-black uppercase text-zinc-400 flex items-center md:justify-center">Chính sách 1</span>
                      <div className="md:col-span-2 flex flex-col gap-2.5">
                        <input
                          type="text"
                          value={content.policyShippingTitle || ""}
                          onChange={(e) => handleContentChange("policyShippingTitle", e.target.value)}
                          placeholder="Tiêu đề chính sách 1 (Giao hàng miễn phí)"
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold text-zinc-800"
                        />
                        <input
                          type="text"
                          value={content.policyShippingDesc || ""}
                          onChange={(e) => handleContentChange("policyShippingDesc", e.target.value)}
                          placeholder="Mô tả ngắn..."
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500 font-medium text-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Policy 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-zinc-200/40">
                      <span className="text-xs font-black uppercase text-zinc-400 flex items-center md:justify-center">Chính sách 2</span>
                      <div className="md:col-span-2 flex flex-col gap-2.5">
                        <input
                          type="text"
                          value={content.policyReturnTitle || ""}
                          onChange={(e) => handleContentChange("policyReturnTitle", e.target.value)}
                          placeholder="Tiêu đề chính sách 2 (Đổi trả 30 ngày)"
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold text-zinc-800"
                        />
                        <input
                          type="text"
                          value={content.policyReturnDesc || ""}
                          onChange={(e) => handleContentChange("policyReturnDesc", e.target.value)}
                          placeholder="Mô tả ngắn..."
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500 font-medium text-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Policy 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-zinc-200/40">
                      <span className="text-xs font-black uppercase text-zinc-400 flex items-center md:justify-center">Chính sách 3</span>
                      <div className="md:col-span-2 flex flex-col gap-2.5">
                        <input
                          type="text"
                          value={content.policyWarrantyTitle || ""}
                          onChange={(e) => handleContentChange("policyWarrantyTitle", e.target.value)}
                          placeholder="Tiêu đề chính sách 3 (Chính hãng 100%)"
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold text-zinc-800"
                        />
                        <input
                          type="text"
                          value={content.policyWarrantyDesc || ""}
                          onChange={(e) => handleContentChange("policyWarrantyDesc", e.target.value)}
                          placeholder="Mô tả ngắn..."
                          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500 font-medium text-zinc-600"
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* CASE C: STANDARD PAGES (CUSTOM CREATED) */}
            {key !== "home" && key !== "product" && (
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                  <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <i className="ti ti-article text-lg" /> Nội dung trang tĩnh
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tiêu đề phụ (Subtitle)</label>
                      <input
                        type="text"
                        value={content.subtitle || ""}
                        onChange={(e) => handleContentChange("subtitle", e.target.value)}
                        placeholder="Ví dụ: CÂU CHUYỆN SNEAKER CULTURE"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Ảnh bìa Banner (Banner Image URL)</label>
                      <input
                        type="text"
                        value={content.bannerBg || ""}
                        onChange={(e) => handleContentChange("bannerBg", e.target.value)}
                        placeholder="Ví dụ: https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80"
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Chi tiết nội dung (Hỗ trợ định dạng Markdown)</label>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Hỗ trợ heading, danh sách, in đậm, link</span>
                      </div>
                      <textarea
                        value={content.body || ""}
                        onChange={(e) => handleContentChange("body", e.target.value)}
                        placeholder="Viết nội dung của trang ở đây..."
                        rows={14}
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-mono leading-relaxed resize-y text-zinc-800"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: SEO CONFIGURATION */}
        {activeTab === "seo" && (
          <div className="flex flex-col gap-6">
            
            {key === "product" ? (
              /* SEO Title Pattern for details page */
              <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                  <i className="ti ti-seo text-lg" /> Mẫu thiết lập SEO chi tiết
                </h3>
                
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Cấu trúc tiêu đề trang (SEO Title Pattern)</label>
                  <input
                    type="text"
                    required
                    value={seoTitlePattern}
                    onChange={(e) => setSeoTitlePattern(e.target.value)}
                    placeholder="Ví dụ: {product_name} — {product_brand} | OmniShoe"
                    className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                  />
                  <p className="text-[10px] text-zinc-400 font-bold leading-normal mt-1">
                    Sử dụng các biến động đặt trong ngoặc nhọn `{` `}` để tự động trích xuất. Các trường được hỗ trợ: <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-600 font-black font-mono">{`{product_name}`}</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-600 font-black font-mono">{`{product_brand}`}</code>.
                  </p>
                </div>
              </div>
            ) : (
              /* Standard SEO title and description meta */
              <div className="flex flex-col gap-4 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/20">
                <h3 className="font-extrabold text-sm uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                  <i className="ti ti-seo text-lg" /> Thẻ Meta Search Engine Optimization
                </h3>
                
                <div className="grid grid-cols-1 gap-5 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Tiêu đề SEO (Title Tag)</label>
                    <input
                      type="text"
                      required
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Nhập tiêu đề hiển thị trên trình duyệt..."
                      className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-semibold text-zinc-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Mô tả SEO (Meta Description)</label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Nhập mô tả tóm tắt của trang cho các công cụ tìm kiếm..."
                      rows={4}
                      className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-medium text-zinc-800 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Submit Dock */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-6 mt-4">
          <Link
            href="/admin/pages"
            className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors text-sm font-bold"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(255,87,34,0.15)] text-sm flex items-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>Lưu cấu hình</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
