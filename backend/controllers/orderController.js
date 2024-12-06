const Order = require("../models/Order");

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const activePage = Number(req.query.activePage) || 1;
    const historyPage = Number(req.query.historyPage) || 1;
    const limit = Number(req.query.limit) || 3; // Limit to 3 orders per page

    // Active Orders Pagination
    const activeOrders = await Order.find({ orderStatus: { $ne: "Completed" } })
      .skip((activePage - 1) * limit)
      .limit(limit);
    const activeOrderCount = await Order.countDocuments({
      orderStatus: { $ne: "Completed" },
    });

    // Order History Pagination
    const orderHistory = await Order.find({ orderStatus: "Completed" })
      .skip((historyPage - 1) * limit)
      .limit(limit);
    const orderHistoryCount = await Order.countDocuments({
      orderStatus: "Completed",
    });

    res.status(200).json({
      activeOrders,
      activeOrderTotalPages: Math.ceil(activeOrderCount / limit),
      orderHistory,
      historyTotalPages: Math.ceil(orderHistoryCount / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status || order.orderStatus;
  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
};

// User: Place an order
const createOrder = async (req, res) => {
  try {
    const { customerName, items, totalPrice } = req.body;

    // Validation: Ensure required fields are provided
    if (!customerName || !items || items.length === 0 || !totalPrice) {
      res.status(400);
      throw new Error(
        "All fields are required (customerName, items, totalPrice)"
      );
    }

    // Save the order to the database
    const newOrder = await Order.create({
      customerName,
      items,
      totalPrice,
      orderStatus: "Pending", // Default status
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllOrders, createOrder, updateOrderStatus };
