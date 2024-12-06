const express = require("express");
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin: Get all orders
router.get("/", protect, admin, getAllOrders);

// Admin: Update order status
router.put("/:id", protect, admin, updateOrderStatus);

// User: Place an order
router.post("/", protect, createOrder);

module.exports = router;
