import express from "express";

import {adminOnly,protect} from "../middleware/authMiddleware.js"
import { getAllOrders, getUserOrders, placeOrder, updateOrderStatus, getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } from "../controllers/orderController.js";
const orderRoutes=express.Router();
orderRoutes.post("/place",protect,placeOrder);
orderRoutes.get("/my-orders",protect,getUserOrders);
orderRoutes.get("/orders",adminOnly,getAllOrders);
orderRoutes.put("/update-status/:orderId",adminOnly,updateOrderStatus);
orderRoutes.get("/razorpay-key",protect,getRazorpayKey);
orderRoutes.post("/create-razorpay-order",protect,createRazorpayOrder);
orderRoutes.post("/verify-razorpay-payment",protect,verifyRazorpayPayment);


export default orderRoutes;