import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Route to place an order, requires authentication
orderRouter.post("/place", authMiddleware, placeOrder);

// Route to verify an order, does not require authentication
orderRouter.post("/verify", verifyOrder);

// Route to fetch user orders, requires authentication
orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;
