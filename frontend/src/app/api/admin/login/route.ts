import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username === expectedUsername && password === expectedPassword) {
      const secret = process.env.JWT_SECRET || "fallback_secret";
      const sessionToken = Buffer.from(`${username}:${secret}`).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set({
        name: "omni_admin_session",
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 ngày
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Logged in successfully" });
    }

    return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng nhập" }, { status: 500 });
  }
}
