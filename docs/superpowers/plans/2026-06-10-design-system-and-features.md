# Website Design System & Feature Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement design improvements including color palette update, 4-column product grid, interactive multi-select filtering sidebar, and a hover-triggered mega-menu in the header.

**Architecture:** 
- Color adjustments and responsive layouts are handled in `globals.css`.
- The product filtering logic and sidebar state hooks are integrated into the React state in `page.tsx`.
- The Mega-menu is integrated into header navigation in both `page.tsx` and `products/[id]/page.tsx` with responsive drop layouts and CSS transitions.

**Tech Stack:** React, Next.js, CSS, TypeScript

---

### Task 1: Phase 1 - Accent Color & 4-Column Grid

**Files:**
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Update accent color in globals.css**
  Change `--accent` from `#FF5722` to `#FF6B00` under `:root` and `html[data-dark]` blocks in [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css):
  ```css
  :root {
    /* ... */
    --accent: #FF6B00;
    /* ... */
  }
  ```

- [ ] **Step 2: Update product grid columns to 4 columns on desktop**
  Update the media query in [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css):
  ```css
  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
  }
  ```

- [ ] **Step 3: Commit Phase 1 changes**
  Run:
  ```bash
  git add frontend/src/app/globals.css
  git commit -m "feat: update accent color and change desktop product grid to 4 columns"
  ```

---

