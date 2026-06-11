import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getDataPath = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("frontend")) {
    return path.join(cwd, "src/data/pages.json");
  }
  return path.join(cwd, "frontend/src/data/pages.json");
};

export async function GET() {
  try {
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);
    return NextResponse.json(pages);
  } catch (error) {
    console.error("API GET pages error:", error);
    return NextResponse.json({ error: "Failed to read pages configuration" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);

    const body = await request.json();
    
    if (!body.title || !body.key) {
      return NextResponse.json({ error: "Title and Key (Slug) are required" }, { status: 400 });
    }

    // Sanitize key
    const formattedKey = body.key
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    // Check if key already exists
    const exists = pages.some((p: any) => p.key === formattedKey);
    if (exists) {
      return NextResponse.json({ error: "Slug (Key) already exists" }, { status: 400 });
    }

    // Generate new ID
    const maxId = pages.reduce((max: number, p: any) => p.id > max ? p.id : max, 0);
    const newPage = {
      id: maxId + 1,
      key: formattedKey,
      title: body.title,
      type: body.type || "standard",
      status: body.status || "draft",
      metadata: {
        seoTitle: body.metadata?.seoTitle || `${body.title} | OmniShoe`,
        seoDescription: body.metadata?.seoDescription || ""
      },
      content: {
        bannerBg: body.content?.bannerBg || "",
        subtitle: body.content?.subtitle || "",
        body: body.content?.body || ""
      }
    };

    pages.push(newPage);
    await fs.writeFile(dataPath, JSON.stringify(pages, null, 2), "utf8");

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("API POST page error:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
