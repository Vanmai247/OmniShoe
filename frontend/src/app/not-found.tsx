import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0c12] text-white relative z-0 p-6 font-sans">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-25 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/studio_light_bg.png')` }}
      />

      {/* Glow mesh */}
      <div className="absolute w-[350px] h-[350px] bg-[#FF6B00]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <span className="text-[120px] font-black leading-none text-[#FF6B00] drop-shadow-[0_0_35px_rgba(255,107,0,0.35)] tracking-tighter animate-pulse">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          Không Tìm Thấy Trang
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-semibold">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi. Hãy quay lại cửa hàng để tiếp tục săn lùng những đôi sneaker cực hot!
        </p>
        <Link
          href="/"
          className="mt-2 px-8 py-3.5 bg-[#FF6B00] hover:bg-[#e54e1b] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6B00]/25 flex items-center gap-2 cursor-pointer"
        >
          <i className="ti ti-arrow-left text-sm" /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
