import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên ⚠️" }, { status: 400 });
    }

    // Đọc file thành buffer nhị phân
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Xác định thư mục public/uploads
    const cwd = process.cwd();
    const uploadDir = cwd.endsWith("frontend")
      ? path.join(cwd, "public/uploads")
      : path.join(cwd, "frontend/public/uploads");

    // Tạo thư mục uploads nếu chưa tồn tại
    await fs.mkdir(uploadDir, { recursive: true });

    // Trích xuất phần đuôi mở rộng của file
    const originalName = file.name;
    const fileExt = path.extname(originalName) || ".png";
    
    // Đặt tên file kết hợp timestamp để tránh trùng lặp
    const cleanFileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const filePath = path.join(uploadDir, cleanFileName);

    // Ghi file nhị phân xuống đĩa
    await fs.writeFile(filePath, buffer);

    // Trả về URL tương đối để hiển thị trên web
    const fileUrl = `/uploads/${cleanFileName}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("API Upload error:", error);
    return NextResponse.json({ error: "Lỗi server khi lưu file tải lên ❌" }, { status: 500 });
  }
}
