const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id", authMiddleware, updateTransaction);


module.exports = router;
