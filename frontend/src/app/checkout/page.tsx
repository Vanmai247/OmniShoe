"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district?: string;
  notes: string;
}

const districtsByCity: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 10", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Thủ Đức", "Quận 2", "Quận 7"],
  "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Hai Bà Trưng", "Cầu Giấy", "Tây Hồ", "Thanh Xuân", "Long Biên"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt"],
  "Hải Phòng": ["Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An", "Đồ Sơn", "Dương Kinh"],
  "Khác": ["Quận / Huyện khác"]
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 text-zinc-800 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart, user, showToast, updateCartQuantity, removeFromCart } = useAppContext();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Read search parameters for single-item "buy now" bypass
  const searchParams = useSearchParams();
  const buyNowProductId = searchParams.get("productId");
  const buyNowSize = searchParams.get("size");
  const buyNowQty = searchParams.get("qty");

  const [buyNowProduct, setBuyNowProduct] = useState<any | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState<ShippingForm>({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "Hồ Chí Minh",
    district: "Quận 1",
    notes: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "wallet">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const bankId = process.env.NEXT_PUBLIC_BANK_ID || "VCB";
  const bankAcc = process.env.NEXT_PUBLIC_BANK_ACC || "0000000001";
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "OMNISHOE";

  // Determine items to check out (single product bypass OR cart items)
  const checkoutItems = buyNowProduct ? [buyNowProduct] : cart;

  const calculateSubtotal = () => {
    return checkoutItems.reduce((sum, item) => {
      const priceVal = parseInt(item.price.replace(/[^\d]/g, ""));
      return sum + priceVal * item.quantity;
    }, 0);
  };

  const getShippingFee = () => {
    return shippingMethod === "express" ? 50000 : 20000;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingFee();
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const getBankDisplayName = () => {
    const b = bankId.toUpperCase();
    if (b === "VCB" || b === "VIETCOMBANK") return "Vietcombank";
    if (b === "TCB" || b === "TECHCOMBANK") return "Techcombank";
    if (b === "MB" || b === "MBBANK") return "MB Bank (Quân đội)";
    return bankId;
  };

  // Polling order status for QR bank transfer
  useEffect(() => {
    if (!orderSuccess || orderSuccess.paymentMethod !== 'bank' || orderSuccess.status === 'Đã thanh toán') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
         const res = await fetch(`/api/orders/${orderSuccess.orderId}?t=${Date.now()}`, {
           cache: "no-store"
         });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'Đã thanh toán') {
            setOrderSuccess((prev: any) => ({ ...prev, status: 'Đã thanh toán' }));
            showToast("Thanh toán thành công! 🎉");
            
            // Trigger extra confetti
            const colors = ["#FF8C00", "#00d084", "#00a8ff"];
            for (let i = 0; i < 50; i++) {
              const p = document.createElement("div");
              p.className = "confetti-particle";
              p.style.left = Math.random() * 100 + "vw";
              p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
              p.style.borderRadius = Math.random() > 0.5 ? "50%" : "0px";
              p.style.animationDelay = Math.random() * 0.8 + "s";
              p.style.animationDuration = (Math.random() * 2 + 2) + "s";
              document.body.appendChild(p);
              setTimeout(() => p.remove(), 5000);
            }
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.error("Error checking order status:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [orderSuccess]);

  // Confetti effect hook when orderSuccess is active
  useEffect(() => {
    if (!orderSuccess) return;
    if (orderSuccess.paymentMethod === "bank" && orderSuccess.status === "Chờ thanh toán") {
      return;
    }

    // Inject CSS styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes confetti-fall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
      .confetti-particle {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        pointer-events: none;
        z-index: 9999;
        animation: confetti-fall 3.5s linear forwards;
      }
    `;
    document.head.appendChild(style);

    const colors = ["#FF8C00", "#00d084", "#00a8ff"];
    const createConfetti = () => {
      const confettiCount = 50;
      for (let i = 0; i < confettiCount; i++) {
        const p = document.createElement("div");
        p.className = "confetti-particle";
        p.style.left = Math.random() * 100 + "vw";
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.borderRadius = Math.random() > 0.5 ? "50%" : "0px";
        p.style.animationDelay = Math.random() * 0.8 + "s";
        p.style.animationDuration = (Math.random() * 2 + 2) + "s";
        document.body.appendChild(p);

        // Remove particle after animation completes
        setTimeout(() => p.remove(), 5000);
      }
    };

    createConfetti();
    const timer = setInterval(createConfetti, 4000);

    return () => {
      style.remove();
      clearInterval(timer);
    };
  }, [orderSuccess]);

  const handleUpdateBuyNowQty = (change: number) => {
    if (!buyNowProduct) return;
    const newQty = buyNowProduct.quantity + change;
    if (newQty > 0) {
      setBuyNowProduct({ ...buyNowProduct, quantity: newQty });
    }
  };

  const handleRemoveBuyNowProduct = () => {
    setBuyNowProduct(null);
  };

  const validateStep2 = () => {
    if (!form.fullName || !form.fullName.trim()) {
      showToast("Vui lòng điền họ và tên người nhận! ⚠️");
      return false;
    }
    if (!form.phone || !form.phone.trim()) {
      showToast("Vui lòng điền số điện thoại nhận hàng! ⚠️");
      return false;
    }
    if (!form.email || !form.email.trim()) {
      showToast("Vui lòng điền địa chỉ email! ⚠️");
      return false;
    }
    if (!form.address || !form.address.trim()) {
      showToast("Vui lòng điền địa chỉ nhận hàng cụ thể! ⚠️");
      return false;
    }
    return true;
  };

  const handleGoToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Load product if buyNowProductId query param is present
  useEffect(() => {
    if (buyNowProductId) {
      setLoadingProduct(true);
      const buyNowColor = searchParams.get("color");
      fetch(`/api/products/${buyNowProductId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        })
        .then((data) => {
          const matchingColorImage = data.colors?.find((c: any) => c.name === buyNowColor)?.images?.[0];
          setBuyNowProduct({
            ...data,
            name: buyNowColor ? `${data.name} - ${buyNowColor}` : data.name,
            selectedSize: parseInt(buyNowSize || "41"),
            quantity: parseInt(buyNowQty || "1"),
            photoId: matchingColorImage || data.photoId || data.image || "" 
          });
          setLoadingProduct(false);
        })
        .catch((err) => {
          console.error("Error loading buy now product:", err);
          showToast("Không tìm thấy sản phẩm mua ngay! ⚠️");
          setLoadingProduct(false);
        });
    }
  }, [buyNowProductId, buyNowSize, buyNowQty, searchParams]);

  // Sync user info if loaded later
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  // Pre-create order for Bank Transfer QR code when entering Step 3
  useEffect(() => {
    if (currentStep === 3 && paymentMethod === "bank" && !createdOrderId && !isCreatingOrder && checkoutItems.length > 0) {
      const createDraftOrder = async () => {
        setIsCreatingOrder(true);
        const orderId = `OMN-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder = {
          orderId,
          customer: form,
          items: checkoutItems,
          subtotal: calculateSubtotal(),
          shippingFee: getShippingFee(),
          total: calculateTotal(),
          paymentMethod,
          shippingMethod,
          date: new Date().toISOString(),
          status: "Chờ thanh toán",
        };

        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
          });

          if (!response.ok) {
            throw new Error('Failed to pre-create order');
          }

          setCreatedOrderId(orderId);
        } catch (err) {
          console.error("Error pre-creating order for QR code:", err);
          showToast("Không thể tạo mã thanh toán QR, vui lòng thử lại! ⚠️");
        } finally {
          setIsCreatingOrder(false);
        }
      };

      createDraftOrder();
    }
  }, [currentStep, paymentMethod, createdOrderId, isCreatingOrder, checkoutItems, form, shippingMethod]);

  // Reset pre-created order if they go back to previous steps to edit information
  useEffect(() => {
    if (currentStep < 3 && createdOrderId) {
      setCreatedOrderId(null);
    }
  }, [currentStep, createdOrderId]);

  // Polling order status for automatic redirection during Step 3
  useEffect(() => {
    if (!createdOrderId || paymentMethod !== 'bank' || orderSuccess) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
         const res = await fetch(`/api/orders/${createdOrderId}?t=${Date.now()}`, {
           cache: "no-store"
         });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'Đã thanh toán') {
            const completedOrder = {
              orderId: createdOrderId,
              customer: form,
              items: checkoutItems,
              subtotal: calculateSubtotal(),
              shippingFee: getShippingFee(),
              total: calculateTotal(),
              paymentMethod,
              shippingMethod,
              date: new Date().toISOString(),
              status: 'Đã thanh toán',
            };

            // Clear cart
            if (!buyNowProductId) {
              clearCart();
            }

            setOrderSuccess(completedOrder);
            showToast("Thanh toán thành công! 🎉 Cảm ơn bạn.");
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.error("Error polling draft order status:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [createdOrderId, paymentMethod, orderSuccess, form, checkoutItems, shippingMethod, buyNowProductId]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    const districts = districtsByCity[selectedCity] || ["Quận / Huyện khác"];
    setForm((prev) => ({
      ...prev,
      city: selectedCity,
      district: districts[0]
    }));
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Đã sao chép ${type}! 📋`);
    setTimeout(() => setCopiedType(null), 2000);
  };



  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.email) {
      showToast("Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc! ⚠️");
      return;
    }

    setIsSubmitting(true);

    // If order was already pre-created (for Bank QR code), just transition to success screen
    if (paymentMethod === "bank" && createdOrderId) {
      const existingOrder = {
        orderId: createdOrderId,
        customer: form,
        items: checkoutItems,
        subtotal: calculateSubtotal(),
        shippingFee: getShippingFee(),
        total: calculateTotal(),
        paymentMethod,
        shippingMethod,
        date: new Date().toISOString(),
        status: "Chờ thanh toán",
      };

      // Save order details to localStorage mock history
      try {
        const savedOrders = localStorage.getItem("omni_orders");
        const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
        ordersList.unshift(existingOrder);
        localStorage.setItem("omni_orders", JSON.stringify(ordersList));
      } catch (err) {
        console.error("Failed to save mock order history:", err);
      }

      setOrderSuccess(existingOrder);
      if (!buyNowProductId) {
        clearCart();
      }
      setIsSubmitting(false);
      return;
    }

    const orderId = `OMN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      customer: form,
      items: checkoutItems,
      subtotal: calculateSubtotal(),
      shippingFee: getShippingFee(),
      total: calculateTotal(),
      paymentMethod,
      shippingMethod,
      date: new Date().toISOString(),
      status: paymentMethod === "cod" ? "Chờ xác nhận" : "Chờ thanh toán",
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) {
        throw new Error('Failed to create order on server');
      }

      // Save order details to localStorage mock history (keep legacy fallback)
      try {
        const savedOrders = localStorage.getItem("omni_orders");
        const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
        ordersList.unshift(newOrder);
        localStorage.setItem("omni_orders", JSON.stringify(ordersList));
      } catch (err) {
        console.error("Failed to save mock order history:", err);
      }

      setOrderSuccess(newOrder);
      
      // ONLY clear global cart if it was checkout from cart (not single-item Buy Now)
      if (!buyNowProductId) {
        clearCart();
      }
      showToast("Đặt hàng thành công! 🎉 Cảm ơn bạn.");
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra khi tạo đơn hàng! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || loadingProduct) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-800 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Cart is empty and order not placed yet
  if (checkoutItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-800 relative z-0 flex flex-col items-center justify-center font-sans px-6">
        <div
          className="fixed inset-0 z-[-1] opacity-5 pointer-events-none bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('/studio_light_bg.jpg')` }}
        />
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-zinc-200">
          <Link href="/">
            <img src="/omnishoe_logo_fixed.png" alt="Logo" width={108} height={36} className="h-9 object-contain" />
          </Link>
          <Link href="/" className="text-xs font-black uppercase text-[#FF8C00] hover:underline flex items-center gap-1">
            ← Tiếp tục mua sắm
          </Link>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-zinc-200 p-10 rounded-[32px] max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center text-3xl border border-[#FF8C00]/20">
            👟
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900">Giỏ hàng đang trống</h2>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quay lại trang chủ để tìm cho mình đôi giày ưng ý nhất!
            </p>
          </div>
          <Link
            href="/"
            className="w-full py-3.5 bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[rgba(255,140,0,0.3)] hover:shadow-[rgba(255,140,0,0.5)] transition-all text-center"
          >
            Quay về trang chủ
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 relative z-0 flex flex-col font-sans selection:bg-[#FF8C00] selection:text-white">
      <div
        className="fixed inset-0 z-[-1] opacity-5 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/studio_light_bg.jpg')` }}
      />

      {/* Global Header */}
      <Header />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Progress Bar (Only show if not success state) */}
        {!orderSuccess && (
          <div className="flex justify-between mb-20 relative max-w-2xl mx-auto px-5">
            {/* Dynamic line showing progress */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-zinc-200 z-0">
              <div 
                className="h-full bg-[#00d084] transition-all duration-500" 
                style={{ width: `${currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100}%` }}
              />
            </div>
            
            {[
              { label: 'Giỏ hàng', stepNum: 1 },
              { label: 'Thông tin', stepNum: 2 },
              { label: 'Thanh toán', stepNum: 3 }
            ].map((step, idx) => {
              const isCompleted = currentStep > step.stepNum;
              const isActive = currentStep === step.stepNum;
              
              return (
                <button 
                  key={idx} 
                  type="button"
                  disabled={step.stepNum > currentStep} // Allow clicking back, disable future steps until completed
                  onClick={() => setCurrentStep(step.stepNum)}
                  className="flex flex-col items-center relative z-10 cursor-pointer disabled:cursor-not-allowed group focus:outline-none w-10"
                >
                  <div className="relative mb-2 shrink-0">
                    {/* Masking circle with the page background color to hide the progress line passing behind it */}
                    <div className="absolute inset-0 rounded-full bg-zinc-50 z-0 scale-105" />
                    
                    {/* The step badge circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-2 relative z-10 ${
                      isCompleted 
                        ? 'bg-[#00d084] border-[#00d084] text-white shadow-lg shadow-[rgba(0,208,132,0.3)]' 
                        : isActive
                        ? 'bg-[#FF8C00] border-[#FF8C00] text-white shadow-lg shadow-[rgba(255,140,0,0.5)] animate-pulse'
                        : 'bg-white border-zinc-200 text-zinc-400'
                    }`}>
                      {isCompleted ? '✓' : step.stepNum}
                    </div>
                  </div>
                  <span className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    isCompleted ? 'text-[#00d084]' : isActive ? 'text-[#FF8C00]' : 'text-zinc-400'
                  }`}>{step.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!orderSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Dynamic Step Content */}
              <div className="lg:col-span-7">
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="flex flex-col gap-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 flex flex-col gap-6 text-left shadow-lg"
                      >
                        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center text-sm font-black shadow-md shadow-[rgba(255,140,0,0.3)]">
                            1
                          </div>
                          <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 font-sans">Kiểm tra đơn hàng</h2>
                        </div>

                        <div className="flex flex-col divide-y divide-zinc-100">
                          {checkoutItems.map((item) => {
                            const priceVal = parseInt(item.price.replace(/[^\d]/g, ""));
                            const totalItemPrice = priceVal * item.quantity;
                            return (
                              <div key={`${item.id}-${item.selectedSize}`} className="py-5 flex gap-4 items-center group">
                                {/* Image */}
                                <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0 flex items-center justify-center relative">
                                  <img
                                    src={
                                      item.photoId.startsWith("/") || item.photoId.startsWith("http")
                                        ? item.photoId
                                        : `https://images.unsplash.com/${item.photoId}?w=150&q=80`
                                    }
                                    alt={item.name}
                                    className={`max-w-full max-h-full transition-transform duration-500 group-hover:scale-105 ${item.photoId.startsWith("/") ? "object-contain p-1" : "object-cover"}`}
                                  />
                                </div>
                                
                                {/* Info & Quantity controls */}
                                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <span className="text-[9px] font-black text-[#FF8C00] uppercase tracking-widest leading-none block">
                                      {item.brand}
                                    </span>
                                    <h4 className="text-sm font-black text-zinc-800 truncate mt-1 leading-tight group-hover:text-[#FF8C00] transition-colors duration-300 font-sans" title={item.name}>
                                      {item.name}
                                    </h4>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5 block">
                                      Size: {item.selectedSize}
                                    </span>
                                  </div>
                                  
                                  {/* Quantity Editor */}
                                  <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 w-fit">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (buyNowProduct) {
                                          handleUpdateBuyNowQty(-1);
                                        } else {
                                          updateCartQuantity(item.id, item.selectedSize, -1);
                                        }
                                      }}
                                      className="w-7 h-7 rounded-lg hover:bg-zinc-200 text-zinc-650 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                                    >
                                      −
                                    </button>
                                    <span className="text-xs font-black text-zinc-800 min-w-4 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (buyNowProduct) {
                                          handleUpdateBuyNowQty(1);
                                        } else {
                                          updateCartQuantity(item.id, item.selectedSize, 1);
                                        }
                                      }}
                                      className="w-7 h-7 rounded-lg hover:bg-zinc-200 text-zinc-650 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Price & Remove Button */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <span className="text-xs md:text-sm font-black text-zinc-850">
                                    {formatPrice(totalItemPrice)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (buyNowProduct) {
                                        handleRemoveBuyNowProduct();
                                      } else {
                                        removeFromCart(item.id, item.selectedSize);
                                      }
                                    }}
                                    className="text-[10px] font-black text-zinc-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 pt-6 border-t border-zinc-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(255,140,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md shadow-[rgba(255,140,0,0.2)] font-sans"
                          >
                            Tiếp tục nhập thông tin →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-8"
                      >
                        {/* Shipping Address */}
                        <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 flex flex-col gap-6 text-left shadow-lg">
                          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center text-sm font-black shadow-md shadow-[rgba(255,140,0,0.3)]">
                              2
                            </div>
                            <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 font-sans">Thông tin nhận hàng</h2>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Họ và tên người nhận *
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleInputChange}
                                placeholder="Nguyễn Văn A"
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 font-sans"
                                required
                              />
                            </div>
                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Số điện thoại *
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 0912345678"
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 font-sans"
                                required
                              />
                            </div>
                            {/* Email */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Địa chỉ Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                placeholder="email@example.com"
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 font-sans"
                                required
                              />
                            </div>
                            
                            {/* City */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Tỉnh / Thành phố *
                              </label>
                              <select
                                name="city"
                                value={form.city}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  handleCityChange(e);
                                }}
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 cursor-pointer font-sans"
                              >
                                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                <option value="Hà Nội">TP. Hà Nội</option>
                                <option value="Đà Nẵng">TP. Đà Nẵng</option>
                                <option value="Cần Thơ">TP. Cần Thơ</option>
                                <option value="Hải Phòng">TP. Hải Phòng</option>
                                <option value="Khác">Tỉnh thành khác</option>
                              </select>
                            </div>

                            {/* District */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Quận / Huyện *
                              </label>
                              <select
                                name="district"
                                value={form.district}
                                onChange={handleInputChange}
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 cursor-pointer font-sans"
                              >
                                {(districtsByCity[form.city] || ["Quận / Huyện khác"]).map((dist) => (
                                  <option key={dist} value={dist}>
                                    {dist}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Địa chỉ cụ thể (Số nhà, Tên đường, Phường/Xã...) *
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold transition-all duration-300 font-sans"
                                required
                              />
                            </div>
                            {/* Notes */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                Ghi chú đơn hàng (Không bắt buộc)
                              </label>
                              <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước khi giao..."
                                rows={2}
                                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:bg-white focus:border-[#FF8C00] focus:shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-800 font-semibold resize-none leading-relaxed transition-all duration-300 font-sans"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 flex flex-col gap-5 text-left shadow-lg">
                          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center text-sm font-black shadow-md shadow-[rgba(255,140,0,0.3)]">
                              🚚
                            </div>
                            <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 font-sans">Phương thức vận chuyển</h2>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Standard Card */}
                            <button
                              type="button"
                              onClick={() => setShippingMethod("standard")}
                              className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                shippingMethod === "standard"
                                  ? "bg-[#FF8C00]/5 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-900"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-100/50 hover:text-zinc-800"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  shippingMethod === "standard" ? "border-[#FF8C00]" : "border-zinc-300"
                                }`}>
                                  {shippingMethod === "standard" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]" />}
                                </div>
                                <div>
                                  <span className="text-xs font-black block tracking-wider text-zinc-850 font-sans">🚚 GIAO TIÊU CHUẨN</span>
                                  <span className="text-[10px] text-zinc-500 mt-0.5 block font-semibold font-sans">Dự kiến giao từ 3 - 5 ngày</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-[#FF8C00]">{formatPrice(20000)}</span>
                            </button>

                            {/* Express Card */}
                            <button
                              type="button"
                              onClick={() => setShippingMethod("express")}
                              className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                shippingMethod === "express"
                                  ? "bg-[#FF8C00]/5 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-900"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-100/50 hover:text-zinc-800"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  shippingMethod === "express" ? "border-[#FF8C00]" : "border-zinc-300"
                                }`}>
                                  {shippingMethod === "express" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]" />}
                                </div>
                                <div>
                                  <span className="text-xs font-black block tracking-wider text-zinc-850 font-sans">⚡ GIAO HỎA TỐC (FAST)</span>
                                  <span className="text-[10px] text-zinc-500 mt-0.5 block font-semibold font-sans">Dự kiến giao từ 1 - 2 ngày</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-[#FF8C00]">{formatPrice(50000)}</span>
                            </button>
                          </div>
                        </div>

                        {/* Navigation buttons Step 2 */}
                        <div className="pt-4 flex justify-between items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="px-6 py-3.5 border border-zinc-200 hover:border-zinc-350 text-zinc-750 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:bg-zinc-100 cursor-pointer font-sans"
                          >
                            ← Quay lại
                          </button>
                          <button
                            type="button"
                            onClick={handleGoToStep3}
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(255,140,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md shadow-[rgba(255,140,0,0.2)] font-sans"
                          >
                            Tiếp tục thanh toán →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-8"
                      >
                        {/* Step 3: Payment Method */}
                        <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 flex flex-col gap-6 text-left shadow-lg">
                          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#FF8C00] text-white flex items-center justify-center text-sm font-black shadow-md shadow-[rgba(255,140,0,0.3)]">
                              3
                            </div>
                            <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 font-sans">Phương thức thanh toán</h2>
                          </div>

                          <div className="flex flex-col gap-3.5">
                            {/* COD Selector */}
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("cod")}
                              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                                paymentMethod === "cod"
                                  ? "bg-[#FF8C00]/5 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-900"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-100/50 hover:text-zinc-800"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                paymentMethod === "cod" ? "border-[#FF8C00]" : "border-zinc-300"
                              }`}>
                                {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]" />}
                              </div>
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center text-lg shrink-0 border border-[#FF8C00]/25">
                                  💵
                                </div>
                                <div>
                                  <span className="text-xs font-black block tracking-wide text-zinc-900 font-sans">Thanh toán khi nhận hàng (COD)</span>
                                  <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Nhận hàng, kiểm tra rồi thanh toán tiền mặt cho shipper</span>
                                </div>
                              </div>
                            </button>

                            {/* Bank Transfer Selector */}
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("bank")}
                              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                                paymentMethod === "bank"
                                  ? "bg-[#FF8C00]/5 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-900"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-100/50 hover:text-zinc-800"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                paymentMethod === "bank" ? "border-[#FF8C00]" : "border-zinc-300"
                              }`}>
                                {paymentMethod === "bank" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]" />}
                              </div>
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center text-lg shrink-0 border border-[#FF8C00]/25">
                                  📱
                                </div>
                                <div>
                                  <span className="text-xs font-black block tracking-wide text-zinc-900 font-sans">Chuyển khoản ngân hàng (QR Code)</span>
                                  <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Quét mã QR ngân hàng cực kỳ tiện lợi để thanh toán ngay tức thì</span>
                                </div>
                              </div>
                            </button>

                            {/* Bank QR Code Detail Section */}
                            <AnimatePresence>
                              {paymentMethod === "bank" && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden bg-white border border-zinc-200/80 rounded-2xl p-6 ml-0 md:ml-8 mt-2 flex flex-col lg:flex-row gap-8 items-center justify-between shadow-sm"
                                >
                                  {/* Left: 3-step visualization */}
                                  <div className="flex-1 flex items-start justify-around w-full gap-4 py-2 border-b lg:border-b-0 lg:border-r border-zinc-100 lg:pr-8">
                                    {/* Step 1 */}
                                    <div className="flex flex-col items-center text-center max-w-[120px]">
                                      <div className="w-12 h-12 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center mb-3 border border-[#FF8C00]/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                          <path d="M4 9V5a2 2 0 0 1 2-2h4" />
                                          <path d="M20 9V5a2 2 0 0 0-2-2h-4" />
                                          <path d="M4 15v4a2 2 0 0 0 2 2h4" />
                                          <path d="M20 15v4a2 2 0 0 1-2 2h-4" />
                                          <rect x="7" y="7" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                                          <rect x="14" y="7" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                                          <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                                          <path d="M14 14h2v2h-2zm2 2h2v2h-2zm0-2h2v2h-2zm-2 2h2v2h-2z" fill="currentColor" />
                                          <line x1="3" y1="12" x2="21" y2="12" stroke="#FF8C00" strokeWidth={1.5} strokeDasharray="3 2" />
                                        </svg>
                                      </div>
                                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Bước 1</span>
                                      <h5 className="text-[11px] font-black text-zinc-800 mt-1">Quét mã QR</h5>
                                      <p className="text-[9px] text-zinc-500 mt-1 font-semibold leading-tight">Mở app ngân hàng quét mã VietQR</p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="text-zinc-300 font-bold text-lg hidden sm:block mt-3">➔</div>

                                    {/* Step 2 */}
                                    <div className="flex flex-col items-center text-center max-w-[120px]">
                                      <div className="w-12 h-12 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center mb-3 border border-[#FF8C00]/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" fillOpacity="0.05" />
                                          <polyline points="14 2 14 8 20 8" />
                                          <line x1="8" y1="12" x2="16" y2="12" strokeOpacity="0.4" />
                                          <line x1="8" y1="16" x2="12" y2="16" strokeOpacity="0.4" />
                                          <circle cx="16" cy="16" r="4" fill="#FF8C00" stroke="#FF8C00" />
                                          <path d="m14.5 16 1 1 2-2" stroke="white" strokeWidth={1.2} />
                                        </svg>
                                      </div>
                                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Bước 2</span>
                                      <h5 className="text-[11px] font-black text-zinc-800 mt-1">Kiểm tra thông tin</h5>
                                      <p className="text-[9px] text-zinc-500 mt-1 font-semibold leading-tight">Xác nhận đúng số tiền & nội dung</p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="text-zinc-300 font-bold text-lg hidden sm:block mt-3">➔</div>

                                    <div className="flex flex-col items-center text-center max-w-[120px]">
                                      <div className="w-12 h-12 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center mb-3 border border-[#FF8C00]/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                          <circle cx="12" cy="12" r="10" stroke="#FF8C00" strokeWidth={1.5} fill="currentColor" fillOpacity="0.05" />
                                          <circle cx="12" cy="12" r="7" stroke="#FF8C00" strokeWidth={1} strokeDasharray="2 2" />
                                          <path d="m9 12 2 2 4-4" stroke="#FF8C00" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Bước 3</span>
                                      <h5 className="text-[11px] font-black text-zinc-800 mt-1">Hoàn tất</h5>
                                      <p className="text-[9px] text-zinc-500 mt-1 font-semibold leading-tight">Đơn hàng tự động duyệt thành công</p>
                                    </div>
                                  </div>

                                  {/* Right: QR Code & Status */}
                                  <div className="flex flex-col items-center gap-2 shrink-0 bg-zinc-50 border border-zinc-150 p-4 rounded-2xl w-48 text-center relative">
                                    <span className="text-[9px] font-black text-zinc-700 tracking-wide uppercase font-sans mb-1">Quét mã để thanh toán</span>
                                    
                                    <div className="w-36 h-36 rounded-xl bg-white relative overflow-hidden flex items-center justify-center border border-zinc-200 shadow-inner">
                                      {isCreatingOrder || !createdOrderId ? (
                                        <div className="flex flex-col items-center gap-2 p-2">
                                          <div className="w-6 h-6 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
                                          <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-wider">Đang tạo đơn...</span>
                                        </div>
                                      ) : (
                                        <img
                                          src={`https://img.vietqr.io/image/${bankId}-${bankAcc}-compact2.jpg?amount=${calculateTotal()}&addInfo=${encodeURIComponent("OMNISHOE " + createdOrderId)}&accountName=${encodeURIComponent(bankName)}`}
                                          alt="QR Code thanh toán"
                                          className="w-full h-full object-contain p-1"
                                        />
                                      )}
                                    </div>

                                    {/* Green badge indicator */}
                                    <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-emerald-600">
                                      <span className="text-[10px]">🛡️</span>
                                      <span className="text-[8px] font-black uppercase tracking-wider">Tự động xác nhận ngay</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* E-Wallet Selector */}
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("wallet")}
                              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                                paymentMethod === "wallet"
                                  ? "bg-[#FF8C00]/5 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.1)] text-zinc-900"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-100/50 hover:text-zinc-800"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                paymentMethod === "wallet" ? "border-[#FF8C00]" : "border-zinc-300"
                              }`}>
                                {paymentMethod === "wallet" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]" />}
                              </div>
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center text-lg shrink-0 border border-[#FF8C00]/25">
                                  💳
                                </div>
                                <div>
                                  <span className="text-xs font-black block tracking-wide text-zinc-900 font-sans">Ví điện tử / Cổng thanh toán (Momo, VNPay)</span>
                                  <span className="text-[10px] text-zinc-500 mt-1 block font-medium font-sans">Tự động chuyển tiếp đến ứng dụng ví Momo hoặc VNPay an toàn</span>
                                </div>
                              </div>
                            </button>
                          </div>

                          {/* Trust Signals */}
                          <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-500 pt-6 border-t border-zinc-100 flex-wrap font-sans">
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                              <span className="text-[#00d084] text-xs">🔒</span> Thanh toán an toàn (SSL)
                            </div>
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                              <span className="text-[#00d084] text-xs">✓</span> Bảo vệ bởi OMNISHOE
                            </div>
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                              <span className="text-[#00d084] text-xs">↩️</span> Đổi trả 30 ngày
                            </div>
                          </div>
                        </div>

                        {/* Navigation buttons Step 3 */}
                        <div className="pt-4 flex justify-start items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="px-6 py-3.5 border border-zinc-200 hover:border-zinc-350 text-zinc-750 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:bg-zinc-100 cursor-pointer font-sans"
                          >
                            ← Quay lại
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <motion.div 
                  whileHover={{ borderColor: "rgba(255,140,0,0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-zinc-200/80 rounded-[2rem] p-6 flex flex-col gap-6 text-left shadow-lg transition-all duration-350"
                >
                  <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider pb-3 border-b border-zinc-100 flex items-center justify-between">
                    <span>📦 Đơn hàng của bạn</span>
                    <span className="text-[10px] bg-[#FF8C00]/10 border border-[#FF8C00]/25 text-[#FF8C00] font-black px-2.5 py-0.5 rounded-full">
                      {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                    </span>
                  </h3>

                  {currentStep === 3 && createdOrderId && (
                    <div className="flex justify-between items-center bg-zinc-50 border border-zinc-150 px-4 py-2.5 rounded-xl text-xs -mt-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Mã đơn hàng:</span>
                      <span className="font-extrabold text-zinc-800 tracking-wide">{createdOrderId}</span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 pr-1.5 custom-scrollbar">
                    {checkoutItems.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="py-4 flex gap-4 group">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0 flex items-center justify-center relative">
                          <img
                            src={
                              item.photoId.startsWith("/") || item.photoId.startsWith("http")
                                ? item.photoId
                                : `https://images.unsplash.com/${item.photoId}?w=120&q=80`
                            }
                            alt={item.name}
                            className={`max-w-full max-h-full transition-transform duration-500 group-hover:scale-110 ${item.photoId.startsWith("/") ? "object-contain p-1" : "object-cover"}`}
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[9px] font-black text-[#FF8C00] uppercase tracking-widest leading-none block">
                              {item.brand}
                            </span>
                            <h4 className="text-xs font-bold text-zinc-800 truncate mt-1 leading-tight group-hover:text-[#FF8C00] transition-colors duration-300" title={item.name}>
                              {item.name}
                            </h4>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
                            Size: {item.selectedSize} | Số lượng: {item.quantity}
                          </span>
                        </div>
                        {/* Price */}
                        <span className="text-xs font-black text-zinc-850 shrink-0 py-0.5">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-zinc-100 pt-5 flex flex-col gap-3.5 text-xs font-semibold text-zinc-500">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span className="text-zinc-850 font-bold">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span className="text-zinc-850 font-bold">{formatPrice(getShippingFee())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giảm giá khuyến mãi:</span>
                      <span className="text-[#00d084] font-bold">-0₫</span>
                    </div>
                    
                    <div className="border-t border-zinc-100 pt-4 mt-2 flex justify-between items-baseline">
                      <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">TỔNG CỘNG:</span>
                      <span className="text-xl font-black text-[#FF8C00] tracking-tight animate-pulse">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Submit button below order summary card, only shown in Step 3 */}
                {currentStep === 3 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting || (paymentMethod === "bank" && isCreatingOrder && !createdOrderId)}
                      className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(255,140,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[rgba(255,140,0,0.25)] font-sans"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang kết nối cổng thanh toán...
                        </>
                      ) : paymentMethod === "bank" && isCreatingOrder && !createdOrderId ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang tạo mã QR...
                        </>
                      ) : (
                        <>
                          ✓ Xác nhận đặt hàng
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Checkout Success State Overlay */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-120px)] font-sans px-4 relative"
            >
              {/* CSS Animations style tag */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scale-in {
                  0% { transform: scale(0.6); opacity: 0; }
                  100% { transform: scale(1); opacity: 1; }
                }
                @keyframes delivery-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                .animate-scale-in {
                  animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .animate-delivery-bounce {
                  animation: delivery-bounce 1.2s ease infinite;
                }
              `}} />

              {/* Success Icon */}
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${
                orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank"
                  ? "from-amber-400 to-amber-550 text-white shadow-amber-500/25"
                  : "from-[#00d084] to-[#00b86c] text-white shadow-[rgba(0,208,132,0.25)]"
              } flex items-center justify-center text-5xl mb-6 shadow-xl animate-scale-in`}>
                {orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank" ? "⏳" : "✓"}
              </div>

              {/* Success Content */}
              <div className="text-center mb-10">
                <div className={`text-[10px] font-black uppercase tracking-widest ${
                  orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank"
                    ? "text-amber-700 bg-amber-50 border border-amber-250/30"
                    : "text-[#00d084] bg-[#00d084]/10 border border-[#00d084]/25"
                } px-4 py-1.5 rounded-full w-fit mx-auto mb-4`}>
                  {orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank"
                    ? "⏳ Chờ thanh toán"
                    : "✨ Đặt hàng thành công"}
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-[#FF8C00] bg-clip-text text-transparent font-sans uppercase tracking-tight">
                  {orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank"
                    ? "Đơn hàng đang chờ thanh toán"
                    : "Cảm ơn bạn đã mua sắm!"}
                </h1>
                <p className="text-zinc-550 text-sm max-w-md mx-auto leading-relaxed font-semibold">
                  {orderSuccess.status === "Chờ thanh toán" && orderSuccess.paymentMethod === "bank"
                    ? "Vui lòng hoàn tất chuyển khoản theo thông tin bên dưới để đơn hàng được xác nhận và giao đi sớm nhất."
                    : "Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ chuẩn bị và giao hàng cho bạn trong thời gian sớm nhất."}
                </p>
              </div>

              {/* Order Info Card */}
              <div className="w-full bg-white border border-zinc-200/80 rounded-[2rem] p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Mã đơn hàng</div>
                    <div className="text-base font-extrabold text-zinc-900">{orderSuccess.orderId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Người nhận hàng</div>
                    <div className="text-base font-extrabold text-zinc-900">{orderSuccess.customer.fullName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-zinc-100">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Số điện thoại</div>
                    <div className="text-base font-extrabold text-zinc-900">{orderSuccess.customer.phone}</div>
                  </div>
                  {/* Show Payment Status Badge */}
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Phương thức thanh toán</div>
                    <div className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                      <span>
                        {orderSuccess.paymentMethod === "cod"
                          ? "Tiền mặt (COD)"
                          : orderSuccess.paymentMethod === "bank"
                          ? "Chuyển khoản (QR)"
                          : "Ví điện tử"}
                      </span>
                      {orderSuccess.paymentMethod === "bank" && (
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          orderSuccess.status === "Đã thanh toán"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse"
                        }`}>
                          {orderSuccess.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Địa chỉ giao hàng</div>
                    <div className="text-sm font-bold text-zinc-800 leading-relaxed">
                      {orderSuccess.customer.address}, {orderSuccess.customer.district || ""}, {orderSuccess.customer.city}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Tổng số tiền thanh toán</div>
                    <div className="text-2xl font-black text-[#FF8C00]">{formatPrice(orderSuccess.total)}</div>
                  </div>
                </div>
              </div>

              {/* Show Bank Transfer Instruction in success screen if QR Bank transfer was selected */}
              {orderSuccess.paymentMethod === "bank" && (
                orderSuccess.status === "Đã thanh toán" ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-[2rem] p-6 flex items-center gap-4 shadow-inner mb-8 text-left">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase text-emerald-800 tracking-wider">Thanh toán thành công!</h4>
                      <p className="text-xs text-emerald-650 mt-1 font-semibold">Chúng tôi đã nhận được khoản thanh toán chuyển khoản của bạn. Đơn hàng đang được chuẩn bị để giao đi.</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-inner mb-8">
                    <div className="flex flex-col gap-3 text-xs font-semibold text-zinc-700 w-full md:w-auto text-left font-sans">
                      <span className="text-[10px] font-black uppercase text-[#FF8C00] tracking-widest">Thông tin chuyển khoản</span>
                      
                      <div className="flex justify-between md:justify-start gap-4 border-b border-zinc-200/60 pb-2">
                        <span className="text-zinc-500 w-24">Ngân hàng:</span>
                        <span className="font-extrabold text-zinc-800">{getBankDisplayName()}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 border-b border-zinc-200/60 pb-2 items-center">
                        <span className="text-zinc-500 w-24">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#FF8C00]">{bankAcc}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(bankAcc, "Số tài khoản")}
                            className="px-2 py-0.5 bg-zinc-200 hover:bg-[#FF8C00] hover:text-white rounded text-[10px] text-zinc-700 transition-colors"
                          >
                            {copiedType === "Số tài khoản" ? "Đã chép" : "Sao chép"}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 border-b border-zinc-200/60 pb-2">
                        <span className="text-zinc-500 w-24">Tên thụ hưởng:</span>
                        <span className="font-extrabold text-zinc-800 uppercase">{bankName}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 border-b border-zinc-200/60 pb-2">
                        <span className="text-zinc-500 w-24">Số tiền:</span>
                        <span className="font-extrabold text-zinc-800">{formatPrice(orderSuccess.total)}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 italic">Vui lòng quét mã QR hoặc chuyển đúng số tài khoản bên cạnh để hoàn tất đơn hàng.</p>
                    </div>

                    {/* QR Box */}
                    <div className="flex flex-col items-center gap-2 shrink-0 bg-white p-4 rounded-2xl shadow-xl w-40 text-center border border-zinc-200">
                      <div className="w-32 h-32 rounded-lg relative overflow-hidden flex items-center justify-center border border-zinc-200">
                        <img
                          src={`https://img.vietqr.io/image/${bankId}-${bankAcc}-compact2.jpg?amount=${orderSuccess.total}&addInfo=${encodeURIComponent("OMNISHOE " + orderSuccess.orderId)}&accountName=${encodeURIComponent(bankName)}`}
                          alt="QR Code thanh toán"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[8px] text-zinc-650 font-black tracking-tight uppercase font-sans">QUÉT QR THANH TOÁN</span>
                    </div>
                  </div>
                )
              )}

              {/* Delivery Timeline Card */}
              <div className="w-full bg-white border border-zinc-200/80 rounded-[2rem] p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left">
                <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider mb-8 border-b border-zinc-100 pb-4">
                  📦 Lộ trình giao hàng
                </h3>
                
                {/* Desktop timeline view */}
                <div className="hidden md:flex justify-between relative mt-8 mb-4 max-w-2xl mx-auto px-4">
                  {/* Timeline line */}
                  <div className="absolute top-8 left-10 right-10 h-0.5 bg-zinc-200 z-0">
                    <div 
                      className="h-full bg-[#00d084] transition-all duration-500" 
                      style={{ width: "50%" }}
                    />
                  </div>

                  {/* Timeline steps */}
                  {[
                    { label: 'Đơn hàng đã xác nhận', icon: '✓', date: 'Hôm nay', completed: true, active: false },
                    { label: 'Đang chuẩn bị hàng', icon: '📦', date: '1-2 giờ', completed: false, active: true },
                    { label: 'Đang giao hàng', icon: '🚚', date: 'Ngày mai', completed: false, active: false },
                    { label: 'Giao hàng thành công', icon: '🎉', date: 'Dự kiến', completed: false, active: false }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10 w-32 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl mb-4 border-2 transition-all duration-500 ${
                        step.completed
                          ? 'bg-[#00d084] border-[#00d084] text-white shadow-lg shadow-[rgba(0,208,132,0.3)]'
                          : step.active
                          ? 'bg-[#00d084] border-[#00d084] text-white shadow-lg shadow-[rgba(0,208,132,0.4)] animate-pulse animate-delivery-bounce'
                          : 'bg-white border-zinc-200 text-zinc-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className={`text-xs font-black uppercase tracking-wider ${step.completed || step.active ? 'text-[#00d084]' : 'text-zinc-400'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 mt-1">{step.date}</div>
                    </div>
                  ))}
                </div>

                {/* Mobile timeline view */}
                <div className="grid md:hidden grid-cols-2 gap-y-8 gap-x-4 mt-6">
                  {[
                    { label: 'Đã xác nhận', icon: '✓', date: 'Hôm nay', completed: true, active: false },
                    { label: 'Chuẩn bị hàng', icon: '📦', date: '1-2 giờ', completed: false, active: true },
                    { label: 'Đang giao hàng', icon: '🚚', date: 'Ngày mai', completed: false, active: false },
                    { label: 'Giao thành công', icon: '🎉', date: 'Dự kiến', completed: false, active: false }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center p-4 bg-zinc-50 border border-zinc-150 rounded-2xl relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg mb-3 border-2 transition-all duration-500 ${
                        step.completed
                          ? 'bg-[#00d084] border-[#00d084] text-white shadow-md'
                          : step.active
                          ? 'bg-[#00d084] border-[#00d084] text-white shadow-md animate-pulse animate-delivery-bounce'
                          : 'bg-white border-zinc-200 text-zinc-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-wide text-center ${step.completed || step.active ? 'text-[#00d084]' : 'text-zinc-400'}`}>
                        {step.label}
                      </div>
                      <div className="text-[9px] font-bold text-zinc-400 mt-1">{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Summary Card */}
              <div className="w-full bg-white border border-zinc-200/80 rounded-[2rem] p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left">
                <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider mb-6 border-b border-zinc-100 pb-4">
                  📦 Sản phẩm trong đơn hàng
                </h3>
                
                <div className="flex flex-col divide-y divide-zinc-100">
                  {orderSuccess.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-6 py-6 first:pt-0 last:pb-0 group">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                        <img
                          src={
                            item.photoId.startsWith("/") || item.photoId.startsWith("http")
                              ? item.photoId
                              : `https://images.unsplash.com/${item.photoId}?w=150&q=80`
                          }
                          alt={item.name}
                          className={`max-w-full max-h-full transition-transform duration-500 group-hover:scale-105 ${item.photoId.startsWith("/") ? "object-contain p-1" : "object-cover"}`}
                        />
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[9px] font-black text-[#FF8C00] uppercase tracking-widest leading-none block">
                            {item.brand}
                          </span>
                          <h4 className="text-sm font-black text-zinc-850 truncate mt-1 leading-tight group-hover:text-[#FF8C00] transition-colors duration-300 font-sans" title={item.name}>
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-semibold mt-1.5 block">
                            Size: {item.selectedSize} | Số lượng: {item.quantity}
                          </span>
                        </div>
                        <span className="text-sm font-black text-[#FF8C00] mt-1.5 block">
                          {formatPrice(parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                <Link
                  href="/"
                  className="px-6 py-4 border border-zinc-200 hover:border-zinc-350 text-zinc-750 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 text-center hover:bg-zinc-100 font-sans shadow-sm"
                >
                  📋 Xem đơn hàng của tôi
                </Link>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-4 bg-gradient-to-r from-[#FF8C00] to-[#ff9f1c] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[rgba(255,140,0,0.3)] hover:shadow-[rgba(255,140,0,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-center cursor-pointer font-sans"
                >
                  🛍️ Tiếp tục mua sắm
                </button>
              </div>

              {/* Trust Signals */}
              <div className="flex gap-8 justify-center flex-wrap pt-6 border-t border-zinc-150 w-full mt-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="text-2xl">🔒</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Thanh toán an toàn</div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="text-2xl">✓</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Đổi trả 30 ngày</div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="text-2xl">📞</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Hỗ trợ 24/7</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
