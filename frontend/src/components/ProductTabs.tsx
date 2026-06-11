"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: number;
  description: string;
  materials: string;
  rating: number;
  reviews: number;
  reviewsList?: Review[];
}

// Inline SVG Star Component to guarantee 100% visibility without relying on network CDNs
const StarIcon = ({ filled, className = "w-4 h-4" }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function ProductTabs({ product, pageConfig }: { product: any; pageConfig?: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("desc");

  // Local state for list of reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "desc", label: "Mô tả" },
    { id: "specs", label: "Thông số chi tiết" },
    { id: "reviews", label: `Đánh giá thực tế (${product.reviews || 0})` },
  ];

  // Initialize and Seed reviews dynamically for demo products
  useEffect(() => {
    if (product.reviewsList && product.reviewsList.length > 0) {
      setReviews(product.reviewsList);
    } else if (product.reviews && product.reviews > 0) {
      // Seeding fake reviews if product has counts but no reviewsList in JSON
      const seeds: Review[] = [
        {
          id: "seed-1",
          name: "Quốc Hùng",
          rating: 5,
          comment: "Mẫu giày đẹp hơn cả trên ảnh, da mềm ôm chân vừa vặn, tag mác hộp chính hãng thơm phức.",
          createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: "seed-2",
          name: "Phương Linh",
          rating: 5,
          comment: "Đổi trả nhanh lắm, đôi trước chật size shop cho shipper đổi ngay tại nhà trong 1 ngày.",
          createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: "seed-3",
          name: "Minh Tuấn",
          rating: 4,
          comment: "Giày đi êm chân, đúng size, giao hàng hơi lâu một chút nhưng shop tư vấn nhiệt tình.",
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
      ];
      // Format seed rating matching product rating average
      const ratingFloor = Math.floor(product.rating || 5);
      const productSeeds = seeds.map((s) => ({ ...s, rating: ratingFloor }));
      setReviews(productSeeds.slice(0, Math.min(product.reviews, 3)));
    } else {
      setReviews([]);
    }
  }, [product]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      setErrorMessage("Vui lòng điền tên và nhận xét của bạn! ⚠️");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          rating: formRating,
          comment: formComment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Append newly created review to top
        setReviews((prev) => [data.review, ...prev]);
        
        // Reset form inputs
        setFormName("");
        setFormComment("");
        setFormRating(5);
        
        setSuccessMessage("Đã gửi đánh giá của bạn thành công! Cảm ơn bạn! 🎉");
        
        // Refresh Next.js server component dynamically to update average stars on detail page
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Gửi đánh giá thất bại.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setErrorMessage("Lỗi kết nối máy chủ! Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper helper to get percentage of stars for stats representation
  const getStarPercentage = (starNum: number) => {
    if (reviews.length === 0) return 0;
    const count = reviews.filter((r) => r.rating === starNum).length;
    return Math.round((count / reviews.length) * 100);
  };

  return (
    <div className="w-full text-left">
      {/* Tabs Headers */}
      <div className="flex gap-8 border-b border-border-color pb-3 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-black uppercase tracking-wider relative transition-colors ${
              activeTab === tab.id ? "text-accent" : "text-text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-[-14px] inset-x-0 h-1 bg-accent rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels container */}
      <div className="py-6">
        <AnimatePresence mode="wait">
          {activeTab === "desc" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-xs md:text-sm text-text-muted leading-relaxed font-semibold"
            >
              {product.description || "Không có mô tả chi tiết cho sản phẩm này."}
            </motion.div>
          )}

          {activeTab === "specs" && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-xs md:text-sm text-text-muted leading-relaxed"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">Chất liệu:</span> {product.materials || "Chưa cập nhật"}
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">Phân nhóm:</span> Sneaker Sportwear
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">{pageConfig?.content?.policyWarrantyTitle || "Bảo hành"}:</span> {pageConfig?.content?.policyWarrantyDesc || "Chính hãng 100% (Đền gấp 10 lần)"}
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">{pageConfig?.content?.policyReturnTitle || "Hỗ trợ"}:</span> {pageConfig?.content?.policyReturnDesc || "Đổi size 30 ngày tận nhà"}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Left Column: Review Summary & Write Form */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                {/* Stats Summary */}
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex flex-col gap-4">
                  <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider">Tổng quan đánh giá</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-foreground">{product.rating || 5.0}</span>
                    <div className="flex flex-col">
                      <div className="flex text-amber-500 gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => {
                          const starVal = i + 1;
                          const isFilled = starVal <= Math.round(product.rating || 5);
                          return (
                            <StarIcon
                              key={i}
                              filled={isFilled}
                              className={`w-4 h-4 ${isFilled ? "text-amber-500" : "text-zinc-300"}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 mt-1">Dựa trên {product.reviews || 0} lượt đánh giá</span>
                    </div>
                  </div>
                  
                  {/* Star breakdown representation */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = getStarPercentage(star);
                      return (
                        <div key={star} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                          <span className="w-3 text-right">{star}★</span>
                          <div className="flex-grow h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form to submit review */}
                <form onSubmit={handleSubmitReview} className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
                  <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wider pb-2 border-b border-zinc-100">Gửi đánh giá của bạn</h4>
                  
                  {/* Rating Selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                      Chọn số sao *
                    </label>
                    <div className="flex gap-1.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating ?? formRating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                          >
                            <StarIcon
                              filled={isFilled}
                              className={`w-6 h-6 ${isFilled ? "text-amber-500" : "text-zinc-300"}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                      Tên của bạn *
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Comment field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                      Nhận xét sản phẩm *
                    </label>
                    <textarea
                      placeholder="Chia sẻ trải nghiệm thực tế của bạn..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      rows={3}
                      className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-800 font-semibold resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {errorMessage && (
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 p-2 rounded-xl border border-rose-100">
                      {errorMessage}
                    </span>
                  )}
                  {successMessage && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      {successMessage}
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-[11px] tracking-wider uppercase hover:bg-orange-600 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi đánh giá"
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: List of Reviews */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wider">Bình luận từ khách hàng</h4>
                {reviews.length === 0 ? (
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-10 flex flex-col justify-center items-center text-center gap-2">
                    <i className="ti ti-message-2-off text-2xl text-zinc-300" />
                    <div>
                      <span className="text-xs font-bold text-zinc-600 block">Chưa có đánh giá nào</span>
                      <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">Hãy là người đầu tiên trải nghiệm và gửi đánh giá cho đôi giày này!</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-zinc-100 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-black text-zinc-800">{rev.name}</span>
                            <div className="flex text-amber-500 gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  filled={i < rev.rating}
                                  className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-500" : "text-zinc-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-zinc-400">
                            {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold mt-2.5 bg-zinc-50 p-3 rounded-xl border border-zinc-100/50 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
