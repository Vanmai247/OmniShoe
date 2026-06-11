"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useAppContext();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        showToast("Đã đăng xuất tài khoản admin! 🔒");
        router.push("/admin/login");
      } else {
        showToast("Lỗi khi đăng xuất! ❌");
      }
    } catch (e) {
      console.error("Logout error:", e);
      showToast("Lỗi kết nối khi đăng xuất! ❌");
    }
  };

  const menuItems = [
    { name: "Tổng quan", path: "/admin", icon: "ti-dashboard" },
    { name: "Sản phẩm", path: "/admin/products", icon: "ti-shoe" },
    { name: "Thêm sản phẩm", path: "/admin/products/new", icon: "ti-plus" },
    { name: "Thư viện Media", path: "/admin/media", icon: "ti-photo-video" },
    { name: "Quản lý trang", path: "/admin/pages", icon: "ti-files" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-zinc-800 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-[#0c0c12] p-6 flex flex-col shrink-0 text-zinc-100">
        {/* Brand Logo */}
        <div className="mb-10 flex items-center gap-3">
          <Link href="/" className="flex-1">
            <div className="bg-white/95 hover:bg-white transition-all duration-300 px-3 py-2 rounded-2xl flex items-center justify-center shadow-md hover:scale-[1.03] active:scale-[0.98]">
              <img 
                src="/omnishoe_logo_fixed.png" 
                alt="OmniShoe" 
                className="h-7 w-auto object-contain" 
              />
            </div>
          </Link>
          <span className="text-[10px] uppercase font-black tracking-widest bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-md border border-orange-500/30 shrink-0">
            Admin
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,87,34,0.3)]"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <i className={`ti ${item.icon} text-lg`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <i className="ti ti-arrow-left text-base" />
            Vào cửa hàng
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left w-full cursor-pointer"
          >
            <i className="ti ti-logout text-base" />
            Đăng xuất
          </button>
          <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider text-center mt-2">
            OmniShoe CMS v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="font-extrabold text-lg tracking-wider text-zinc-800 uppercase">
            {pathname === "/admin"
              ? "Bảng điều khiển tổng quan"
              : pathname.includes("/products/new")
              ? "Thêm sản phẩm mới"
              : pathname.includes("/products/edit")
              ? "Chỉnh sửa sản phẩm"
              : pathname.includes("/pages/edit")
              ? "Chỉnh sửa trang"
              : pathname.includes("/pages")
              ? "Quản lý trang"
              : pathname.includes("/media")
              ? "Thư viện Media"
              : "Quản lý sản phẩm"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-500">Server Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 md:p-10 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
