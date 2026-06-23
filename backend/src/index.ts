import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[request]: ${req.method} ${req.originalUrl} - ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});

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

    if (!user.password) {
      return res.status(400).json({ error: 'Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google!' });
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

// Google Login / Auto-Registration endpoint
app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Thông tin đăng nhập Google thiếu email hoặc tên!' });
    }

    // Upsert user in PostgreSQL (create if not exist, update profile details if exist)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        avatar: avatar || null
      },
      create: {
        email,
        name,
        avatar: avatar || null,
        role: 'USER'
      }
    });

    res.json({
      message: 'Đồng bộ tài khoản Google thành công',
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi đồng bộ tài khoản Google ở máy chủ!' });
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

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Update single product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, originalPrice, image, brand, badge, description, categoryId } = req.body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (image !== undefined) updateData.image = image;
    if (brand !== undefined) updateData.brand = brand;
    if (badge !== undefined) updateData.badge = badge;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete single product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.delete({
      where: { id }
    });
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
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

// Create Order API
app.post('/api/orders', async (req, res) => {
  try {
    const {
      orderId,
      customer,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      shippingMethod,
      status
    } = req.body;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerCity: customer.city,
        customerDistrict: customer.district,
        customerAddress: customer.address,
        customerNotes: customer.notes || null,
        items: JSON.stringify(items),
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        shippingMethod,
        status: status || 'Chờ thanh toán'
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Lỗi tạo đơn hàng ở server' });
  }
});

// Get Order Status API
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    res.json({
      orderId: order.id,
      status: order.status,
      total: order.total,
      paymentMethod: order.paymentMethod,
      customer: {
        fullName: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        city: order.customerCity,
        district: order.customerDistrict,
        address: order.customerAddress,
        notes: order.customerNotes
      }
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin đơn hàng' });
  }
});

// SePay Webhook Endpoint
app.post('/api/sepay/webhook', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const expectedToken = `Apikey ${process.env.SEPAY_API_KEY}`;
    
    if (!authHeader || authHeader !== expectedToken) {
      console.warn('Unauthorized webhook request received');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { content, transferAmount } = req.body;
    if (!content || !transferAmount) {
      return res.status(400).json({ error: 'Missing content or transferAmount' });
    }

    // Match OMN-XXXXXX (with or without hyphen) in content
    const match = content.match(/OMN-?\d+/i);
    if (!match) {
      return res.json({ success: true, message: 'No Order ID found in memo (ignored)' });
    }

    // Normalize matched order ID to OMN-XXXXXX format
    let orderId = match[0].toUpperCase();
    if (!orderId.includes('-')) {
      orderId = orderId.replace('OMN', 'OMN-');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.json({ success: true, message: `Order ${orderId} not found` });
    }

    // Verify that the amount is sufficient
    if (transferAmount >= order.total) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'Đã thanh toán' }
      });
      console.log(`Order ${orderId} marked as PAID via SePay webhook`);
      return res.json({ success: true, message: 'Order marked as paid' });
    } else {
      return res.json({ success: true, message: 'Amount mismatched' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
