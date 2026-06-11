"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  rating: number;
  reviews: number;
  badge: string;
  photoId: string;
  category: string;
  glowColor: string;
  sizes: number[];
}

export default function AdminProductsPage() {
  const { showToast } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");

  // Delete product modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Undo state
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoItem, setUndoItem] = useState<Product | null>(null);
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

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        showToast("Lỗi tải danh sách sản phẩm! ❌");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const triggerDeleteConfirm = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;

    // Find product details for backup
    const productBackup = products.find((p) => p.id === id);
    if (!productBackup) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);

        // Trigger undo toast
        setUndoItem(productBackup);
        setUndoCountdown(5);
        setShowUndoToast(true);

        loadProducts();
      } else {
        const errorData = await res.json();
        showToast(`Lỗi: ${errorData.error || "Không thể xóa sản phẩm"} ❌`);
      }
    } catch (e) {
      console.error("Delete product error:", e);
      showToast("Lỗi kết nối khi xóa sản phẩm! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndoDelete = async () => {
    if (!undoItem) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(undoItem),
      });

      if (res.ok) {
        showToast("Đã khôi phục sản phẩm thành công! ↩️");
        setShowUndoToast(false);
        setUndoItem(null);
        loadProducts();
      } else {
        const errorData = await res.json();
        showToast(`Không thể hoàn tác: ${errorData.error || "Lỗi khôi phục"} ❌`);
      }
    } catch (e) {
      console.error("Undo delete error:", e);
      showToast("Lỗi kết nối khi hoàn tác! ❌");
    }
  };

  // Brands list for filter
  const brands = ["Tất cả", ...Array.from(new Set(products.map((p) => p.brand)))];

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "Tất cả" || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-sm">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm tên hoặc hãng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 placeholder-zinc-400 font-semibold"
            />
            <i className="ti ti-search absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
          </div>
          {/* Brand select */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full sm:w-auto bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold cursor-pointer"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-sm tracking-wide hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(255,87,34,0.15)] whitespace-nowrap text-center justify-center"
        >
          <i className="ti ti-plus text-base" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[10px] uppercase font-black tracking-widest text-zinc-500">
                  <th className="py-4 px-6 w-16 text-center">ID</th>
                  <th className="py-4 px-6 w-24">Hình ảnh</th>
                  <th className="py-4 px-6">Tên sản phẩm</th>
                  <th className="py-4 px-6 w-32">Thương hiệu</th>
                  <th className="py-4 px-6 w-32">Danh mục</th>
                  <th className="py-4 px-6 w-36">Giá bán</th>
                  <th className="py-4 px-6 w-24 text-center">Glow Color</th>
                  <th className="py-4 px-6 w-44 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50/40 transition-colors text-sm font-semibold text-zinc-700"
                  >
                    <td className="py-4 px-6 text-center font-bold text-zinc-400">#{p.id}</td>
                    <td className="py-4 px-6">
                      <div className="w-14 h-14 rounded-lg bg-zinc-50 border border-zinc-200/60 p-1 flex items-center justify-center">
                        <img
                          src={
                            p.photoId.startsWith("/") || p.photoId.startsWith("http")
                              ? p.photoId
                              : `https://images.unsplash.com/${p.photoId}?w=120&q=80`
                          }
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=120&q=80";
                          }}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800 font-extrabold">{p.name}</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                          Sizes: {p.sizes?.join(", ")}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 uppercase text-xs font-bold text-orange-500 tracking-wider">
                      {p.brand}
                    </td>
                    <td className="py-4 px-6 text-zinc-500">{p.category}</td>
                    <td className="py-4 px-6 font-black text-zinc-900">{p.price}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className="w-5 h-5 rounded-full border border-zinc-200 relative"
                          style={{
                            backgroundColor: p.glowColor.includes("rgba") ? p.glowColor : "#fff",
                            boxShadow: `0 0 8px ${p.glowColor}`,
                          }}
                          title={p.glowColor}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all text-xs font-bold"
                        >
                          <i className="ti ti-edit text-sm" />
                          Sửa
                        </Link>
                        <button
                          onClick={() => triggerDeleteConfirm(p.id, p.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50/50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500 text-rose-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                        >
                          <i className="ti ti-trash text-sm" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-400 font-bold">
            Không tìm thấy sản phẩm nào!
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 flex flex-col gap-5 text-center items-center font-sans">
            
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
              <i className="ti ti-alert-triangle text-2xl" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tight">
                Xác nhận xóa sản phẩm?
              </h3>
              <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-semibold">
                Bạn có chắc chắn muốn xóa sản phẩm <strong className="text-zinc-800 font-black">"{productToDelete.name}"</strong>? 
                Thao tác này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống và không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full border-t border-zinc-100 pt-4 mt-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeDelete}
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
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Đã xóa sản phẩm</span>
              <span className="text-sm font-extrabold text-white truncate max-w-[150px] mt-0.5">{undoItem.name}</span>
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
