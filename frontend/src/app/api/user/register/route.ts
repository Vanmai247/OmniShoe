import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, mật khẩu và tên là bắt buộc!" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Đăng ký thất bại" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Auth register error:", error);
    return NextResponse.json({ error: "Failed to connect to backend auth service" }, { status: 500 });
  }
}
