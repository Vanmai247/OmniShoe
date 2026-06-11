import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getUploadDir = () => {
  const cwd = process.cwd();
  return cwd.endsWith("frontend")
    ? path.join(cwd, "public/uploads")
    : path.join(cwd, "frontend/public/uploads");
};

// GET /api/media - Lấy danh sách tệp tin trong uploads
export async function GET() {
  try {
    const uploadDir = getUploadDir();
    // Tạo thư mục nếu chưa tồn tại
    await fs.mkdir(uploadDir, { recursive: true });

    const files = await fs.readdir(uploadDir);
    const mediaList = [];

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        const fileExt = path.extname(file).toLowerCase();
        const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(fileExt);
        const isImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].includes(fileExt);
        
        mediaList.push({
          name: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          type: isVideo ? "video" : isImage ? "image" : "other",
        });
      }
    }

    // Sắp xếp theo thời gian tạo mới nhất
    mediaList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(mediaList);
  } catch (error) {
    console.error("API GET media error:", error);
    return NextResponse.json({ error: "Không thể đọc thư mục media ❌" }, { status: 500 });
  }
}

// DELETE /api/media?file=name - Xóa tệp tin khỏi thư mục uploads
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json({ error: "Thiếu tên file cần xóa ⚠️" }, { status: 400 });
    }

    // Ngăn chặn Path Traversal (chỉ cho phép thao tác trên tên file cơ bản)
    const cleanName = path.basename(fileName);
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, cleanName);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File không tồn tại hoặc đã bị xóa trước đó ⚠️" }, { status: 404 });
    }

    // Xóa file vật lý khỏi đĩa
    await fs.unlink(filePath);
    return NextResponse.json({ success: true, message: `Đã xóa file ${cleanName} thành công 🎉` });
  } catch (error) {
    console.error("API DELETE media error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa file ❌" }, { status: 500 });
  }
}
