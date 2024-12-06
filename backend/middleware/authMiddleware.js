const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify token
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Not authorized, no token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    throw new Error("Not authorized, token verification failed");
  }
};

// Middleware to check admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    throw new Error("Not authorized as admin");
  }
};

module.exports = { protect, admin };
