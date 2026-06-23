# Design Spec: OMNISHOE Login Sneaker Blueprint Background
Date: 2026-06-23

## 1. Overview & Goals
Enhance the background of the centered OMNISHOE login page (`frontend/src/app/login/page.tsx`) by replacing the generic background image/particles with an interactive, premium **Sneaker Blueprint & Tech Lines** theme.
This will use detailed crisp SVG lines, technical measuring ticks, coordinate systems, and concentric circles to evoke the feeling of a professional, modern "Sneaker Design Lab."

---

## 2. Visual & Interaction Details

### 2.1 Technical Drawing SVG Elements
*   **Concentric Tech Circles:** Positioned in corners with dotted lines and angles (e.g. `45°`, `90°`).
*   **Blueprint Sneaker Path:** A beautiful, stylized vector wireframe of a sneaker positioned in the background, drawn with thin white/orange glowing paths.
*   **Measurement Rulers:** Horizontal and vertical rulers showing tick marks and numerical tags (e.g. `00mm`, `100mm`, `200mm`).
*   **Grid Overlay:** A fine grid pattern overlay (`opacity: 0.1`) that spans the whole background.
*   **Design Metrics:** Subtle textual labels in mono font like `[MODEL_NO: OMNISHOE-V1]`, `[SCALE: 1:1]`, `[COORDINATES: X, Y]`.

### 2.2 Interactive Parallax
*   The blueprint elements will be split into multiple layers (background grid, midground circles/rules, foreground sneaker blueprint).
*   Mouse movement will shift these layers with varying multipliers (`mouseX * 10`, `mouseX * 25`, etc.) in coordination with the background glow to create a deep holographic parallax space.

---

## 3. Implementation Plan
*   **File to Modify:** `frontend/src/app/login/page.tsx`.
*   **Tech Stack:** React, SVG, Tailwind CSS, Framer Motion.
