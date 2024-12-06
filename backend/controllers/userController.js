const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  // Ensure only one admin is created
  if (email === process.env.ADMIN_EMAIL) {
    // Check if an admin account already exists
    const adminExists = await User.findOne({ role: "Admin" });
    if (adminExists) throw new Error("Admin account already exists");

    // Create the admin account
    const user = await User.create({
      name,
      email,
      password,
      role: "Admin",
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      throw new Error("Invalid admin data");
    }
  } else {
    // Create regular user account
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      throw new Error("Invalid user data");
    }
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide both email and password");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Generate token and send response
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message || "An error occurred during login",
    });
  }
};
module.exports = { registerUser, loginUser };
