"use client";

import React from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  photoId: string;
  glowColor: string;
}

export default function RelatedProducts({
  currentProduct,
  allProducts,
}: {
  currentProduct: Product;
  allProducts: Product[];
}) {
  const related = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 3); // Display top 3 alternatives

  return (
    <div className="w-full text-left">
      <h3 className="text-xl font-black uppercase mb-8">Có Thể Bạn Cũng Thích</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="bg-card-background border border-border-color p-6 rounded-[24px] hover:-translate-y-1 transition-all duration-300 block group"
          >
            <div className="relative aspect-[1.1] rounded-2xl overflow-hidden bg-bg-secondary flex items-center justify-center p-4">
              <img
                src={p.photoId.startsWith("/") ? p.photoId : `https://images.unsplash.com/${p.photoId}?w=480&q=80`}
                alt={p.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-accent font-black uppercase tracking-wider">{p.brand}</span>
              <h4 className="font-extrabold text-sm text-foreground truncate mt-1">{p.name}</h4>
              <span className="text-sm font-black text-accent block mt-2">{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
