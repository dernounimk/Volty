import express from "express";
import { createOrder, deleteOrder, getAllOrders, toggleConfirmOrders, editOrder } from "../controllers/order.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", createOrder);
router.put("/:orderId", protectRoute, adminRoute, editOrder);
router.get("/", protectRoute, adminRoute, getAllOrders);
router.delete("/:id", protectRoute, adminRoute, deleteOrder);
router.patch("/toggle-confirm", protectRoute, adminRoute, toggleConfirmOrders);

export default router;
