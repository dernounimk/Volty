// backend/routes/admin.route.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const router = express.Router();

// إنشاء مستخدم أدمن (تشغيل مرة واحدة فقط)
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // تحقق إذا كان المستخدم موجوداً بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists"
      });
    }

    // إنشاء مستخدم أدمن جديد
    const adminUser = new User({
      name: name || "Admin",
      email,
      password,
      role: "admin"
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating admin user"
    });
  }
});

export default router;