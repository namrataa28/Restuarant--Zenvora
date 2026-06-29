import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { address, paymentMethod } = req.body;
    if (!address)
      return res
        .status(400)
        .json({ message: "Delivery address is required", success: false });

    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      user: id,
      items:cart.items.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
      })),
      totalAmount,
      address,
      paymentMethod,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id }).populate("items.menuItem").sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "order status updated", success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykeyid123" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty", success: false });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const options = {
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykeyid123",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummysecretkey123",
    });

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ 
      message: "Failed to create Razorpay order", 
      error: error.message || error,
      success: false 
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { id } = req.user;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Delivery address is required", success: false });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummysecretkey123")
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty", success: false });
      }

      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );

      const newOrder = await Order.create({
        user: id,
        items: cart.items.map((i) => ({
          menuItem: i.menuItem._id,
          quantity: i.quantity,
        })),
        totalAmount,
        address,
        paymentMethod: "Razorpay",
        status: "Pending",
      });

      // Clear cart
      cart.items = [];
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Payment verified and order placed successfully",
        order: newOrder,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment signature", success: false });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};