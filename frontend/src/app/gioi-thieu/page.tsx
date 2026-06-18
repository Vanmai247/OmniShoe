"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Animation Presets
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function AboutUsPage() {
  const { showToast } = useAppContext();

  const [pageConfig, setPageConfig] = useState<any>(null);

  // Fetch page configuration from dynamic API
  useEffect(() => {
    fetch("/api/pages/gioi-thieu")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page config");
        return res.json();
      })
      .then((data) => {
        setPageConfig(data);
      })
      .catch((err) => {
        console.error("Error loading about page config:", err);
      });
  }, []);

  // Sync tab/browser SEO title
  useEffect(() => {
    if (pageConfig?.metadata?.seoTitle) {
      document.title = pageConfig.metadata.seoTitle;
    } else {
      document.title = "Về chúng tôi — Câu chuyện thương hiệu OmniShoe";
    }
  }, [pageConfig]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative z-0">
      {/* Dynamic background overlay */}
      <div
        className="fixed inset-0 z-[-1] opacity-35 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/studio_light_bg.png')`,
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* 1. STICKY HEADER WITH GLOBAL STATE */}
      <Header />

      {/* 2. HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-50% left-50% min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none"
          style={{ top: "50%", left: "50%" }}
        >
          <source src="/uploads/3627-172488393.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Visual Vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/60 pointer-events-none z-1" />

        <div className="relative text-center text-white px-6 z-10 max-w-4xl select-none">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 0.8, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="uppercase text-xs md:text-sm mb-4 font-black tracking-[0.3em] text-accent font-sans"
          >
            {pageConfig?.content?.subtitle || "CÂU CHUYỆN SNEAKER CULTURE"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter mb-6 leading-none drop-shadow-lg"
          >
            VỀ CHÚNG TÔI
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "96px" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-1 bg-accent mx-auto"
          />
        </div>
      </section>

      <main className="flex-grow">
        {/* 3. JOURNEY SECTION WITH SIDE VIDEO */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text details */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex flex-col text-left"
            >
              <span className="text-accent text-xs font-black tracking-widest uppercase mb-3">Tầm nhìn & Hành trình</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 italic uppercase tracking-tighter text-foreground">
                Hành trình của chúng tôi
              </h2>
              <p className="text-base md:text-lg text-text-muted font-semibold leading-relaxed mb-6">
                Được thành lập từ năm 2024 bởi những người trẻ đam mê giày thể thao, <span className="font-black text-foreground">OmniShoe</span> không đơn thuần là một cửa hàng bán giày, mà là nơi nuôi dưỡng tinh thần và kết nối cộng đồng yêu sneaker tại Việt Nam.
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(255,107,0,0.3)] animate-pulse shrink-0">
                  24
                </div>
                <p className="font-bold uppercase tracking-widest text-xs md:text-sm text-foreground">Ra đời từ đam mê thuần khiết</p>
              </div>

              <p className="text-base md:text-lg text-text-muted font-semibold leading-relaxed">
                Chúng tôi tin rằng mỗi bước đi đều xứng đáng có một người bạn đồng hành chất lượng. Đó là lý do Omnishoe luôn khắt kê trong việc lựa chọn từng sản phẩm từ các thương hiệu chính hãng toàn cầu.
              </p>
            </motion.div>

            {/* Image container */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleUp}
              className="relative group overflow-hidden rounded-[32px] border border-border-color shadow-2xl aspect-video"
            >
              <Image
                src="/sneakers.webp"
                alt="Sneakers journey"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* 4. MISSION SECTION (DARK NEON ORANGE GLOW) */}
        <section className="bg-zinc-950 text-white py-32 px-6 md:px-12 relative overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-20 pointer-events-none z-0"
            style={{ top: "50%", left: "50%" }}
          >
            <source src="/uploads/10535762-uhd_4096_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />

          {/* Orange glow blurring background details */}
          <div className="absolute top-0 right-0 opacity-25 w-[500px] h-[500px] bg-accent blur-[150px] rounded-full pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 opacity-15 w-[300px] h-[300px] bg-amber-500 blur-[120px] rounded-full pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-accent text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-6 block"
            >
              Sứ mệnh của chúng tôi
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-black italic leading-relaxed md:leading-relaxed lg:leading-relaxed mb-8 text-white uppercase tracking-normal"
            >
              "CHÚNG TÔI MANG ĐẾN GIẢI PHÁP SỞ HỮU CÁC MẪU GIÀY CHÍNH HÃNG 100% VỚI CHÍNH SÁCH BẢO HÀNH RÕ RÀNG, ĐÁNG TIN CẬY NHẤT."
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-20 h-1 bg-accent mx-auto mb-8 origin-center"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-semibold leading-relaxed md:leading-relaxed lg:leading-relaxed"
            >
              OmniShoe tin rằng mỗi đôi giày đều mang trong mình một câu chuyện lịch sử đặc biệt. Chúng tôi mang sứ mệnh giữ vững và phát triển nền văn hóa sneaker nguyên bản tại Việt Nam.
            </motion.p>
          </div>
        </section>

        {/* 5. COMMITMENTS SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-16 italic text-center uppercase tracking-tight text-foreground"
          >
            Cam kết từ OmniShoe
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-shield-check text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">100% Authentic</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Tất cả sản phẩm được phân phối qua OmniShoe đều được kiểm tra nghiêm ngặt về chất lượng và nguồn gốc trước khi gửi tới khách hàng.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-shopping-bag text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">Dịch vụ xuất sắc</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Hỗ trợ tư vấn size chính xác và đổi size miễn phí trong 30 ngày. Khách hàng luôn là ưu tiên hàng đầu của chúng tôi.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-card-background border border-border-color rounded-[32px] hover:border-accent hover:shadow-[0_20px_40px_rgba(255,107,0,0.05)] transition-all duration-300 group flex flex-col items-start text-left cursor-default"
            >
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                <i className="ti ti-users text-2xl" />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-foreground">Cộng đồng năng động</h3>
              <p className="text-sm text-text-muted font-semibold leading-relaxed">
                Chúng tôi thường xuyên tổ chức các sự kiện kết nối cộng đồng sneakerhead, chia sẻ những thông tin và xu hướng mới nhất.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 6. COMMUNITY / STREETWEAR MOVEMENT SECTION */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-border-color">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image container */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleUp}
              className="relative group overflow-hidden rounded-[32px] border border-border-color shadow-2xl aspect-video lg:order-last"
            >
              <Image
                src="/photo-1-1554814699613836808416.webp"
                alt="OmniShoe & You"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>

            {/* Description content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col text-left"
            >
              <span className="text-accent text-xs md:text-sm font-black uppercase tracking-wider mb-2">OmniShoe & You</span>
              <h2 className="text-3xl md:text-4xl font-black mb-8 italic uppercase tracking-tighter text-foreground">
                Kết nối & Lan tỏa
              </h2>
              <p className="text-base text-text-muted font-semibold leading-relaxed mb-6">
                Văn hóa sneaker không chỉ dừng lại ở việc mua hay đi một đôi giày hiệu. Đó là phong thái của thế hệ mới, sự khẳng định cái tôi đầy khác biệt, và là sợi dây vô hình kết kết những tâm hồn đồng điệu có niềm đam mê thời trang streetwear mãnh liệt.
              </p>
              <p className="text-base text-text-muted font-semibold leading-relaxed">
                OmniShoe tự hào đồng hành cùng thế hệ trẻ Việt Nam trong từng chuyển động, cùng xây dựng và khẳng định vị thế của Sneaker Culture đích thực.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <Footer />
    </div>
  );
}
