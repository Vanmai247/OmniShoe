"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // Duration of animation in ms
  suffix?: string;
}

export default function CountUp({ end, duration = 2000, suffix = "+" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad (slows down towards the end)
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const animId = window.requestAnimationFrame(step);
    
    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, [end, duration]);

  // Server-side rendering (SSR) fallback to ensure SEO crawlers see the final number
  if (!isMounted) {
    return (
      <span>
        {end.toLocaleString("vi-VN")}
        {suffix}
      </span>
    );
  }

  return (
    <span>
      {count.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
}
