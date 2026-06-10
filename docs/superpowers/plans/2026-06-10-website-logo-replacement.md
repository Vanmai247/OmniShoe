# Website Logo Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current SVG badge & HTML text logo in the website header with a single custom image logo.

**Architecture:** Copy the uploaded logo to the public folder, update the CSS styling with explicit height, and replace the custom HTML/SVG logo tags with a clean `<img>` tag in the main layout header components.

**Tech Stack:** Next.js, React, CSS, TypeScript

---

### Task 1: Setup Asset and Styling

**Files:**
- Create: `frontend/public/logo.png` (Copy from artifact `C:\Users\INNOTECH\.gemini\antigravity-ide\brain\3a1fa7b9-4f35-448d-a904-42f2bb510498\media__1781076066843.png`)
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Copy logo file from brain artifact to public directory**
  Command (PowerShell):
  ```powershell
  Copy-Item "C:\Users\INNOTECH\.gemini\antigravity-ide\brain\3a1fa7b9-4f35-448d-a904-42f2bb510498\media__1781076066843.png" "c:\OmniShoe\frontend\public\logo.png"
  ```

- [ ] **Step 2: Add CSS class `.header-logo-image` to globals.css**
  Add the following class to [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css) at the end of the file or next to logo rules:
  ```css
  .header-logo-image {
    height: 48px;
    width: auto;
    display: block;
    object-fit: contain;
  }
  ```

- [ ] **Step 3: Commit the changes**
  Run:
  ```bash
  git add frontend/public/logo.png frontend/src/app/globals.css
  git commit -m "feat: add logo asset and styling"
  ```

---

### Task 2: Replace Logo in Home Page Header

**Files:**
- Modify: `frontend/src/app/page.tsx:195-248`

- [ ] **Step 1: Replace SVG and text layout with logo image**
  Locate the logo code inside [page.tsx](file:///c:/OmniShoe/frontend/src/app/page.tsx):
  ```tsx
            <div className="header-logo-container">
              <div className="header-logo-badge">
                <div className="header-logo-inner-circle">
                  ...
                </div>
              </div>

              <div className="header-logo-text-wrapper">
                <span className="header-logo-brand-name">Omnishoe</span>
                <span className="header-logo-tagline">Premium Sneakers &amp; Culture</span>
              </div>
            </div>
  ```
  Replace it with:
  ```tsx
            <img src="/logo.png" alt="OmniShoe Logo" className="header-logo-image" />
  ```

- [ ] **Step 2: Commit the changes**
  Run:
  ```bash
  git add frontend/src/app/page.tsx
  git commit -m "feat: update logo on home page header"
  ```

---

### Task 3: Replace Logo in Product Details Page Header

**Files:**
- Modify: `frontend/src/app/products/[id]/page.tsx:159-212`

- [ ] **Step 1: Replace SVG and text layout with logo image**
  Locate the logo code inside [page.tsx](file:///c:/OmniShoe/frontend/src/app/products/%5Bid%5D/page.tsx):
  ```tsx
            <div className="header-logo-container">
              <div className="header-logo-badge">
                <div className="header-logo-inner-circle">
                  ...
                </div>
              </div>

              <div className="header-logo-text-wrapper">
                <span className="header-logo-brand-name">Omnishoe</span>
                <span className="header-logo-tagline">Premium Sneakers &amp; Culture</span>
              </div>
            </div>
  ```
  Replace it with:
  ```tsx
            <img src="/logo.png" alt="OmniShoe Logo" className="header-logo-image" />
  ```

- [ ] **Step 2: Commit the changes**
  Run:
  ```bash
  git add frontend/src/app/products/[id]/page.tsx
  git commit -m "feat: update logo on product details page header"
  ```

---

### Task 4: Verification

- [ ] **Step 1: Run Next.js build to verify compilation**
  Run in frontend directory:
  ```bash
  npm run build
  ```
  Expected: Builds successfully with exit code 0.
