import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import orderRoutes from "./routes/order.route.js";
import settingsRoutes from "./routes/settings.route.js";
import reviewRoutes from "./routes/review.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ===== إعداد CORS محسن =====
app.use(cors({
  origin: [
    "https://volty-store.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// معالجة طلبات OPTIONS مسبقاً
app.options("*", cors());

// ===== Middleware =====
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reviews", reviewRoutes);

// ===== endpoints محسنة للفحص والمراقبة =====
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true,
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime() + " seconds"
  });
});

// endpoint جديد لفحص الحالة المفصلة
app.get("/api/status", (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = 
      dbStatus === 1 ? "Connected" :
      dbStatus === 2 ? "Connecting" :
      dbStatus === 3 ? "Disconnecting" : "Disconnected";
    
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({ 
      success: true,
      status: "Server is running optimally",
      timestamp: new Date().toISOString(),
      server: {
        environment: process.env.NODE_ENV,
        uptime: Math.round(process.uptime()) + " seconds",
        nodeVersion: process.version
      },
      database: {
        status: dbStatusText,
        readyState: dbStatus
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB"
      },
      performance: {
        cpuUsage: process.cpuUsage(),
        platform: process.platform
      }
    });
  } catch (error) {
    console.error("Status endpoint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error checking server status",
      error: error.message
    });
  }
});

// endpoint أساسي للجذر
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "🚀 Zoubir Trends API is running successfully!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      status: "/api/status",
      documentation: "Available at /api/docs"
    }
  });
});

// ===== خدمة الـ frontend =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // خدمة frontend لجميع المسارات غير API
  app.get("*", (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// ===== معالجة الأخطاء محسنة =====
app.use((err, req, res, next) => {
  console.error("🚨 Global error handler:", err);
  
  // تسجيل الخطأ بشكل مفصل
  console.error(`Error Details:
    Method: ${req.method}
    URL: ${req.url}
    IP: ${req.ip}
    Timestamp: ${new Date().toISOString()}
    Error Stack: ${err.stack}
  `);
  
  res.status(500).json({ 
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// معالجة المسارات غير الموجودة
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      "/api/health",
      "/api/status", 
      "/api/auth",
      "/api/products",
      "/api/orders"
    ]
  });
});

// ===== تشغيل السيرفر مع معالجة أفضل =====
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`
✨ ============================================ ✨
🚀 Zoubir Trends Server Started Successfully!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📊 Database: Connecting...
✨ ============================================ ✨
  `);
  
  // الاتصال بقاعدة البيانات بعد بدء السيرفر
  connectDB();
});

// معالجة إغلاق السيرفر بشكل أنيق
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});