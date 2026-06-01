"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  photoId: string;
  selectedSize: number;
  quantity: number;
  glowColor: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: any, size: number, quantity: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  toggleWishlist: (productId: number) => void;
  toast: { show: boolean; message: string };
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toast, setToast] = useState({ show: boolean; message: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("omni_cart");
    const savedWishlist = localStorage.getItem("omni_wishlist");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("omni_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("omni_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const addToCart = (product: any, size: number, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          photoId: product.photoId,
          selectedSize: size,
          quantity,
          glowColor: product.glowColor,
        },
      ];
    });
    showToast(`Đã thêm ${product.name} (Size ${size}) vào giỏ hàng! 🛒`);
  };

  const removeFromCart = (productId: number, size: number) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng 💔");
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Đã xóa khỏi danh sách yêu thích 💔");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Đã thêm vào danh sách yêu thích ❤️");
        return [...prev, productId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{ cart, wishlist, addToCart, removeFromCart, toggleWishlist, toast, showToast }}
    >
      {children}
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-black/85 backdrop-blur-md border border-orange-500/30 text-foreground px-6 py-4 rounded-[20px] shadow-[0_12px_30px_rgba(255,87,34,0.15)] flex items-center gap-3 animate-bounce text-xs font-black tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
