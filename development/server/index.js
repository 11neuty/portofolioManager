const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger"); // ✅ Import custom logger

// Load .env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("✅ MongoDB connected"); // ✅ log ke file + console

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`); // ✅ log ke file + console
    });
  })
  .catch((err) => {
    logger.error(`❌ MongoDB connection error: ${err.message}`); // ✅ log error ke file
    process.exit(1);
  });
