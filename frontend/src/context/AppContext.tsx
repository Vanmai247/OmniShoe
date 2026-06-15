"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SessionProvider, signOut, useSession } from "next-auth/react";

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  photoId: string;
  selectedSize: number;
  quantity: number;
  glowColor: string;
  sizes?: number[];
}

export interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: number[];
  user: User | null;
  addToCart: (product: any, size: number, quantity: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  toggleWishlist: (productId: number) => void;
  toast: { show: boolean; message: string };
  showToast: (msg: string) => void;
  updateCartQuantity: (productId: number, size: number, change: number) => void;
  updateCartItemSize: (productId: number, oldSize: number, newSize: number) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppContextProviderWrapper>{children}</AppContextProviderWrapper>
    </SessionProvider>
  );
}

function AppContextProviderWrapper({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();

  // Sync NextAuth session with local context user state
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!user || user.email !== session.user.email) {
        setUser({
          email: session.user.email || "",
          name: session.user.name || "",
          avatar: session.user.image || "",
        });
      }
    } else if (status === "unauthenticated" && user) {
      setUser(null);
    }
  }, [session, status, user]);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("omni_cart");
    const savedWishlist = localStorage.getItem("omni_wishlist");
    const savedUser = localStorage.getItem("omni_user");
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
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
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

  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem("omni_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("omni_user");
      }
    }
  }, [user, mounted]);

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
          sizes: product.sizes,
        },
      ];
    });
    showToast(`Đã thêm ${product.name} (Size ${size}) vào giỏ hàng! 🛒`);
  };

  const removeFromCart = (productId: number, size: number) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng 💔");
  };

  const updateCartQuantity = (productId: number, size: number, change: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId && item.selectedSize === size) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const updateCartItemSize = (productId: number, oldSize: number, newSize: number) => {
    setCart((prev) => {
      const targetIndex = prev.findIndex(
        (item) => item.id === productId && item.selectedSize === newSize
      );
      const currentIndex = prev.findIndex(
        (item) => item.id === productId && item.selectedSize === oldSize
      );

      if (currentIndex === -1) return prev;

      const updated = [...prev];

      if (targetIndex > -1 && targetIndex !== currentIndex) {
        updated[targetIndex].quantity += updated[currentIndex].quantity;
        return updated.filter((_, idx) => idx !== currentIndex);
      } else {
        updated[currentIndex].selectedSize = newSize;
        return updated;
      }
    });
    showToast("Đã cập nhật size giày! 👟");
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

  const login = (email: string, name: string) => {
    // Generate avatar initials from name
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    
    setUser({
      email,
      name,
      avatar: initials || "US",
    });
    showToast(`Chào mừng quay trở lại, ${name}! ⚡`);
  };

  const logout = () => {
    signOut({ redirect: false });
    setUser(null);
    showToast("Đã đăng xuất tài khoản thành công! 👋");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        user,
        addToCart,
        removeFromCart,
        toggleWishlist,
        toast,
        showToast,
        updateCartQuantity,
        updateCartItemSize,
        login,
        logout,
      }}
    >
      {children}
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 150 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-24 right-6 z-[9999] bg-white/95 backdrop-blur-md border border-zinc-200/80 text-zinc-800 px-6 py-4 rounded-[20px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 text-xs font-black tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
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
