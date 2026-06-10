# Website Design Specification: OMNISHOE E-commerce

This document provides a technical and design specification for the OMNISHOE website, optimized for AI processing and implementation.

## 1. Brand Identity & Visual Language
*   **Core Concept:** Modern, Energetic, Premium Sneaker Culture.
*   **Design Style:** Minimalist with high-impact accents (Modern E-commerce).
*   **Target Audience:** Gen Z and Millennials, sneaker enthusiasts.

## 2. Design System Specifications

### 2.1 Color Palette (Hex Codes)
| Element | Primary Color | Secondary/Accent | Neutral/Background |
| :--- | :--- | :--- | :--- |
| **Main Action** | #FF6B00 (Vibrant Orange) | #000000 (Pure Black) | #F5F5F5 (Light Gray) |
| **Secondary Action**| #FFFFFF (White) | #333333 (Dark Gray) | #E0E0E0 (Medium Gray) |
| **Alerts/Status** | #FF3B30 (Error) | #34C759 (Success) | #007AFF (Info) |

### 2.2 Typography
*   **Primary Font (Headings):** Sans-serif Bold (e.g., Montserrat, Inter, or Roboto).
*   **Secondary Font (Body):** Sans-serif Regular (e.g., Inter, Open Sans).
*   **Hierarchy:**
    *   H1: 48px - 64px (Hero Title)
    *   H2: 32px - 40px (Section Titles)
    *   Body: 16px (Standard text)

## 3. UI Component Specifications

### 3.1 Header (Sticky Navigation)
*   **Logo:** Left-aligned, OMNISHOE branding.
*   **Nav Links:** Center-aligned (Men, Women, Brands, Sale, Trends).
*   **Utilities:** Right-aligned (Search bar, Wishlist, Cart with badge, User Account).

### 3.2 Hero Section (High Conversion)
*   **Background:** Dynamic gradient or abstract smoke/light trails (Blue/Orange/Gray).
*   **Main Visual:** High-resolution sneaker PNG (Floating effect with soft shadow).
*   **CTA Group:**
    *   Primary: "MUA NGAY" (Orange background, white text).
    *   Secondary: "XEM XU HƯỚNG" (Outline style, white border).
*   **Social Proof:** Counters for "12K+ Products", "15+ Brands", "50K+ Customers".

### 3.3 Product Grid & Sections
*   **Layout:** 4-column grid for desktop, 2-column for mobile.
*   **Product Card:**
    *   Hover effect: Zoom-in or secondary image reveal.
    *   Badges: "New", "Sale %", "Limited".
    *   Quick Add: "Add to Cart" button on hover.

## 4. UX Requirements & Interactivity
*   **Responsive Design:** Mobile-first approach.
*   **Micro-interactions:** Smooth transitions for hover states, cart drawer animation.
*   **Navigation:** Breadcrumbs for product pages, Mega-menu for "Brands".
*   **Filtering:** Multi-select sidebar (Size, Color, Brand, Price Range).

## 5. Technical Implementation Notes
*   **Framework Suggestion:** React/Next.js with Tailwind CSS for rapid UI development.
*   **Assets:** Use SVG for icons, WebP for images to optimize performance.
*   **SEO:** Implement Schema.org for product data, optimize meta tags.
*   **Performance:** Aim for < 2s load time, 90+ Lighthouse score.

---
*Prepared by Manus AI for OMNISHOE Project Implementation.*
