# OMNISHOE Login Blueprint Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a detailed "Sneaker Design Lab" blueprint background in `frontend/src/app/login/page.tsx` using SVG technical drawings, coordinates, measuring rulers, and parallax motion.

**Architecture:** SVG overlay layers integrated directly into Next.js React component layout, animated using Framer Motion (`motion.div` and `useTransform`) to react to mouse coordinates for 3D depth.

**Tech Stack:** React, Next.js, Framer Motion, SVGs.

---

### Task 1: Add Blueprint SVGs and Rulers to layout

**Files:**
- Modify: `c:\OmniShoe\frontend\src\app\login\page.tsx` (Inside return layout container)

- [ ] **Step 1: Embed vertical scale rulers and blueprint SVGs into the main layout container**

In [page.tsx](file:///c:/OmniShoe/frontend/src/app/login/page.tsx), add the background blueprint overlay blocks right after the background glows and canvas overlays (inside the parent `div`, around line 540-547):

```tsx
      {/* Vertical ruler scale - Left edge */}
      <div className="absolute left-6 top-20 bottom-20 w-[1px] bg-white/5 z-10 pointer-events-none hidden md:flex flex-col justify-between items-center py-6 text-[8px] font-mono text-zinc-500 select-none">
        <span className="transform -rotate-90">000mm</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform -rotate-90">150mm</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform -rotate-90">300mm</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform -rotate-90">450mm</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform -rotate-90">600mm</span>
      </div>

      {/* Vertical ruler scale - Right edge */}
      <div className="absolute right-6 top-20 bottom-20 w-[1px] bg-white/5 z-10 pointer-events-none hidden md:flex flex-col justify-between items-center py-6 text-[8px] font-mono text-zinc-500 select-none">
        <span className="transform rotate-90">REF: OMNI-2026</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform rotate-90">SCALE: 1:1</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform rotate-90">VER: 3.5.2</span>
        <div className="w-2 h-[1px] bg-white/10"></div>
        <span className="transform rotate-90">GRID: 10MM</span>
      </div>

      {/* Left Blueprint Layer: Concentric Tech Circles (Parallax Layer A) */}
      <motion.div
        style={{
          x: useTransform(springX, [-400, 400], [-35, 35]),
          y: useTransform(springY, [-400, 400], [-35, 35]),
        }}
        className="absolute left-10 top-1/4 z-0 pointer-events-none opacity-20 hidden md:block select-none"
      >
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" stroke="white" strokeWidth="0.75" strokeDasharray="3 3">
          <circle cx="120" cy="120" r="100" />
          <circle cx="120" cy="120" r="60" strokeDasharray="none" stroke="rgba(255, 255, 255, 0.2)" />
          <circle cx="120" cy="120" r="20" />
          <line x1="0" y1="120" x2="240" y2="120" strokeWidth="0.5" stroke="rgba(255, 255, 255, 0.3)" />
          <line x1="120" y1="0" x2="120" y2="240" strokeWidth="0.5" stroke="rgba(255, 255, 255, 0.3)" />
          <text x="130" y="30" fill="white" fontSize="9" fontFamily="monospace" letterSpacing="1" opacity="0.6">[DESIGN SYSTEM LAB]</text>
          <text x="130" y="220" fill="white" fontSize="9" fontFamily="monospace" letterSpacing="1" opacity="0.6">[COORDS: {mousePos.x}, {mousePos.y}]</text>
        </svg>
      </motion.div>

      {/* Right Blueprint Layer: Detailed Wireframe Sneaker (Parallax Layer B) */}
      <motion.div
        style={{
          x: useTransform(springX, [-400, 400], [30, -30]),
          y: useTransform(springY, [-400, 400], [30, -30]),
        }}
        className="absolute right-10 top-1/4 z-0 pointer-events-none opacity-25 hidden lg:block select-none"
      >
        <svg width="400" height="260" viewBox="0 0 400 260" fill="none" stroke="white" strokeWidth="0.75">
          {/* Detailed Technical Sneaker Path */}
          <path d="M 40 180 C 80 180, 110 172, 140 145 C 170 115, 200 70, 240 70 C 280 70, 310 115, 320 135 C 330 155, 350 172, 360 180 C 320 192, 120 198, 40 180 Z" strokeWidth="1.25" stroke="rgba(255, 255, 255, 0.8)" />
          <path d="M 40 180 C 80 172, 120 155, 150 135 C 180 115, 220 102, 260 102 C 290 102, 310 115, 320 135" strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.4)" />
          <path d="M 140 145 C 160 155, 200 168, 240 162" stroke="rgba(255, 255, 255, 0.5)" />
          <path d="M 240 70 C 250 92, 260 115, 260 135" strokeWidth="0.75" stroke="rgba(255, 255, 255, 0.4)" />
          <path d="M 100 177 L 120 135 L 150 135" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="2 2" />
          
          {/* Tech ticks & rulers */}
          <line x1="30" y1="210" x2="370" y2="210" strokeWidth="0.5" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="1 4" />
          <line x1="30" y1="205" x2="30" y2="215" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <line x1="200" y1="205" x2="200" y2="215" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <line x1="370" y1="205" x2="370" y2="215" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <text x="80" y="230" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">LENGTH: 320mm</text>
          <text x="240" y="230" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">HEIGHT: 125mm</text>
          
          {/* Target pointer */}
          <circle cx="240" cy="70" r="4" stroke="#ff6b00" strokeWidth="1.25" />
          <line x1="230" y1="70" x2="250" y2="70" stroke="#ff6b00" strokeWidth="0.75" />
          <line x1="240" y1="60" x2="240" y2="80" stroke="#ff6b00" strokeWidth="0.75" />
          <text x="252" y="66" fill="#ff6b00" fontSize="8" fontFamily="monospace" fontWeight="bold">COLLAR POINT</text>
        </svg>
      </motion.div>
```

- [ ] **Step 2: Commit blueprint overlay code**

Run: `git commit -am "feat: implement blueprint vector background in nextjs login page"`
