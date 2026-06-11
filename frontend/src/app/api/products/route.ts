import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getDataPath = () => {
  const cwd = process.cwd();
  // Next.js standard execution directory is the frontend directory
  if (cwd.endsWith("frontend")) {
    return path.join(cwd, "src/data/products.json");
  }
  return path.join(cwd, "frontend/src/data/products.json");
};

export async function GET() {
  try {
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);
    return NextResponse.json(products);
  } catch (error) {
    console.error("API GET products error:", error);
    return NextResponse.json({ error: "Failed to read products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);

    const body = await request.json();
    
    if (!body.name || !body.brand || !body.price) {
      return NextResponse.json({ error: "Name, Brand, and Price are required" }, { status: 400 });
    }

    // Generate new ID or use the one provided (useful for restoring deleted product)
    const maxId = products.reduce((max: number, p: any) => p.id > max ? p.id : max, 0);
    const newProduct = {
      ...body,
      id: body.id || (maxId + 1),
      rating: body.rating ? parseFloat(body.rating) : 5.0,
      reviews: body.reviews ? parseInt(body.reviews) : 0,
      sizes: body.sizes || [39, 40, 41, 42, 43],
    };

    products.push(newProduct);
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("API POST product error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
