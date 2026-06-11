"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  // Calculate stats
  const totalProducts = products.length;
  const uniqueBrands = new Set(products.map((p) => p.brand)).size;
  const avgRating = totalProducts
    ? (products.reduce((acc, p) => acc + p.rating, 0) / totalProducts).toFixed(1)
    : "0.0";
  const uniqueCategories = new Set(products.map((p) => p.category)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-[#fff0e6] border border-orange-500/10 p-8 rounded-3xl flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-zinc-800 uppercase tracking-wide">
          Chào mừng trở lại, <span className="text-orange-500">Admin!</span>
        </h2>
        <p className="text-sm text-zinc-600 max-w-xl leading-relaxed font-medium">
          Hệ thống CMS giúp bạn dễ dàng cập nhật các dòng sneaker hot nhất, theo dõi thương hiệu và điều chỉnh giá bán của OmniShoe.
        </p>
        <div className="absolute right-10 bottom-0 opacity-10 pointer-events-none hidden md:block">
          <i className="ti ti-shoe text-[180px] text-orange-500 rotate-12" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Sản phẩm", value: totalProducts, icon: "ti-shoe", color: "text-orange-500" },
          { title: "Thương hiệu", value: uniqueBrands, icon: "ti-brand-nike", color: "text-blue-500" },
          { title: "Đánh giá TB", value: `${avgRating} ★`, icon: "ti-star", color: "text-amber-500" },
          { title: "Danh mục", value: uniqueCategories, icon: "ti-category", color: "text-emerald-500" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white border border-zinc-200/60 p-6 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                {stat.title}
              </span>
              <span className="text-3xl font-extrabold text-zinc-800">{stat.value}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200/40 flex items-center justify-center">
              <i className={`ti ${stat.icon} ${stat.color} text-xl`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="font-extrabold text-base uppercase tracking-wider text-zinc-800">
              Sản phẩm mới thêm gần đây
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-orange-500 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {products.slice(-4).reverse().map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 border border-zinc-200/40 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={
                        product.photoId.startsWith("/") || product.photoId.startsWith("http")
                          ? product.photoId
                          : `https://images.unsplash.com/${product.photoId}?w=120&q=80`
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=120&q=80";
                      }}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-zinc-800 leading-tight">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                      {product.brand} • {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-sm font-black text-orange-500">{product.price}</span>
                  <span className="text-[10px] text-zinc-500">ID: #{product.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="font-extrabold text-base uppercase tracking-wider text-zinc-800">
              Thao tác nhanh
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 font-bold text-sm text-center justify-center shadow-[0_4px_12px_rgba(255,87,34,0.15)]"
            >
              <i className="ti ti-plus text-lg" />
              Thêm giày mới
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300 font-bold text-sm text-center justify-center"
            >
              <i className="ti ti-list text-lg" />
              Quản lý sản phẩm
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300 font-bold text-sm text-center justify-center"
            >
              <i className="ti ti-external-link text-lg" />
              Xem trang chủ Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
