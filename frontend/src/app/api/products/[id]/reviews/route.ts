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

    const productIndex = products.findIndex((p: any) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm này ⚠️" }, { status: 404 });
    }

    const body = await request.json();
    const { name, rating, comment } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin: Tên, Số sao, Bình luận ⚠️" }, { status: 400 });
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Số sao đánh giá phải từ 1 đến 5 ⭐" }, { status: 400 });
    }

    const product = products[productIndex];
    if (!product.reviewsList) {
      product.reviewsList = [];
    }

    // Tạo review mới
    const newReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      rating: parsedRating,
      comment,
      createdAt: new Date().toISOString(),
    };

    product.reviewsList.unshift(newReview); // Thêm lên đầu danh sách

    // Tính toán lại rating trung bình và tổng số lượng review
    const totalReviews = product.reviewsList.length;
    const totalStars = product.reviewsList.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = parseFloat((totalStars / totalReviews).toFixed(1));

    product.reviews = totalReviews;
    product.rating = averageRating;

    products[productIndex] = product;
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json({ 
      success: true, 
      review: newReview, 
      productRating: averageRating, 
      productReviews: totalReviews 
    }, { status: 201 });
  } catch (error) {
    console.error("API POST review error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi thêm đánh giá ❌" }, { status: 500 });
  }
}
