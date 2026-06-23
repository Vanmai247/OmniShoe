"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";

// Reusable Magnetic Button Wrapper Component
interface MagneticProps {
  children: React.ReactElement;
  range?: number;
}

function Magnetic({ children, range = 60 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      // Pull element towards cursor (magnet effect)
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      // Reset position
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="w-full flex justify-center"
    >
      {children}
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user, showToast } = useAppContext();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Yếu",
    color: "bg-red-500",
  });

  // Canvas ref for Confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas ref for Interactive Particles
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Particle System Hook
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates tracked locally for canvas loop
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMoveLocal = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeaveLocal = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMoveLocal);
    window.addEventListener("mouseleave", handleMouseLeaveLocal);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      originalVx: number;
      originalVy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        this.radius = Math.random() * 2 + 0.8;
        // 60% orange particles, 40% white particles
        if (Math.random() > 0.4) {
          const alpha = Math.random() * 0.35 + 0.15;
          this.color = `rgba(255, 107, 0, ${alpha})`;
        } else {
          const alpha = Math.random() * 0.25 + 0.08;
          this.color = `rgba(255, 255, 255, ${alpha})`;
        }
      }

      update() {
        // Friction / return to original velocity
        this.vx += (this.originalVx - this.vx) * 0.03;
        this.vy += (this.originalVy - this.vy) * 0.03;

        // Mouse interaction (repel force)
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 140; // interaction radius

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            // Push particle away from cursor
            this.vx += Math.cos(angle) * force * 1.8;
            this.vy += Math.sin(angle) * force * 1.8;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around borders
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 2;
        ctx.shadowColor = this.color.includes("255, 255") ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 107, 0, 0.4)";
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(75, Math.floor((width * height) / 20000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0; // Reset shadow blur for clean performance on lines

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = ((100 - dist) / 100) * 0.05; // very subtle lines
            ctx.strokeStyle = `rgba(255, 107, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMoveLocal);
      window.removeEventListener("mouseleave", handleMouseLeaveLocal);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Interactive background state (Parallax & spotlight mouse tracking)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Framer Motion values for 3D sneaker tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltSpringConfig = { stiffness: 120, damping: 20 };
  const springX = useSpring(mouseX, tiltSpringConfig);
  const springY = useSpring(mouseY, tiltSpringConfig);

  // Map mouse movement from screen boundaries to rotation angles (max 15 degrees)
  const rotateX = useTransform(springY, [-400, 400], [15, -15]);
  const rotateY = useTransform(springX, [-400, 400], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / 45;
      const moveY = (e.clientY - centerY) / 45;
      setParallaxOffset({ x: moveX, y: moveY });

      // Update motion values for sneaker tilt
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Trigger shake animation on error
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Check password strength
  useEffect(() => {
    if (isLogin || !password) {
      setPasswordStrength({ score: 0, label: "Yếu", color: "bg-red-500" });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Yếu";
    let color = "bg-red-500";

    if (score >= 4) {
      label = "Mạnh 🔥";
      color = "bg-green-500";
    } else if (score >= 2) {
      label = "Trung bình ⚡";
      color = "bg-amber-500";
    }

    setPasswordStrength({ score, label, color });
  }, [password, isLogin]);

  // Social Auth Action (Google Login integration)
  const handleSocialLogin = async (platform: string) => {
    if (platform === "Google") {
      setLoading(true);
      showToast("Đang kết nối với tài khoản Google... 📡");
      try {
        const result = await signIn("google", { redirect: false });
        if (result?.error) {
          setError(`Đăng nhập Google thất bại: ${result.error}`);
          setLoading(false);
        } else {
          // If successful, NextAuth will set the session, 
          // and AppContext's useSession hook will sync and redirect to "/"
          setSuccess(true);
          fireConfetti();
          setTimeout(() => {
            router.push("/");
          }, 1800);
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kết nối Google!");
        setLoading(false);
      }
    } else {
      // Mock other platform social logins
      setLoading(true);
      showToast(`Đang kết nối với tài khoản ${platform}... 📡`);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        login(`${platform.toLowerCase()}user@gmail.com`, `${platform} User`);
        fireConfetti();
        setTimeout(() => {
          router.push("/");
        }, 1800);
      }, 1200);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ các thông tin cần thiết!");
      triggerShake();
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Định dạng email không hợp lệ!");
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự!");
      triggerShake();
      return;
    }

    setLoading(true);

    if (isLogin) {
      try {
        await login(email, password);
        setLoading(false);
        setSuccess(true);
        fireConfetti();
        setTimeout(() => {
          router.push("/");
        }, 1800);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Đăng nhập thất bại!");
        triggerShake();
      }
    } else {
      if (!name) {
        setLoading(false);
        setError("Vui lòng nhập họ và tên của bạn!");
        triggerShake();
        return;
      }
      if (password !== confirmPassword) {
        setLoading(false);
        setError("Mật khẩu nhập lại không khớp!");
        triggerShake();
        return;
      }

      try {
        await register(email, password, name);
        setLoading(false);
        setSuccess(true);
        fireConfetti();
        setTimeout(() => {
          router.push("/");
        }, 1800);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Đăng ký thất bại!");
        triggerShake();
      }
    }
  };

  // Confetti Particle System
  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF6B00", "#FF9E00", "#FFFFFF", "#111111", "#FFA500"];
    const particles: any[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height + 20,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        vx: Math.random() * 15 - 7.5,
        vy: -(Math.random() * 15 + 10),
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;

      particles.forEach((p) => {
        p.vy += 0.25; // gravity
        p.x += p.vx;
        p.y += p.vy;

        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y < canvas.height) {
          active = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (active) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-zinc-800 flex relative overflow-hidden font-sans">
      {/* Background Image Overlay with Parallax */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-center bg-cover bg-no-repeat scale-105 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`, // Thay bằng ảnh bạn chọn, ví dụ: '/login-bg.jpg'
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
          opacity: 0.8, // Tăng độ mờ của ảnh nền lên 80% để hiển thị rõ nét hơn
        }}
      />
      {/* Canvas for Interactive Particles */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />
      {/* Interactive Spotlight tracking mouse cursor */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 107, 0, 0.2), transparent 75%)`, // Tăng độ nổi bật của vệt sáng theo chuột
        }}
      />
      {/* Dark Overlay to make the background darker */}
      <div className="absolute inset-0 z-0 bg-[#08080C]/45 pointer-events-none" />

      {/* Canvas for Success Confetti */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none w-full h-full"
      />

      {/* Top Header: Logo Left, Back Button Right */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 lg:top-10 lg:left-12 z-20 bg-white/95 px-4 py-2.5 rounded-2xl flex items-center justify-center shadow-md select-none">
        <img
          src="/omnishoe_logo_fixed.png"
          alt="OmniShoe Logo"
          width={144}
          height={48}
          className="h-10 md:h-12 object-contain"
        />
      </div>

      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 lg:top-10 lg:right-12 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
        >
          Về trang chủ
          <i className="ti ti-arrow-right group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F3F4F6]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white border border-orange-500/20 p-10 rounded-[32px] max-w-sm w-full flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.3)] relative">
                <motion.i
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="ti ti-check text-white text-4xl font-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black uppercase tracking-wider text-zinc-900">
                  Thành công!
                </h3>
                <p className="text-xs text-zinc-600 font-semibold leading-relaxed">
                  Đăng nhập thành công. Đang đưa bạn trở lại thế giới sneaker của OmniShoe...
                </p>
              </div>
              <div className="w-12 h-1 bg-zinc-200 rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-orange-500 rounded-full w-full origin-left animate-[loading_1.5s_ease-in-out_infinite]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left side: Form Column (Centered, spans full width) */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        {/* Dynamic backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-orange-600/10 pointer-events-none filter blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-orange-500/5 pointer-events-none filter blur-[100px]" />

        {/* Spacing for layout alignment */}
        <div className="w-full max-w-md mb-8 h-10 lg:h-12" />

        {/* Form Container Card */}
        <motion.div
          animate={
            shake
              ? { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } }
              : {}
          }
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full max-w-md bg-[#0d0d0d]/40 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col gap-6 text-white"
        >
          {/* Header titles */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </h2>
            <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
              {isLogin
                ? "Khám phá các bộ sưu tập sneaker cực giới hạn dành riêng cho bạn."
                : "Tham gia cộng đồng Sneakerhead OmniShoe và nhận ngay mã giảm giá 10%."}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              {error}
            </motion.div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name for registration */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                  Họ và tên
                </label>
                <div className="input-glow-container">
                  <div className="input-inner relative flex items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-transparent px-4 py-3.5 pl-10 text-sm focus:outline-none text-white placeholder-zinc-500 font-semibold border-none outline-none focus:ring-0"
                      required
                    />
                    <i className="ti ti-user absolute left-3.5 text-zinc-400 text-base" />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Địa chỉ Email
              </label>
              <div className="input-glow-container">
                <div className="input-inner relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent px-4 py-3.5 pl-10 text-sm focus:outline-none text-white placeholder-zinc-500 font-semibold border-none outline-none focus:ring-0"
                    required
                  />
                  <i className="ti ti-mail absolute left-3.5 text-zinc-400 text-base" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                  Mật khẩu
                </label>
                {isLogin && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Chức năng khôi phục mật khẩu đang được nâng cấp!");
                    }}
                    className="text-[10px] font-bold text-zinc-400 hover:text-orange-500 transition-colors uppercase tracking-wider"
                  >
                    Quên mật khẩu?
                  </a>
                )}
              </div>
              <div className="input-glow-container">
                <div className="input-inner relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-4 py-3.5 pl-10 pr-10 text-sm focus:outline-none text-white placeholder-zinc-500 font-semibold border-none outline-none focus:ring-0"
                    required
                  />
                  <i className="ti ti-lock absolute left-3.5 text-zinc-400 text-base" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"} text-base`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength and Confirm Password for registration */}
            {!isLogin && (
              <>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-zinc-400">
                      <span>Độ an toàn mật khẩu</span>
                      <span className="text-zinc-500">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            step <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="flex flex-col gap-2 mt-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Nhập lại mật khẩu
                  </label>
                  <div className="input-glow-container">
                    <div className="input-inner relative flex items-center">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent px-4 py-3.5 pl-10 pr-10 text-sm focus:outline-none text-white placeholder-zinc-500 font-semibold border-none outline-none focus:ring-0"
                        required
                      />
                      <i className="ti ti-lock-check absolute left-3.5 text-zinc-400 text-base" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        <i className={`ti ${showConfirmPassword ? "ti-eye-off" : "ti-eye"} text-base`} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Remember me (for Login) or Agreement (for Register) */}
            <div className="flex items-center gap-2.5 my-1">
              <input
                id="checkbox-policy"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-white/5 text-orange-500 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="checkbox-policy" className="text-xs text-zinc-400 font-semibold cursor-pointer select-none">
                {isLogin
                  ? "Duy trì đăng nhập trên thiết bị này"
                  : "Tôi đồng ý với các Điều khoản & Chính sách của OmniShoe"}
              </label>
            </div>

            {/* Submit Button */}
            <Magnetic range={60}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-[0_4px_20px_rgba(255,107,0,0.15)] flex items-center justify-center gap-2 select-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : isLogin ? (
                  "Đăng nhập"
                ) : (
                  "Đăng ký tài khoản"
                )}
              </button>
            </Magnetic>
          </form>

          {/* Social Logins Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
              Hoặc đăng nhập bằng
            </span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-4 gap-3 w-full">
            <Magnetic range={45}>
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="col-span-2 py-3 border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-sm text-white hover:text-white transition-all group shadow-sm animate-none"
                title="Đăng nhập qua Google"
              >
                <i className="ti ti-brand-google group-hover:scale-110 transition-transform text-[#ea4335]" />
                <span className="font-semibold text-xs">Google</span>
              </button>
            </Magnetic>
            
            <Magnetic range={45}>
              <button
                type="button"
                onClick={() => handleSocialLogin("Apple")}
                className="col-span-1 py-3 border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-xl text-white hover:text-white transition-all group shadow-sm"
                title="Đăng nhập qua Apple"
              >
                <i className="ti ti-brand-apple group-hover:scale-110 transition-transform" />
              </button>
            </Magnetic>

            <Magnetic range={45}>
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="col-span-1 py-3 border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-xl text-white hover:text-white transition-all group shadow-sm"
                title="Đăng nhập qua Facebook"
              >
                <i className="ti ti-brand-facebook group-hover:scale-110 transition-transform text-[#1877f2]" />
              </button>
            </Magnetic>
          </div>

          {/* Tab Switcher Link */}
          <div className="text-center pt-3 border-t border-white/10">
            <span className="text-xs text-zinc-400 font-semibold">
              {isLogin ? "Bạn là thành viên mới?" : "Đã có tài khoản?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-xs font-black text-orange-500 hover:text-orange-600 hover:underline transition-all uppercase tracking-wider ml-1"
            >
              {isLogin ? "Tạo tài khoản ngay" : "Đăng nhập tại đây"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Global CSS animations injected for loading and custom glowing inputs */}
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .input-glow-container {
          position: relative;
          border-radius: 0.95rem;
          padding: 1px;
          background: rgba(255, 255, 255, 0.08);
          transition: background 0.3s;
          overflow: hidden;
          width: 100%;
        }
        .input-glow-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            transparent,
            transparent,
            transparent,
            rgba(255, 107, 0, 0.8)
          );
          transform: rotate(0deg);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
        }
        .input-glow-container:focus-within::before {
          opacity: 1;
          animation: rotateGlow 3s linear infinite;
        }
        @keyframes rotateGlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .input-inner {
          position: relative;
          z-index: 2;
          background: #0d0d0d;
          border-radius: 0.9rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
