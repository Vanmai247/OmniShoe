"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  badge: string;
  photoId: string;
  category: string;
  glowColor: string;
  sizes: number[];
}

interface StyleQuizProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  field: "category" | "style" | "budget";
  options: {
    label: string;
    value: string;
    desc: string;
    icon: string;
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    title: "MỤC ĐÍCH SỬ DỤNG CHÍNH CỦA BẠN?",
    subtitle: "Chúng tôi sẽ lọc ra dòng giày tối ưu cho hoạt động của bạn.",
    field: "category",
    options: [
      { label: "Thời trang hàng ngày", value: "Lifestyle", desc: "Đi học, đi làm, dạo phố nhẹ nhàng", icon: "ti-shirt" },
      { label: "Thể thao & Chạy bộ", value: "Running", desc: "Tập gym, chạy bộ bền bỉ với đệm êm", icon: "ti-run" },
      { label: "Bóng rổ & Streetwear", value: "Basketball", desc: "Độ bám sân cao, phong cách hiphop cực chất", icon: "ti-ball-volleyball" },
    ],
  },
  {
    id: 2,
    title: "PHONG CÁCH MÀU SẮC YÊU THÍCH?",
    subtitle: "Màu sắc thể hiện cá tính riêng của bạn trên phố.",
    field: "style",
    options: [
      { label: "Tối giản & Lịch lãm", value: "minimalist", desc: "Trắng, Đen, Xám tối giản, dễ phối đồ", icon: "ti-palette" },
      { label: "Cá tính & Nổi loạn", value: "accent", desc: "Các phối màu Neon, tương phản rực rỡ", icon: "ti-bolt" },
      { label: "Retro & Bụi bặm", value: "vintage", desc: "Màu đất, rêu, ngả vàng cổ điển cực nghệ", icon: "ti-crown" },
    ],
  },
  {
    id: 3,
    title: "NGÂN SÁCH MONG MUỐN?",
    subtitle: "Chọn phân khúc giá để tìm kiếm đôi giày tối ưu chi phí.",
    field: "budget",
    options: [
      { label: "Tiết kiệm & Học sinh", value: "low", desc: "Dưới 3,000,000₫", icon: "ti-coin" },
      { label: "Tầm trung năng động", value: "mid", desc: "Từ 3,000,000₫ - 5,000,000₫", icon: "ti-wallet" },
      { label: "Hypebeast - Không giới hạn", value: "hype", desc: "Trên 5,000,000₫ (Hàng limited, cao cấp)", icon: "ti-diamond" },
    ],
  },
];

