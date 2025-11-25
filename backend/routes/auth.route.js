import express from "express";
import { login, logout, refreshToken, getCurrentUser, createAdminUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getCurrentUser);
router.post("/create-admin", createAdminUser);

export default router;
