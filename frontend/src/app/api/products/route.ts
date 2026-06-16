import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

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

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    const products = await res.json();
    const mappedProducts = products.map(mapDbProductToFrontend);
    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error("API GET products error:", error);
    return NextResponse.json({ error: "Failed to fetch products from backend" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.brand || !body.price) {
      return NextResponse.json({ error: "Name, Brand, and Price are required" }, { status: 400 });
    }

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

    // Send payload to backend
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

    const newDbProduct = await res.json();
    const mappedProduct = mapDbProductToFrontend(newDbProduct);
    return NextResponse.json(mappedProduct, { status: 201 });
  } catch (error) {
    console.error("API POST product error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
