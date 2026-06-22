"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownDropProps {
  onShowToast: (msg: string) => void;
  config?: {
    countdownActive?: boolean;
    countdownBadge?: string;
    countdownTitle?: string;
    countdownDesc?: string;
    countdownImage?: string;
    countdownSneakerName?: string;
    countdownLimitTag?: string;
    countdownTargetDate?: string;
  };
}

export default function CountdownDrop({ onShowToast, config }: CountdownDropProps) {
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // Set the countdown target
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let targetDate: Date;
    
    if (config?.countdownTargetDate) {
      targetDate = new Date(config.countdownTargetDate);
    } else {
      // Fallback target date: 3 days from now
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      targetDate.setHours(targetDate.getHours() + 4);
    }

    const updateTimer = () => {
      const difference = +targetDate - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [config?.countdownTargetDate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsRegistered(true);
    onShowToast("Đã đăng ký nhắc nhở thành công! 🔔 Bạn sẽ nhận được thông báo sớm nhất.");
    setEmail("");
  };

  // Helper to format numbers to 2 digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  if (config?.countdownActive === false) {
    return null;
  }

  const badgeText = config?.countdownBadge || "Limited Drop";
  const titleText = config?.countdownTitle || "AIR JORDAN 1 RETRO CHICAGO";
  const descText = config?.countdownDesc || "Phiên bản tái hiện trọn vẹn phối màu huyền thoại năm 1985 với lớp chất liệu da nứt cổ điển kết hợp đế vintage ngả vàng. Mẫu sneaker mang giá trị lịch sử cao nhất của nền văn hóa sát mặt đất sắp có mặt tại OmniShoe.";
  const productImage = config?.countdownImage || "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80";
  const sneakerName = config?.countdownSneakerName || "Jordan 1 Retro High Chicago";
  const limitTag = config?.countdownLimitTag || "85 đôi tại Việt Nam";

  return (
    <section className="relative overflow-hidden rounded-2xl md:rounded-[32px] border border-border-color bg-gradient-to-br from-card-background via-black to-card-background p-5 md:p-12 my-16 mx-4 lg:mx-auto max-w-[1440px]">
      {/* Background Neon Glowing Spot */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Visual Hype Product */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[300px]">
          {/* Neon Glow Circle Behind Sneaker */}
          <div className="absolute w-[260px] h-[260px] rounded-full bg-accent/20 filter blur-[60px] -z-10" />

          {/* Floating Sneaker */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [-14, -12, -14],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full max-w-[380px] drop-shadow-[0_35px_35px_rgba(255,87,34,0.3)] cursor-pointer"
          >
            <img
              src={productImage}
              alt={sneakerName}
              width={480}
              height={320}
              className="w-full h-auto object-contain transform scale-110"
              style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }}
            />
          </motion.div>

          {/* Product Floating Tag */}
          <div className="absolute bottom-2 left-4 bg-black/80 border border-white/10 backdrop-blur-md py-2.5 px-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            <div className="text-left">
              <p className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">Số lượng cực giới hạn</p>
              <h4 className="text-sm font-bold text-white">{limitTag}</h4>
            </div>
          </div>
        </div>

        {/* Right Column: Content & Countdown */}
        <div className="lg:col-span-7 flex flex-col text-left justify-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 self-start py-1 px-3.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-black tracking-wider uppercase">
              <i className="ti ti-flame animate-bounce"></i> {badgeText}
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-none tracking-tight">
              {/* Support highlighting text enclosed in double quotes dynamically */}
              {(() => {
                const parts = titleText.split(/("[^"]*")/);
                return parts.map((part, index) => 
                  part.startsWith("\"") && part.endsWith("\"")
                    ? <span key={index} className="text-accent">{part}</span>
                    : part
                );
              })()}
            </h2>
          </div>

          <p className="text-text-muted leading-relaxed max-w-[620px] text-sm md:text-base">
            {descText}
          </p>

          {/* Countdown Clock Container */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 my-2 max-w-[360px] sm:max-w-[400px]">
            {[
              { label: "Ngày", value: timeLeft.days },
              { label: "Giờ", value: timeLeft.hours },
              { label: "Phút", value: timeLeft.minutes },
              { label: "Giây", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-bg-secondary/60 border border-border-color backdrop-blur-sm py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl w-full min-w-0"
              >
                <span className="text-xl sm:text-3xl font-black text-foreground font-mono leading-none tracking-tight">
                  {formatNumber(item.value)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-text-muted font-bold tracking-wider uppercase mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form registration */}
          <div className="border-t border-border-color pt-6 max-w-[550px]">
            <p className="text-xs text-text-muted font-semibold mb-3 tracking-wide">
              ĐĂNG KÝ EMAIL NHẬN THÔNG BÁO MỞ BÁN TRƯỚC 15 PHÚT:
            </p>
            
            {isRegistered ? (
              <div className="py-3 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold text-sm flex items-center gap-2">
                <i className="ti ti-circle-check text-lg"></i>
                Đăng ký thành công! Hệ thống sẽ thông báo ngay khi sự kiện diễn ra.
              </div>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="flex-grow bg-bg-secondary border border-border-color focus:border-accent rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-text-muted outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  className="bg-accent hover:bg-[#e54e1b] active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-accent/25"
                >
                  Nhắc tôi <i className="ti ti-bell-ringing"></i>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
