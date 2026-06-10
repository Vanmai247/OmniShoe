# 2026-06-10 Website Logo Replacement Design

## Overview
The goal is to replace the current SVG badge & HTML text logo in the website header with a single custom image logo uploaded by the user.

## Proposed Changes
1. Copy the uploaded logo image `media__1781076066843.png` to the public assets folder as [logo.png](file:///c:/OmniShoe/frontend/public/logo.png).
2. Update the header components in the following files:
   - [page.tsx](file:///c:/OmniShoe/frontend/src/app/page.tsx)
   - [page.tsx (Chi tiết sản phẩm)](file:///c:/OmniShoe/frontend/src/app/products/%5Bid%5D/page.tsx)
   Replace the custom SVG badge & HTML text logo layout with a single `<img>` tag rendering `/logo.png`.
3. Add a CSS style for `.header-logo-image` in [globals.css](file:///c:/OmniShoe/frontend/src/app/globals.css) to size the logo image gracefully.

## Verification Plan
1. Check that the dev server builds successfully.
2. Verify visual appearance of the new logo in the header on both:
   - Home page (`/`)
   - Product Details page (`/products/[id]`)
3. Ensure the logo scales properly on mobile viewports.
