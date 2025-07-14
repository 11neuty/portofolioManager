const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  portfolioSummary,
  transactionStats
} = require("../controllers/transactionController");

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.get("/portfolio-summary", authMiddleware, portfolioSummary);
router.get("/transaction-stats", authMiddleware, transactionStats);


module.exports = router;
