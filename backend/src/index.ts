import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base checking endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OmniShoe Backend' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email này đã được đăng ký!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate avatar initials from name
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar: initials || 'US',
        role: 'USER'
      }
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi máy chủ trong quá trình đăng ký!' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu!' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác!' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi máy chủ trong quá trình đăng nhập!' });
  }
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
    // Clear existing data and reset autoincrement sequences to 1
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Product", "Category", "User" RESTART IDENTITY CASCADE;');

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

    // Seed Products
    for (const item of originalProducts) {
      const parsedPrice = parseFloat(String(item.price).replace(/[^\d]/g, ''));
      const parsedOriginalPrice = (item.oldPrice || item.originalPrice) 
        ? parseFloat(String(item.oldPrice || item.originalPrice).replace(/[^\d]/g, '')) 
        : null;
      const catId = categoriesMap[item.category] || Object.values(categoriesMap)[0];

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
    }

    // Seed Default Admin User
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: adminHashedPassword,
        name: 'Nguyễn Minh Đức',
        avatar: 'NĐ',
        role: 'ADMIN'
      }
    });

    res.json({ message: `Database seeded successfully with ${originalProducts.length} products and 1 admin user.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed database from JSON file' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
