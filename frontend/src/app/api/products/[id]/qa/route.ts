import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getDataPath = () => {
  const cwd = process.cwd();
  return cwd.endsWith("frontend")
    ? path.join(cwd, "src/data/products.json")
    : path.join(cwd, "frontend/src/data/products.json");
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);

    let productIndex = products.findIndex((p: any) => p.id === id);
    if (productIndex === -1) {
      const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
      try {
        const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
        if (!res.ok) {
          return NextResponse.json({ error: "Không tìm thấy sản phẩm này ⚠️" }, { status: 404 });
        }
        const dbProduct = await res.json();
        const newProductEntry = {
          id: id,
          name: dbProduct.name,
          brand: dbProduct.brand,
          price: dbProduct.price.toLocaleString("vi-VN") + "₫",
          rating: 5,
          reviews: 0,
          reviewsList: [],
          questions: []
        };
        products.push(newProductEntry);
        productIndex = products.length - 1;
      } catch (err) {
        console.error("Failed to verify product existence from backend in QA API:", err);
        return NextResponse.json({ error: "Lỗi kết nối máy chủ để kiểm tra sản phẩm ⚠️" }, { status: 500 });
      }
    }

    const body = await request.json();
    const { name, question } = body;

    if (!name || !question) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin: Tên và Câu hỏi ⚠️" }, { status: 400 });
    }

    const product = products[productIndex];
    if (!product.questions) {
      product.questions = [];
    }

    // Create a new QA object
    const newQA = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      question,
      answer: "", // Initially unanswered
      createdAt: new Date().toISOString(),
    };

    product.questions.unshift(newQA); // Add to top

    products[productIndex] = product;
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json({ 
      success: true, 
      qa: newQA
    }, { status: 201 });
  } catch (error) {
    console.error("API POST QA error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi gửi câu hỏi ❌" }, { status: 500 });
  }
}
