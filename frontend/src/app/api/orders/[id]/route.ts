import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
      cache: "no-store"
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API GET order status error:", error);
    return NextResponse.json({ error: "Failed to retrieve order status" }, { status: 500 });
  }
}
