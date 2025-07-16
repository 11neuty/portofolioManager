const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Swagger (only on development)
if (process.env.NODE_ENV !== "production") {
  const { swaggerUi, swaggerSpec } = require("./swagger");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info("📘 Swagger UI available at /api-docs");
}

// Start server only after DB connected
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

startServer();