export default function StyleQuiz({ products, onAddToCart, onShowToast }: StyleQuizProps) {
  const [step, setStep] = useState<number>(0); // 0: Start, 1-3: Questions, 4: Analyzing, 5: Results
  const [answers, setAnswers] = useState({
    category: "",
    style: "",
    budget: "",
  });
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  const startQuiz = () => {
    setAnswers({ category: "", style: "", budget: "" });
    setStep(1);
  };

  const handleAnswer = (field: "category" | "style" | "budget", value: string) => {
    const updatedAnswers = { ...answers, [field]: value };
    setAnswers(updatedAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 completed -> Go to analyzing spinner
      setStep(4);
      
      // Dynamic filtering based on answers
      setTimeout(() => {
        let results = [...products];

        // Filter 1: Category
        results = results.filter(p => p.category === updatedAnswers.category);

        // If no results for category (e.g. Running, Basketball has fewer items), relax filter to include similar ones
        if (results.length === 0) {
          results = [...products];
        }

        // Filter 2: Budget
        results = results.filter(p => {
          const rawPrice = parseInt(p.price.replace(/,/g, "").replace("₫", ""));
          if (updatedAnswers.budget === "low") return rawPrice < 3000000;
          if (updatedAnswers.budget === "mid") return rawPrice >= 3000000 && rawPrice <= 5000000;
          return rawPrice > 5000000;
        });

        // Fallback if no exact price match, pick top rated for that category
        if (results.length === 0) {
          results = products
            .filter(p => p.category === updatedAnswers.category)
            .slice(0, 2);
        }

        // Final fallback if still empty
        if (results.length === 0) {
          results = products.slice(0, 2);
        }

        setRecommended(results.slice(0, 2)); // Return top 2 recommendations
        setStep(5);
        onShowToast("Đã phân tích xong! Đôi giày định mệnh của bạn đã xuất hiện. 🎉");
      }, 2000);
    }
  };

  const copyVoucher = () => {
    navigator.clipboard.writeText("OMNIGENZ10");
    setIsCopied(true);
    onShowToast("Đã sao chép mã giảm giá 10%: OMNIGENZ10 🏷️");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border-color bg-gradient-to-br from-card-background via-bg-secondary/40 to-card-background p-8 md:p-12 my-16 max-w-[1440px] mx-auto text-center">
      {/* Absolute Glow Lights */}
      <div className="absolute -top-1/4 -right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* Step 0: Start Screen */}
        {step === 0 && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center max-w-[700px] mx-auto gap-6 py-6"
          >
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
              <i className="ti ti-brain"></i> Trợ lý phong cách AI
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
              TÌM KIẾM CHIẾC <span className="text-accent">SNEAKER</span> ĐỊNH MỆNH
            </h2>
            <p className="text-text-muted leading-relaxed text-sm md:text-base">
              Bạn đang bối rối trước quá nhiều phối màu và kiểu dáng? Hãy trả lời 3 câu hỏi nhanh về phong cách sống và ngân sách của bạn, thuật toán thông minh sẽ tìm ra đôi giày sinh ra dành riêng cho bạn!
            </p>
            <button
              onClick={startQuiz}
              className="bg-accent hover:bg-[#e54e1b] hover:shadow-accent/30 hover:shadow-xl active:scale-95 text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-2xl transition-all duration-300 mt-2 flex items-center gap-2"
            >
              Bắt đầu trắc nghiệm <i className="ti ti-arrow-right text-lg"></i>
            </button>
          </motion.div>
        )}

        {/* Step 1-3: Questions */}
        {step >= 1 && step <= 3 && (
          <motion.div
            key={`question-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col max-w-[800px] mx-auto gap-6 py-4 text-left"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-text-muted">
              <span>BƯỚC CHẨN ĐOÁN {step}/3</span>
              <span className="text-accent font-mono">{Math.round((step / 3) * 100)}% HOÀN THÀNH</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-border-color rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">
                {quizQuestions[step - 1].title}
              </h3>
              <p className="text-xs md:text-sm text-text-muted font-medium">
                {quizQuestions[step - 1].subtitle}
              </p>
            </div>

            {/* Grid options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {quizQuestions[step - 1].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(quizQuestions[step - 1].field, opt.value)}
                  className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-border-color bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent group text-left transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle Background Icon on Hover */}
                  <i className={`ti ${opt.icon} absolute right-4 bottom-4 text-7xl opacity-5 group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none`} />

                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white flex items-center justify-center text-xl transition-all duration-300">
                    <i className={`ti ${opt.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground group-hover:text-accent transition-colors duration-300">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-text-muted font-medium mt-1 leading-normal">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep(step - 1)}
              className="self-start text-xs font-bold text-text-muted hover:text-foreground flex items-center gap-1.5 mt-2 py-2"
            >
              <i className="ti ti-arrow-left"></i> Quay lại câu trước
            </button>
          </motion.div>
        )}

        {/* Step 4: Analyzing State */}
        {step === 4 && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
          >
            {/* Spinning Custom Outer Circle */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-border-color" />
              <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <i className="ti ti-brain text-accent text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-col gap-1.5 max-w-[320px]">
              <h3 className="font-extrabold text-lg text-foreground uppercase tracking-wider">ĐANG PHÂN TÍCH...</h3>
              <p className="text-xs text-text-muted font-medium leading-relaxed">
                Đang đối chiếu dữ liệu thói quen và tài chính của bạn với kho hàng sneaker đầu bảng của chúng tôi.
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 5: Recommended Results */}
        {step === 5 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col max-w-[1000px] mx-auto gap-8 py-2"
          >
            <div className="flex flex-col gap-2 items-center">
              <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <i className="ti ti-circle-check"></i> Đã có kết quả chẩn đoán
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-foreground leading-none tracking-tight">
                CẶP ĐÔI HOÀN HẢO CHO <span className="text-accent">PHONG CÁCH</span> CỦA BẠN
              </h3>
              <p className="text-xs md:text-sm text-text-muted font-medium max-w-[500px]">
                Dựa trên câu trả lời của bạn, đây là những lựa chọn được thiết kế để mang lại trải nghiệm tối ưu nhất.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto w-full">
              {recommended.map((product) => (
                <div 
                  key={product.id}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border border-border-color bg-bg-secondary/40 text-left relative group overflow-hidden"
                >
                  {/* Glowing background */}
                  <div className="absolute -inset-10 opacity-0 group-hover:opacity-10 rounded-full blur-[40px] pointer-events-none -z-10 bg-accent transition-opacity duration-500" />

                  {/* Shoe Image */}
                  <div className="w-[140px] h-[120px] shrink-0 bg-bg-secondary rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={product.photoId.startsWith("/") || product.photoId.startsWith("http") ? product.photoId : `https://images.unsplash.com/${product.photoId}?w=240&q=80`}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=240&q=80";
                      }}
                      className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300"
                    />
                  </div>

                  {/* Shoe Info */}
                  <div className="flex-grow flex flex-col justify-between h-full gap-4">
                    <div>
                      <span className="text-[10px] text-accent font-black tracking-wider uppercase">{product.brand}</span>
                      <h4 className="font-extrabold text-base text-foreground leading-snug mt-0.5">{product.name}</h4>
                      <p className="text-accent font-black text-sm mt-1">{product.price}</p>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-foreground hover:bg-accent text-background hover:text-white active:scale-95 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 self-start"
                    >
                      Chọn & Mua <i className="ti ti-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Discount Coupon card */}
            <div className="max-w-[600px] mx-auto w-full bg-accent/5 border border-accent/10 rounded-2xl p-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <h4 className="text-accent font-black text-sm tracking-wide uppercase">QUÀ TẶNG KÈM DÀNH RIÊNG CHO BẠN!</h4>
                <p className="text-xs text-text-muted font-medium mt-1 leading-relaxed">
                  Nhập mã dưới đây khi thanh toán để nhận ngay ưu đãi giảm thêm **10%** cho mọi đơn hàng của trợ lý phong cách.
                </p>
              </div>

              {/* Coupon Box */}
              <div className="flex items-center gap-2 bg-black/60 border border-border-color py-2 px-3 rounded-xl min-w-[200px] justify-between">
                <span className="font-mono text-sm font-black text-foreground tracking-widest pl-2">OMNIGENZ10</span>
                <button
                  onClick={copyVoucher}
                  className="bg-accent hover:bg-[#e54e1b] text-white p-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center shrink-0"
                  aria-label="Sao chép voucher"
                >
                  {isCopied ? <i className="ti ti-check text-base"></i> : <i className="ti ti-copy text-base"></i>}
                </button>
              </div>
            </div>

            {/* Restart Button */}
            <button
              onClick={startQuiz}
              className="self-center text-xs font-bold text-text-muted hover:text-accent transition-colors duration-300 flex items-center gap-1 py-2"
            >
              <i className="ti ti-reload"></i> Làm lại trắc nghiệm
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
