import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getDataPath = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("frontend")) {
    return path.join(cwd, "src/data/products.json");
  }
  return path.join(cwd, "frontend/src/data/products.json");
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);
    
    const product = products.find((p: any) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("API GET product detail error:", error);
    return NextResponse.json({ error: "Failed to read product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    const body = await request.json();
    
    const updatedProduct = {
      ...products[index],
      ...body,
      id, // ensure ID remains unchanged
      rating: body.rating ? parseFloat(body.rating) : products[index].rating,
      reviews: body.reviews ? parseInt(body.reviews) : products[index].reviews,
    };
    
    products[index] = updatedProduct;
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("API PUT product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const products = JSON.parse(fileData);
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    const filteredProducts = products.filter((p: any) => p.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(filteredProducts, null, 2), "utf8");
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("API DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
