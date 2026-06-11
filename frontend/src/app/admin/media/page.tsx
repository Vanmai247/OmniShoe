"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

interface MediaItem {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  type: "image" | "video" | "other";
}

export default function MediaLibraryPage() {
  const { showToast } = useAppContext();
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  
  // Confirm delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch list of media files
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      } else {
        showToast("Lỗi khi tải danh sách media! ❌");
      }
    } catch (error) {
      console.error("Fetch media error:", error);
      showToast("Lỗi kết nối khi tải danh sách media! ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Format bytes to human readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Upload file logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const isVid = file.type.startsWith("video/");
    const maxSize = isVid ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB for video, 5MB for image
    
    if (file.size > maxSize) {
      const sizeLimitStr = isVid ? "20MB" : "5MB";
      showToast(`Kích thước file vượt quá giới hạn (${sizeLimitStr})! ⚠️`);
      setUploadError(`File ${file.name} quá lớn (Tối đa: ${sizeLimitStr}) ⚠️`);
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("Tải file lên thư viện thành công! 📸");
        fetchMedia();
      } else {
        const err = await res.json();
        setUploadError(err.error || "Lỗi tải tệp lên");
        showToast("Tải tệp lên thất bại! ❌");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Lỗi kết nối máy chủ");
      showToast("Lỗi kết nối khi tải tệp! ❌");
    } finally {
      setUploading(false);
    }
  };

  // Copy URL link to clipboard
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("Đã sao chép liên kết vào bộ nhớ tạm! 📋");
  };

  // Delete file logic
  const handleDeleteFile = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media?file=${encodeURIComponent(deleteTarget.name)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Đã xóa file vĩnh viễn! 🗑️");
        setMediaList((prev) => prev.filter((item) => item.name !== deleteTarget.name));
        setDeleteTarget(null);
      } else {
        const err = await res.json();
        showToast(`Lỗi: ${err.error || "Không thể xóa file"} ❌`);
      }
    } catch (error) {
      console.error("Delete media error:", error);
      showToast("Lỗi kết nối khi xóa file! ❌");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered media list
  const filteredList = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-800 tracking-tight">THƯ VIỆN MEDIA</h1>
          <p className="text-xs text-zinc-500 font-semibold mt-1">
            Quản lý và sao chép liên kết hình ảnh, video sản phẩm lưu trữ trên máy chủ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Upload Side Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white border border-zinc-200/60 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black text-zinc-700 uppercase tracking-wider">Tải lên file mới</h3>
            <label className="border-2 border-dashed border-zinc-300 hover:border-orange-500 bg-zinc-50/50 hover:bg-white transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center min-h-[160px] group shadow-inner">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-zinc-500 animate-pulse">Đang tải lên...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-orange-100 shadow-sm">
                    <i className="ti ti-upload text-lg" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-zinc-700">Chọn hoặc Kéo ảnh/video</span>
                    <span className="text-[9px] text-zinc-400 font-bold leading-normal">
                      Ảnh tối đa: 5MB<br />Video tối đa: 20MB
                    </span>
                  </div>
                </>
              )}
            </label>
            {uploadError && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {uploadError}
              </span>
            )}
          </div>
        </div>

        {/* Gallery Library Grid */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="bg-white border border-zinc-200/60 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Tab Filter */}
            <div className="flex bg-zinc-100 p-0.5 rounded-xl text-xs font-bold w-fit">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "all"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Tất cả ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("image")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "image"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Hình ảnh ({mediaList.filter(m => m.type === "image").length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("video")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "video"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Video ({mediaList.filter(m => m.type === "video").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm tên tệp tin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 pl-9 text-xs focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-800 font-semibold"
              />
              <i className="ti ti-search absolute left-3 top-2.5 text-zinc-400 text-sm" />
            </div>
          </div>

          {/* Media Items */}
          {loading ? (
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-16 flex justify-center items-center shadow-sm min-h-[300px]">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-16 flex flex-col justify-center items-center gap-3 text-center shadow-sm min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center text-xl">
                <i className="ti ti-photo-off" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-700">Thư viện trống</h4>
                <p className="text-xs text-zinc-400 font-semibold mt-1">Chưa có tệp tin nào khớp với bộ lọc của bạn.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredList.map((item) => (
                <div key={item.name} className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
                  {/* Thumbnail Wrapper */}
                  <div className="aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden border-b border-zinc-100 relative">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : item.type === "video" ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover p-1"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white group-hover:bg-black/20 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/10 group-hover:scale-110 transition-transform">
                            <i className="ti ti-player-play text-lg translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-[8px] font-black text-white uppercase tracking-wider">
                          Video
                        </span>
                      </div>
                    ) : (
                      <i className="ti ti-file text-4xl text-zinc-400" />
                    )}

                    {/* Copy Link overlay button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(item.url)}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-orange-600 shadow-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <i className="ti ti-copy" /> Copy URL
                      </button>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-3.5 flex flex-col gap-1 flex-grow">
                    <span className="text-xs font-bold text-zinc-800 truncate" title={item.name}>
                      {item.name}
                    </span>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-semibold text-zinc-400">
                      <span>{formatBytes(item.size)}</span>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="text-rose-400 hover:text-rose-600 transition-colors p-1 flex items-center justify-center cursor-pointer rounded hover:bg-rose-50"
                        title="Xóa tệp tin"
                      >
                        <i className="ti ti-trash text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Popup Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-zinc-200/50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl shadow-inner">
              <i className="ti ti-alert-triangle" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-800">Xác nhận xóa tệp tin?</h3>
              <p className="text-xs text-zinc-500 font-semibold mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa file <strong className="text-zinc-700">{deleteTarget.name}</strong> không? Hành động này sẽ xóa file vật lý khỏi máy chủ và không thể khôi phục!
              </p>
            </div>
            <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteFile}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>Đồng ý xóa</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
