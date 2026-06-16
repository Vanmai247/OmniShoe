import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email và mật khẩu là bắt buộc!" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Đăng nhập thất bại" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Auth login error:", error);
    return NextResponse.json({ error: "Failed to connect to backend auth service" }, { status: 500 });
  }
}
