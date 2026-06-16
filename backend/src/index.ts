import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base checking endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OmniShoe Backend' });
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, originalPrice, image, brand, badge, description, categoryId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image,
        brand,
        badge,
        description,
        categoryId: parseInt(categoryId)
      },
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Seed endpoint to populate test data
app.post('/api/seed', async (req, res) => {
  try {
    // Read products from json file
    const jsonPath = path.join(process.cwd(), 'products.json');
    const fileData = await fs.readFile(jsonPath, 'utf8');
    const originalProducts = JSON.parse(fileData);

    // Dynamic Categories Set
    const categoryNames = new Set<string>();
    originalProducts.forEach((item: any) => {
      if (item.category) {
        categoryNames.add(item.category);
      }
    });

    // Seed Categories
    const categoriesMap: Record<string, number> = {};
    for (const catName of Array.from(categoryNames)) {
      const createdCategory = await prisma.category.upsert({
        where: { name: catName },
        update: {},
        create: { name: catName }
      });
      categoriesMap[catName] = createdCategory.id;
    }

    // Seed Products without resetting/clearing database
    let addedCount = 0;
    let skippedCount = 0;

    for (const item of originalProducts) {
      const parsedPrice = parseFloat(String(item.price).replace(/[^\d]/g, ''));
      const parsedOriginalPrice = item.oldPrice ? parseFloat(String(item.oldPrice).replace(/[^\d]/g, '')) : null;
      const catId = categoriesMap[item.category] || Object.values(categoriesMap)[0];

      // Check if product already exists to avoid duplication
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: item.name,
          brand: item.brand || ''
        }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: item.name,
            price: parsedPrice,
            originalPrice: parsedOriginalPrice,
            image: item.photoId || '',
            brand: item.brand || '',
            badge: item.badge || null,
            description: item.description || null,
            categoryId: catId
          }
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    res.json({ 
      message: `Database seed completed.`,
      added: addedCount,
      skipped: skippedCount,
      totalInFile: originalProducts.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed database from JSON file' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
