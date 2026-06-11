"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

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

export default function AdminPagesPage() {
  const { showToast } = useAppContext();
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");

  // Create page modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete page modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<{ key: string; title: string } | null>(null);

  // Undo state
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoItem, setUndoItem] = useState<PageConfig | null>(null);
  const [undoCountdown, setUndoCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showUndoToast && undoCountdown > 0) {
      timer = setTimeout(() => {
        setUndoCountdown((prev) => prev - 1);
      }, 1000);
    } else if (undoCountdown === 0) {
      setShowUndoToast(false);
      setUndoItem(null);
    }
    return () => clearTimeout(timer);
  }, [showUndoToast, undoCountdown]);

  const loadPages = () => {
    setLoading(true);
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading pages:", err);
        showToast("Lỗi tải danh sách trang! ❌");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Sync slug input when title changes
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    // Convert to lowercase, remove accents (Vietnamese), replace special characters with dashes
    const slug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-"); // merge multi dashes
    setNewSlug(slug);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) {
      showToast("Vui lòng điền đầy đủ Tiêu đề và Slug! ⚠️");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          key: newSlug,
          type: "standard",
          status: "draft",
          content: {
            bannerBg: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80",
            subtitle: "TRANG TĨNH MỚI",
            body: "# " + newTitle + "\n\nSoạn thảo nội dung ở đây..."
          }
        })
      });

      if (res.ok) {
        showToast("Đã thêm trang mới thành công! 🎉");
        setIsModalOpen(false);
        setNewTitle("");
        setNewSlug("");
        loadPages();
      } else {
        const errorData = await res.json();
        showToast(`Lỗi: ${errorData.error || "Không thể tạo trang mới"} ❌`);
      }
    } catch (e) {
      console.error("Create page error:", e);
      showToast("Lỗi kết nối khi tạo trang! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClonePage = async (page: PageConfig) => {
    try {
      const uniqueSuffix = Math.floor(100 + Math.random() * 900);
      const clonedKey = `${page.key}-copy-${uniqueSuffix}`;
      const clonedTitle = `${page.title} (Bản sao)`;

      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: clonedTitle,
          key: clonedKey,
          type: page.type === "home" || page.type === "product" ? "standard" : page.type,
          status: "draft",
          metadata: {
            seoTitle: `${clonedTitle} | OmniShoe`,
            seoDescription: page.metadata.seoDescription
          },
          content: page.content
        })
      });

      if (res.ok) {
        showToast("Nhân bản trang thành công! 📑");
        loadPages();
      } else {
        const errorData = await res.json();
        showToast(`Lỗi nhân bản: ${errorData.error || "Không thể sao chép"} ❌`);
      }
    } catch (e) {
      console.error("Clone page error:", e);
      showToast("Lỗi kết nối khi sao chép trang! ❌");
    }
  };

  const triggerDeleteConfirm = (key: string, title: string) => {
    if (key === "home" || key === "product") {
      showToast("Không thể xóa các trang mặc định của hệ thống! 🔒");
      return;
    }
    setPageToDelete({ key, title });
    setIsDeleteModalOpen(true);
  };

  const executeDeletePage = async () => {
    if (!pageToDelete) return;
    const { key, title } = pageToDelete;
    
    // Find page config for backup
    const pageBackup = pages.find((p) => p.key === key);
    if (!pageBackup) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/pages/${key}`, { method: "DELETE" });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setPageToDelete(null);

        // Trigger undo toast
        setUndoItem(pageBackup);
        setUndoCountdown(5);
        setShowUndoToast(true);

        loadPages();
      } else {
        const errorData = await res.json();
        showToast(`Lỗi: ${errorData.error || "Không thể xóa trang"} ❌`);
      }
    } catch (e) {
      console.error("Delete page error:", e);
      showToast("Lỗi kết nối khi xóa trang! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndoDelete = async () => {
    if (!undoItem) return;

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: undoItem.title,
          key: undoItem.key,
          type: undoItem.type,
          status: undoItem.status,
          metadata: undoItem.metadata,
          content: undoItem.content,
        }),
      });

      if (res.ok) {
        showToast("Đã khôi phục trang thành công! ↩️");
        setShowUndoToast(false);
        setUndoItem(null);
        loadPages();
      } else {
        const errorData = await res.json();
        showToast(`Không thể hoàn tác: ${errorData.error || "Lỗi khôi phục"} ❌`);
      }
    } catch (e) {
      console.error("Undo delete error:", e);
      showToast("Lỗi kết nối khi hoàn tác! ❌");
    }
  };

  // Filter pages list
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Tất cả" || page.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Search & Actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề hoặc slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 placeholder-zinc-400 font-semibold"
            />
            <i className="ti ti-search absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
          </div>

          {/* Type Filter dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold cursor-pointer"
          >
            <option value="Tất cả">Tất cả thể loại</option>
            <option value="home">Hệ thống (Trang chủ)</option>
            <option value="product">Hệ thống (Trang sản phẩm)</option>
            <option value="standard">Trang tĩnh tự chọn</option>
          </select>
        </div>

        {/* Create Page trigger button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-sm tracking-wide hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(255,87,34,0.15)] whitespace-nowrap text-center justify-center cursor-pointer"
        >
          <i className="ti ti-plus text-base" />
          Thêm trang mới
        </button>
      </div>

      {/* Pages Cards Grid - Styled similar to KingWork CMS Pages List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-zinc-200/60 rounded-2xl">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPages.length > 0 ? (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-300 transition-all"
            >
              {/* Left Column: Title and details */}
              <div className="flex flex-col gap-1.5 max-w-[70%]">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-base text-zinc-800 tracking-tight leading-snug">
                    {page.title}
                  </h3>
                  {page.type !== "standard" && (
                    <span className="text-[9px] uppercase font-black tracking-wider bg-orange-100 text-orange-600 px-2 py-0.5 rounded border border-orange-200/40">
                      Hệ thống
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <i className="ti ti-key text-sm text-zinc-400" />
                    Key: <strong className="text-zinc-600">{page.key}</strong>
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="flex items-center gap-1">
                    <i className="ti ti-link text-sm text-zinc-400" />
                    Đường dẫn:{" "}
                    <a 
                      href={page.key === "home" ? "/" : page.key === "product" ? "/products/1" : `/${page.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline font-extrabold inline-flex items-center gap-1"
                    >
                      {page.key === "home" ? "/" : page.key === "product" ? "/products/[id]" : `/${page.key}`}
                      <i className="ti ti-external-link text-[10px]" />
                    </a>
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span>
                    Thể loại:{" "}
                    <span className="text-zinc-600 font-bold">
                      {page.type === "home"
                        ? "Trang chủ"
                        : page.type === "product"
                        ? "Chi tiết sản phẩm"
                        : "Trang tự tạo (Standard)"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Right Column: Status badge and Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                {/* Status Badge */}
                <span
                  className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border ${
                    page.status === "published"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                  }`}
                >
                  {page.status === "published" ? "đã xuất bản" : "bản nháp"}
                </span>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/pages/edit/${page.key}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 transition-all text-xs font-bold"
                  >
                    <i className="ti ti-edit text-sm" />
                    Sửa chi tiết
                  </Link>

                  <button
                    onClick={() => handleClonePage(page)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 transition-all text-xs font-bold cursor-pointer"
                    title="Nhân bản trang"
                  >
                    <i className="ti ti-copy text-sm" />
                    Sao chép
                  </button>

                  {page.key !== "home" && page.key !== "product" ? (
                    <button
                      onClick={() => triggerDeleteConfirm(page.key, page.title)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50/50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500 text-rose-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                    >
                      <i className="ti ti-trash text-sm" />
                      Xóa
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-400 transition-all text-xs font-bold cursor-not-allowed"
                      title="Trang hệ thống không thể xóa"
                    >
                      <i className="ti ti-lock text-sm" />
                      Khóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-zinc-200/60 rounded-2xl text-zinc-400 font-bold">
            Không tìm thấy trang nào phù hợp!
          </div>
        )}
      </div>

      {/* Slide-over or Center Modal for adding new page */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-zinc-200/50 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tight">Thêm trang tĩnh mới</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                  Tiêu đề trang *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Chính sách bảo hành"
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 font-semibold focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                  Đường dẫn tĩnh (Slug / Key) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-xs text-zinc-400 font-bold select-none">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) =>
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-_]/g, "-")
                          .replace(/-+/g, "-")
                      )
                    }
                    placeholder="chinh-sach-bao-hanh"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-orange-500 rounded-xl px-4 py-3 pl-7 text-sm text-zinc-800 placeholder-zinc-400 font-semibold focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 font-bold leading-normal">
                  Đường dẫn URL đại diện cho trang. Ví dụ: /chinh-sach-bao-hanh
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/10 cursor-pointer"
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && pageToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 flex flex-col gap-5 text-center items-center font-sans">
            
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
              <i className="ti ti-alert-triangle text-2xl" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tight">
                Xác nhận xóa trang?
              </h3>
              <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-semibold">
                Bạn có chắc chắn muốn xóa trang <strong className="text-zinc-800 font-black">"{pageToDelete.title}"</strong>? 
                Thao tác này sẽ xóa vĩnh viễn cấu hình và nội dung trang khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full border-t border-zinc-100 pt-4 mt-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPageToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeDeletePage}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/10 cursor-pointer"
              >
                {isSubmitting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Undo Delete Toast Notification */}
      {showUndoToast && undoItem && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6 min-w-[320px] max-w-sm animate-fade-in font-sans">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm font-black shrink-0 border border-orange-500/25">
              {undoCountdown}s
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Đã xóa trang</span>
              <span className="text-sm font-extrabold text-white truncate max-w-[150px] mt-0.5">{undoItem.title}</span>
            </div>
          </div>
          <button
            onClick={handleUndoDelete}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-orange-500/10 active:scale-95 shrink-0"
          >
            Hoàn tác
          </button>
        </div>
      )}
    </div>
  );
}
