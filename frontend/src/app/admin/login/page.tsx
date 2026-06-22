"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useAppContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Vui lòng nhập đầy đủ tài khoản và mật khẩu! ⚠️");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Đăng nhập Admin thành công! 🔓");
        router.push("/admin");
      } else {
        setError(data.error || "Sai tài khoản hoặc mật khẩu");
        showToast("Đăng nhập thất bại! ❌");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Không thể kết nối đến máy chủ");
      showToast("Lỗi kết nối máy chủ! ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08080c] flex items-center justify-center font-sans p-6 overflow-hidden">
      {/* Background Cyberpunk Aura */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-600/15 pointer-events-none filter blur-[100px] -z-10 animate-pulse" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-zinc-800/20 pointer-events-none filter blur-[90px] -z-10 bottom-10 right-10" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0c0c12]/85 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-[0_20px_50px_rgba(255,87,34,0.05)] flex flex-col gap-6 relative">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-white/95 px-4 py-2 rounded-2xl flex items-center justify-center shadow-md max-w-[180px]">
            <img src="/omnishoe_logo_fixed.png" alt="OmniShoe Logo" width={96} height={32} className="h-8 object-contain" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase font-black tracking-widest bg-orange-500/20 text-orange-500 px-2.5 py-0.5 rounded-md border border-orange-500/30">
              CMS Portal
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            Hệ thống quản lý nội dung & sản phẩm OmniShoe
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
              Tài khoản (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-orange-500 text-zinc-100 placeholder-zinc-700 font-semibold"
                required
              />
              <i className="ti ti-user absolute left-3.5 top-3.5 text-zinc-500 text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
              Mật khẩu (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-orange-500 text-zinc-100 placeholder-zinc-700 font-semibold"
                required
              />
              <i className="ti ti-lock absolute left-3.5 top-3.5 text-zinc-500 text-sm" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm tracking-wider uppercase hover:bg-orange-600 transition-colors shadow-[0_0_20px_rgba(255,87,34,0.2)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="text-center mt-2 border-t border-zinc-900 pt-4">
          <a href="/" className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5">
            <i className="ti ti-arrow-left" />
            Quay lại Cửa hàng
          </a>
        </div>
      </div>
    </div>
  );
}
