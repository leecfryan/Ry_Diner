const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Admin-only route (e.g., view all users)
router.get("/admin/users", protect, admin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
