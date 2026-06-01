"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  description: string;
  materials: string;
}

export default function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("desc");

  const tabs = [
    { id: "desc", label: "Mô tả" },
    { id: "specs", label: "Thông số chi tiết" },
    { id: "reviews", label: "Đánh giá thực tế" },
  ];

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
              {product.description}
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
                  <span className="font-black uppercase text-foreground">Chất liệu:</span> {product.materials}
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">Phân nhóm:</span> Sneaker Sportwear
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">Bảo hành:</span> Chính hãng 100% (Đền gấp 10 lần)
                </div>
                <div className="border-b border-border-color/50 py-2">
                  <span className="font-black uppercase text-foreground">Hỗ trợ:</span> Đổi size 30 ngày tận nhà
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
              className="flex flex-col gap-6"
            >
              {[
                {
                  name: "Quốc Hùng",
                  rating: 5,
                  comment: "Mẫu giày đẹp hơn cả trên ảnh, da mềm ôm chân vừa vặn, tag mác hộp chính hãng thơm phức.",
                },
                {
                  name: "Phương Linh",
                  rating: 5,
                  comment: "Đổi trả nhanh lắm, đôi trước chật size shop cho shipper đổi ngay tại nhà trong 1 ngày.",
                },
              ].map((rev, idx) => (
                <div key={idx} className="border-b border-border-color/30 pb-4">
                  <div className="flex gap-2 text-amber-500 mb-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <i key={i} className="ti ti-star-filled text-xs"></i>
                    ))}
                  </div>
                  <span className="text-xs font-black text-foreground">{rev.name}</span>
                  <p className="text-xs text-text-muted font-bold mt-1">"{rev.comment}"</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
