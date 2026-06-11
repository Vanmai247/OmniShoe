import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy cookie session
  const sessionCookie = request.cookies.get("omni_admin_session")?.value;

  const username = process.env.ADMIN_USERNAME || "admin";
  const secret = process.env.JWT_SECRET || "fallback_secret";
  
  // Sử dụng btoa thay cho Buffer để tương thích hoàn toàn với Edge Runtime
  const expectedToken = btoa(`${username}:${secret}`);
  
  const isAuthenticated = sessionCookie === expectedToken;

  // 1. Bảo vệ các tuyến đường Admin
  if (pathname.startsWith("/admin")) {
    // Ngoại trừ trang login
    if (pathname === "/admin/login") {
      // Nếu đã đăng nhập, tự động chuyển hướng vào bảng điều khiển admin
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Nếu chưa đăng nhập, tự động chuyển hướng về trang đăng nhập admin
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. Bảo vệ các API ghi dữ liệu sản phẩm (chỉ cho phép GET tự do, ngoại trừ POST gửi review của khách hàng)
  if (pathname.startsWith("/api/products")) {
    const method = request.method;
    const isReviewSubmit = pathname.endsWith("/reviews") && method === "POST";
    
    if (method !== "GET" && !isReviewSubmit && !isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: "Quyền truy cập bị từ chối (Chưa đăng nhập) ⚠️" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2.1. Bảo vệ các API quản lý trang (chỉ cho phép GET tự do, chặn POST/PUT/DELETE nếu chưa đăng nhập)
  if (pathname.startsWith("/api/pages")) {
    const method = request.method;
    if (method !== "GET" && !isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: "Quyền truy cập bị từ chối (Vui lòng đăng nhập Admin) ⚠️" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. Bảo vệ toàn bộ API Media (chặn cả GET, POST, DELETE nếu chưa đăng nhập)
  if (pathname.startsWith("/api/media")) {
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: "Quyền truy cập bị từ chối (Vui lòng đăng nhập Admin) ⚠️" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Chỉ chạy middleware trên các tuyến đường quản trị và API
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/media/:path*", "/api/pages/:path*"],
};