### Task 2: Phase 2 - Multi-select Filtering Sidebar

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Add filter state variables and filter logic in page.tsx**
  Add state hooks and update product filtering logic in [page.tsx](file:///c:/OmniShoe/frontend/src/app/page.tsx):
  ```tsx
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(6000000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const filteredProducts = mockProducts.filter((p) => {
    const matchCategory = activeFilter === "Tất cả" || p.category === activeFilter;
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchSize = selectedSizes.length === 0 || p.sizes.some((sz) => selectedSizes.includes(sz));
    const priceVal = parseInt(p.price.replace(/[^\d]/g, ""));
    const matchPrice = priceVal <= maxPrice;
    return matchCategory && matchBrand && matchSize && matchPrice;
  });
  ```

- [ ] **Step 2: Add Filtering Sidebar UI structure to page.tsx**
  Wrap the product grid and sidebar in a parent container `.products-body-container`, and implement checkboxes, size buttons, price slider, and the mobile filter drawer button next to the category pills.
  ```tsx
  {/* Category Filter Pills + Mobile Filter Button */}
  <div className="flex justify-between items-center w-full gap-4 flex-wrap">
    <div className="filters">
      {/* existing category pills */}
    </div>
    <button 
      onClick={() => setIsFilterDrawerOpen(true)}
      className="md:hidden filter-pill flex items-center gap-1.5 active"
    >
      <i className="ti ti-adjustments-horizontal"></i> Bộ lọc
    </button>
  </div>

  <div className="products-body-container">
    {/* Filter Sidebar (Desktop Sticky / Mobile Drawer) */}
    <aside className={`filter-sidebar ${isFilterDrawerOpen ? 'open' : ''}`}>
      <div className="sidebar-header md:hidden">
        <h3>Bộ lọc sản phẩm</h3>
        <button onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close">
          <i className="ti ti-x"></i>
        </button>
      </div>

      <div className="filter-group">
        <h4>Thương hiệu</h4>
        {brands.map((brand) => (
          <label key={brand} className="filter-checkbox-label">
            <input 
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedBrands([...selectedBrands, brand]);
                } else {
                  setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                }
              }}
            />
            <span>{brand}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Size giày</h4>
        <div className="size-filter-grid">
          {[38, 39, 40, 41, 42, 43, 44].map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => {
                  if (isSelected) {
                    setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                  } else {
                    setSelectedSizes([...selectedSizes, sz]);
                  }
                }}
                className={`size-filter-btn ${isSelected ? 'active' : ''}`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group">
        <h4>Khoảng giá (Dưới)</h4>
        <input 
          type="range"
          min="1000000"
          max="6000000"
          step="500000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="price-slider"
        />
        <div className="price-display">
          <span>{maxPrice.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>

      {(selectedBrands.length > 0 || selectedSizes.length > 0 || maxPrice < 6000000) && (
        <button 
          onClick={() => {
            setSelectedBrands([]);
            setSelectedSizes([]);
            setMaxPrice(6000000);
          }}
          className="clear-filters-btn"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </aside>

    {/* Product Area */}
    <div className="products-grid-area">
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {/* existing product rendering map */}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border-color rounded-[32px] w-full">
          <p className="font-bold text-lg mt-4 text-text-muted">Không tìm thấy sản phẩm phù hợp!</p>
        </div>
      )}
    </div>
  </div>
  ```

- [ ] **Step 3: Add sidebar styles to globals.css**
  Append sidebar, checkbox, size filter buttons, and price slider styles to [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css):
  ```css
  .products-body-container {
    display: flex;
    gap: 32px;
    margin-top: 32px;
    align-items: flex-start;
  }
  .filter-sidebar {
    width: 250px;
    flex-shrink: 0;
    position: sticky;
    top: 100px;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .products-grid-area {
    flex-grow: 1;
  }
  .filter-group h4 {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    color: var(--foreground);
  }
  .filter-checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-muted);
  }
  .filter-checkbox-label input[type="checkbox"] {
    accent-color: var(--accent);
  }
  .size-filter-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .size-filter-btn {
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: none;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    color: var(--text-muted);
  }
  .size-filter-btn.active, .size-filter-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background-color: rgba(255, 107, 0, 0.05);
  }
  .price-slider {
    width: 100%;
    accent-color: var(--accent);
  }
  .price-display {
    font-size: 14px;
    font-weight: 800;
    color: var(--accent);
    margin-top: 8px;
  }
  .clear-filters-btn {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--accent);
    background: none;
    color: var(--accent);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
  }
  .clear-filters-btn:hover {
    background-color: var(--accent);
    color: white;
  }

  @media (max-width: 1023px) {
    .filter-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      z-index: 1000;
      border-radius: 0;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    }
    .filter-sidebar.open {
      transform: translateX(0);
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-b: 1px solid var(--border-color);
    }
    .sidebar-header h3 {
      font-size: 18px;
      font-weight: 900;
    }
    .sidebar-header button {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
  }
  ```

- [ ] **Step 4: Commit Phase 2 changes**
  Run:
  ```bash
  git add frontend/src/app/page.tsx frontend/src/app/globals.css
  git commit -m "feat: add multi-select filtering sidebar with drawer layout on mobile"
  ```

---

### Task 3: Phase 3 - Brand Mega-menu in Sticky Header

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/products/[id]/page.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Update header navigation item in page.tsx**
  Add hover-menu wrappers and the Mega-menu content with brand logo image paths in [page.tsx](file:///c:/OmniShoe/frontend/src/app/page.tsx):
  ```tsx
            <nav className="nav-links">
              <a href="#">Nam</a>
              <a href="#">Nữ</a>
              <div className="nav-item-has-submenu">
                <a href="#" className="nav-link-trigger">Thương hiệu</a>
                <div className="mega-menu">
                  <div className="mega-menu-grid">
                    {brands.map((brand) => (
                      <button 
                        key={brand}
                        onClick={() => {
                          setSelectedBrands([brand]);
                          const element = document.getElementById("product-section");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="mega-menu-item"
                      >
                        <img src={brandLogos[brand]} alt={brand} />
                        <span>{brand}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#">Sale</a>
              <a href="#">Xu hướng</a>
            </nav>
  ```

- [ ] **Step 2: Update header navigation item in products/[id]/page.tsx**
  Apply the same markup updates to [page.tsx (Chi tiết sản phẩm)](file:///c:/OmniShoe/frontend/src/app/products/%5Bid%5D/page.tsx):
  ```tsx
            <nav className="nav-links">
              <Link href="/">Nam</Link>
              <Link href="/">Nữ</Link>
              <div className="nav-item-has-submenu">
                <Link href="/" className="nav-link-trigger">Thương hiệu</Link>
                <div className="mega-menu">
                  <div className="mega-menu-grid">
                    {["Nike", "Adidas", "Puma", "Jordan", "New Balance", "Converse", "Vans", "MLB"].map((brand) => (
                      <div key={brand} className="mega-menu-item">
                        <span>{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/">Sale</Link>
              <Link href="/">Xu hướng</Link>
            </nav>
  ```

- [ ] **Step 3: Add Mega-menu styles to globals.css**
  Append menu transitions and container layout rules to [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css):
  ```css
  .nav-item-has-submenu {
    position: relative;
    display: inline-block;
  }
  .mega-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    width: 600px;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 500;
  }
  .nav-item-has-submenu:hover .mega-menu {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(10px);
  }
  .mega-menu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .mega-menu-item {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: var(--transition);
  }
  .mega-menu-item:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    background-color: rgba(255, 107, 0, 0.02);
  }
  .mega-menu-item img {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  .mega-menu-item span {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }
  ```

- [ ] **Step 4: Commit Phase 3 changes**
  Run:
  ```bash
  git add frontend/src/app/page.tsx frontend/src/app/products/[id]/page.tsx frontend/src/app/globals.css
  git commit -m "feat: add hover-triggered brands mega-menu to header navigation"
  ```

---

### Task 4: Verification

- [ ] **Step 1: Run production build**
  Run in frontend:
  ```bash
  npm run build
  ```
  Expected: Success.

- [ ] **Step 2: Run automated test suite**
  Run:
  ```bash
  npm test
  ```
  Expected: Success.
