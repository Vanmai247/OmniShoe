# Website Design System & Feature Improvements Design

## 1. Overview
This specification details the enhancements to the OMNISHOE website design system and e-commerce features across three phases:
- **Phase 1:** Update the accent color system to `#FF6B00` and modify the product grid on desktop to 4 columns.
- **Phase 2:** Implement a responsive, multi-select filtering sidebar (Sticky on Desktop, Drawer on Mobile).
- **Phase 3:** Create a hover-triggered Mega-menu for the "Brands" category on the header.

## 2. Proposed Changes

### Phase 1: Color System & Product Grid Layout
- **Màu sắc (Accent color):** Update `--accent: #FF6B00;` in [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css).
- **Lưới sản phẩm (Grid):** In [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css), update the `.product-grid` rule on desktop (`min-width: 1024px`) to `grid-template-columns: repeat(4, 1fr); gap: 24px;`.

### Phase 2: Multi-select Filtering Sidebar
- **Layout:**
  - On Desktop (`min-width: 1024px`), modify the product layout into a two-column grid:
    - Sidebar column: `250px` wide, sticky positioning.
    - Product Grid column: flexible width (`1fr`).
  - On Mobile, keep the product grid full-width and hide the sidebar. Add a "Bộ lọc 📊" button next to category filters that opens a full-screen/sliding Drawer.
- **Filter Categories:**
  - **Brands:** Checkboxes for (Nike, Adidas, Puma, Jordan, New Balance, Converse, Vans, MLB).
  - **Sizes:** Lưới các ô chọn size từ 38 đến 44.
  - **Price Range:** Range input slider filtering by maximum price (from 0 to 6,000,000₫).
- **State Management:**
  - Define state variables in `page.tsx`:
    - `selectedBrands: string[]`
    - `selectedSizes: number[]`
    - `maxPrice: number`
  - Filter `filteredProducts` dynamically in React based on all selected filter states.

### Phase 3: Brand Mega-menu in Sticky Header
- **Layout & Structure:**
  - Wrap the "Thương hiệu" nav link in both [page.tsx](file:///c:/OmniShoe/frontend/src/app/page.tsx) and [page.tsx (Chi tiết sản phẩm)](file:///c:/OmniShoe/frontend/src/app/products/%5Bid%5D/page.tsx) inside a relative wrapper container `.nav-item-has-submenu`.
  - Append a sub-menu container `.mega-menu` inside.
- **Styling:**
  - Position `.mega-menu` absolutely, stretching full-width of the header or as a large centered card.
  - Style with a dark glassmorphism background matching the website's dark theme overlay.
  - Display the 8 brand logos in a 4-column layout with hover scale interactions.
  - When a logo is clicked, trigger a smooth scroll to the products section and pre-filter that brand.

## 3. Verification Plan
- **Phase 1:** Check that color `#FF6B00` is reflected and the grid displays 4 items per row on widescreen viewports.
- **Phase 2:** Verify filters correctly filter the products in real-time. Verify mobile filter Drawer opens and closes correctly.
- **Phase 3:** Hover over "Thương hiệu" to ensure the Mega-menu appears with a smooth transition. Click a logo to ensure it scrolls and filters correctly.
- **Build & Tests:** Verify `npm run build` and `npm test` execute successfully.
