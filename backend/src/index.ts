import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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
    // Clear existing data
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Seed Categories
    const running = await prisma.category.create({ data: { name: 'Running' } });
    const lifestyle = await prisma.category.create({ data: { name: 'Lifestyle' } });
    const basketball = await prisma.category.create({ data: { name: 'Basketball' } });

    // Seed Products
    await prisma.product.createMany({
      data: [
        {
          name: 'Nike Air Max 270',
          price: 1890000,
          originalPrice: 2200000,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          brand: 'Nike',
          badge: 'Bestseller',
          description: 'Giày chạy bộ êm ái với đệm khí Air Max cực lớn.',
          categoryId: running.id
        },
        {
          name: 'Adidas Ultraboost Light',
          price: 3200000,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
          brand: 'Adidas',
          badge: 'New Drop',
          description: 'Thế hệ giày chạy bộ hoàn trả năng lượng tối ưu.',
          categoryId: running.id
        },
        {
          name: 'Air Jordan 1 Retro High',
          price: 4500000,
          originalPrice: 5000000,
          image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
          brand: 'Jordan',
          badge: 'Limited',
          description: 'Huyền thoại bóng rổ đường phố với thiết kế cổ điển.',
          categoryId: basketball.id
        }
      ]
    });

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
