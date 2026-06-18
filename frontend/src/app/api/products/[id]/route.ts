import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const getDataPath = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("frontend")) {
    return path.join(cwd, "src/data/products.json");
  }
  return path.join(cwd, "frontend/src/data/products.json");
};

function mapDbProductToFrontend(dbProduct: any) {
  let glowColor = "rgba(255, 255, 255, 0.45)";
  if (dbProduct.brand === "Adidas") {
    glowColor = "rgba(0, 150, 255, 0.45)";
  } else if (dbProduct.brand === "Jordan") {
    glowColor = "rgba(244, 114, 182, 0.45)";
  } else if (dbProduct.brand === "Puma") {
    glowColor = "rgba(52, 211, 153, 0.45)";
  }

  const sizes = dbProduct.category?.name === "Running" 
    ? [40, 41, 42, 43, 44] 
    : [39, 40, 41, 42, 43];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    price: dbProduct.price.toLocaleString("vi-VN") + "₫",
    oldPrice: dbProduct.originalPrice ? dbProduct.originalPrice.toLocaleString("vi-VN") + "₫" : undefined,
    rating: 4.8,
    reviews: 120,
    badge: dbProduct.badge || "",
    photoId: dbProduct.image,
    category: dbProduct.category?.name || "Lifestyle",
    glowColor,
    sizes
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // Fetch from Express backend
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const dbProduct = await res.json();
    const mapped = mapDbProductToFrontend(dbProduct);
    
    // Merge reviews from local products.json if they exist
    try {
      const dataPath = getDataPath();
      const fileData = await fs.readFile(dataPath, "utf8");
      const products = JSON.parse(fileData);
      const jsonProduct = products.find((p: any) => p.id === id);
      if (jsonProduct) {
        return NextResponse.json({
          ...mapped,
          rating: jsonProduct.rating ?? mapped.rating,
          reviews: jsonProduct.reviews ?? mapped.reviews,
          reviewsList: jsonProduct.reviewsList ?? []
        });
      }
    } catch (err) {
      // If error (like file not found or ID not found), just return default mapped values
    }
    
    return NextResponse.json(mapped);
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
    const body = await request.json();
    
    // Clean up price (remove non-digits to get raw float value)
    const cleanPrice = parseFloat(String(body.price).replace(/[^\d]/g, ""));
    const cleanOriginalPrice = body.oldPrice ? parseFloat(String(body.oldPrice).replace(/[^\d]/g, "")) : null;

    // Map category name to database ID (1: Running, 2: Lifestyle, 3: Basketball)
    let categoryId = 2; // default to Lifestyle
    const catName = String(body.category).toLowerCase();
    if (catName === "running") {
      categoryId = 1;
    } else if (catName === "basketball") {
      categoryId = 3;
    }

    // Call Express backend to update
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        brand: body.brand,
        price: cleanPrice,
        originalPrice: cleanOriginalPrice,
        image: body.photoId || "",
        badge: body.badge || null,
        description: body.description || null,
        categoryId: categoryId
      })
    });

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const updatedDbProduct = await res.json();
    const mappedProduct = mapDbProductToFrontend(updatedDbProduct);
    
    // Optional: write updates to local products.json if it exists to maintain consistency if both methods are run
    try {
      const dataPath = getDataPath();
      const fileData = await fs.readFile(dataPath, "utf8");
      const products = JSON.parse(fileData);
      const index = products.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...body,
          id
        };
        await fs.writeFile(dataPath, JSON.stringify(products, null, 2), "utf8");
      }
    } catch (err) {
      // Ignore errors here since DB is source of truth
    }

    return NextResponse.json(mappedProduct);
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
    
    // Call Express backend to delete
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    // Optional: delete from local products.json if it exists
    try {
      const dataPath = getDataPath();
      const fileData = await fs.readFile(dataPath, "utf8");
      const products = JSON.parse(fileData);
      const filteredProducts = products.filter((p: any) => p.id !== id);
      await fs.writeFile(dataPath, JSON.stringify(filteredProducts, null, 2), "utf8");
    } catch (err) {
      // Ignore
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("API DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
