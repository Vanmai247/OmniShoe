"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { showToast } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    brand: "Nike",
    customBrand: "",
    price: "",
    oldPrice: "",
    category: "Lifestyle",
    badge: "",
    photoId: "",
    glowColor: "rgba(255, 255, 255, 0.45)",
    description: "",
    materials: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Kích thước file ảnh quá lớn (vui lòng chọn file dưới 5MB) ⚠️");
      showToast("Kích thước file ảnh không được vượt quá 5MB! ⚠️");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formDataPayload = new FormData();
    formDataPayload.append("file", file);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formDataPayload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, photoId: data.url }));
        showToast("Tải ảnh lên máy chủ thành công! 📸");
      } else {
        const err = await res.json();
        setUploadError(err.error || "Không thể upload ảnh lên máy chủ");
        showToast("Lỗi khi tải ảnh lên! ❌");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Lỗi kết nối máy chủ khi upload");
      showToast("Lỗi kết nối tải ảnh! ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photoId: "" }));
    setUploadError("");
  };

  const brands = ["Nike", "Adidas", "Jordan", "Puma", "New Balance", "Converse", "Vans", "MLB", "Khác"];
  const categories = ["Lifestyle", "Running", "Basketball", "Skateboarding"];
  const sizeOptions = [38, 39, 40, 41, 42, 43, 44, 45];

  const glowPresets = [
    { label: "Trắng", value: "rgba(255, 255, 255, 0.45)" },
    { label: "Xanh dương", value: "rgba(0, 150, 255, 0.45)" },
    { label: "Xanh chuối", value: "rgba(132, 204, 22, 0.45)" },
    { label: "Xanh lá", value: "rgba(52, 211, 153, 0.45)" },
    { label: "Cam Neon", value: "rgba(255, 107, 0, 0.45)" },
    { label: "Xám Bạc", value: "rgba(163, 163, 163, 0.45)" },
  ];

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        const isCustomBrand = !brands.includes(data.brand);
        setFormData({
          name: data.name || "",
          brand: isCustomBrand ? "Khác" : data.brand,
          customBrand: isCustomBrand ? data.brand : "",
          price: data.price ? data.price.replace(/[^\d]/g, "") : "",
          oldPrice: data.oldPrice ? data.oldPrice.replace(/[^\d]/g, "") : "",
          category: data.category || "Lifestyle",
          badge: data.badge || "",
          photoId: data.photoId || "",
          glowColor: data.glowColor || "rgba(255, 255, 255, 0.45)",
          description: data.description || "",
          materials: data.materials || "",
        });
        setSelectedSizes(data.sizes || []);
        const isUpload = data.photoId && data.photoId.startsWith("/uploads/");
        setImageMode(isUpload ? "upload" : "url");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        showToast("Không tìm thấy sản phẩm hoặc lỗi kết nối! ❌");
        router.push("/admin/products");
      });
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast("Vui lòng điền tên và giá sản phẩm! ⚠️");
      return;
    }

    setSubmitting(true);

    // Format price
    const numericPrice = formData.price.replace(/[^\d]/g, "");
    const formattedPrice = Number(numericPrice).toLocaleString("vi-VN") + "₫";

    let formattedOldPrice = "";
    if (formData.oldPrice) {
      const numericOldPrice = formData.oldPrice.replace(/[^\d]/g, "");
      formattedOldPrice = Number(numericOldPrice).toLocaleString("vi-VN") + "₫";
    }

    const finalBrand = formData.brand === "Khác" ? formData.customBrand : formData.brand;

    const payload = {
      name: formData.name,
      brand: finalBrand,
      price: formattedPrice,
      oldPrice: formattedOldPrice || null,
      category: formData.category,
      badge: formData.badge,
      photoId: formData.photoId,
      glowColor: formData.glowColor,
      description: formData.description,
      materials: formData.materials,
      sizes: selectedSizes,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Đã cập nhật sản phẩm thành công! 🎉");
        router.push("/admin/products");
      } else {
        const err = await res.json();
        showToast(`Lỗi: ${err.error || "Không thể cập nhật sản phẩm"} ❌`);
      }
    } catch (error) {
      console.error("Submit product error:", error);
      showToast("Lỗi kết nối khi gửi dữ liệu! ❌");
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
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white border border-zinc-200/60 p-8 rounded-3xl flex flex-col gap-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên sản phẩm */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Nike Air Max 97"
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
              required
            />
          </div>

          {/* Thương hiệu */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Thương hiệu
            </label>
            <div className="flex gap-2">
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold cursor-pointer w-1/2"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {formData.brand === "Khác" && (
                <input
                  type="text"
                  name="customBrand"
                  value={formData.customBrand}
                  onChange={handleInputChange}
                  placeholder="Nhập tên hãng..."
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold w-1/2"
                  required
                />
              )}
            </div>
          </div>

          {/* Giá bán */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Giá bán (VND) *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Ví dụ: 1950000"
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
              required
            />
          </div>

          {/* Giá cũ (nếu có) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Giá cũ (VND - Không bắt buộc)
            </label>
            <input
              type="text"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleInputChange}
              placeholder="Ví dụ: 2500000"
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
            />
          </div>

          {/* Danh mục */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Badge */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Badge nhãn (Ví dụ: Hot, Limited, Sale -10%)
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleInputChange}
              placeholder="Không bắt buộc"
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
            />
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="flex flex-col gap-3.5 md:col-span-2 border border-zinc-200/50 p-6 rounded-2xl bg-zinc-50/50">
            <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3">
              <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                Hình ảnh sản phẩm *
              </label>
              {/* Tab Selector */}
              <div className="flex bg-zinc-200/60 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    imageMode === "upload"
                      ? "bg-white text-zinc-800 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <i className="ti ti-upload mr-1 text-sm" /> Tải lên từ máy tính
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    imageMode === "url"
                      ? "bg-white text-zinc-800 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <i className="ti ti-link mr-1 text-sm" /> Dán link URL
                </button>
              </div>
            </div>

            {/* Mode 1: Upload File */}
            {imageMode === "upload" && (
              <div className="flex flex-col gap-3">
                {!formData.photoId ? (
                  <label className="border-2 border-dashed border-zinc-300 hover:border-orange-400 bg-white transition-colors duration-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-[160px] text-center shadow-inner group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-zinc-500 animate-pulse">Đang tải ảnh lên máy chủ...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-orange-100">
                          <i className="ti ti-camera-plus text-xl" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-zinc-700">Kéo thả ảnh vào đây hoặc nhấp để chọn</span>
                          <span className="text-[10px] text-zinc-400 font-semibold">Chấp nhận JPG, PNG, WEBP (Tối đa 5MB)</span>
                        </div>
                      </>
                    )}
                  </label>
                ) : (
                  /* Preview Uploaded Image */
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm w-fit max-w-full">
                    <div className="relative w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={formData.photoId}
                        alt="Preview upload"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 pr-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Ảnh đã tải lên</span>
                      <span className="text-xs font-semibold text-zinc-800 truncate max-w-[200px]" title={formData.photoId}>
                        {formData.photoId.split("/").pop()}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 mt-1 cursor-pointer w-fit"
                      >
                        <i className="ti ti-trash" /> Xóa và chọn ảnh khác
                      </button>
                    </div>
                  </div>
                )}
                {uploadError && (
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {uploadError}
                  </span>
                )}
              </div>
            )}

            {/* Mode 2: Dán Link URL */}
            {imageMode === "url" && (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="photoId"
                  value={formData.photoId}
                  onChange={handleInputChange}
                  placeholder="Nhập link ảnh (ví dụ: https://images.unsplash.com/... hoặc /Nike_4.png)"
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
                />
                
                {formData.photoId && (
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm w-fit max-w-full">
                    <div className="relative w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={formData.photoId.startsWith("http") || formData.photoId.startsWith("/") ? formData.photoId : `https://images.unsplash.com/${formData.photoId}?auto=format&fit=crop&w=400&q=80`}
                        alt="Preview URL"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/nike-highres-500x500.jpg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Xem trước liên kết</span>
                      <span className="text-xs font-semibold text-zinc-400 truncate max-w-[200px]" title={formData.photoId}>
                        {formData.photoId}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 mt-1 cursor-pointer w-fit"
                      >
                        <i className="ti ti-trash" /> Xóa liên kết
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Glow Color */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Màu Neon phát sáng (Glow Color)
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                name="glowColor"
                value={formData.glowColor}
                onChange={handleInputChange}
                placeholder="rgba(255, 255, 255, 0.45)"
                className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold flex-grow"
              />
              {/* Color circles */}
              <div className="flex gap-2">
                {glowPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, glowColor: preset.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.glowColor === preset.value ? "border-orange-500 scale-110" : "border-zinc-200"
                    }`}
                    style={{
                      backgroundColor: preset.value,
                      boxShadow: `0 0 6px ${preset.value}`,
                    }}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Size giày hỗ trợ *
            </label>
            <div className="flex flex-wrap gap-2.5">
              {sizeOptions.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all border ${
                      isSelected
                        ? "bg-orange-500 border-orange-500 text-white shadow-[0_4px_10px_rgba(255,87,34,0.3)]"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chất liệu */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Chất liệu chế tạo
            </label>
            <input
              type="text"
              name="materials"
              value={formData.materials}
              onChange={handleInputChange}
              placeholder="Ví dụ: Da lộn Premium, Đế cao su waffle"
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-semibold"
            />
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Giới thiệu về đôi giày..."
              className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-zinc-800 font-medium leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Submit Dock */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-6 mt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors text-sm font-bold"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(255,87,34,0.15)] text-sm flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>Lưu thay đổi</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
