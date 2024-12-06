const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/orders", orderRoutes); // Order routes
app.use("/api/users", userRoutes); // User authentication and admin routes

// Error Handling Middleware
app.use(errorHandler);

// Prevent Crash from Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close the server if necessary
  process.exit(1);
});

if (process.env.NODE_ENV === "development") {
  require("./seedAdmin"); // Automatically create admin account during development
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});
