const Transaction = require("../models/transaction");
const logger = require("../utils/logger"); // ← Tambahkan ini

// Tambah transaksi
exports.createTransaction = async (req, res) => {
  try {
    const { ticker, type, lot, price, date } = req.body;

    const transaction = new Transaction({
      userId: req.user.id || req.user,
      ticker,
      type,
      lot,
      price,
      date,
    });

    await transaction.save();
    logger.info(`[CREATE] Transaksi berhasil ditambahkan oleh user ${transaction.userId}`);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error(`[CREATE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal menambahkan transaksi", error: error.message });
  }
};

// Ambil semua transaksi user
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id || req.user;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    logger.info(`[GET] ${transactions.length} transaksi diambil oleh user ${userId}`);
    res.status(200).json(transactions);
  } catch (error) {
    logger.error(`[GET ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil transaksi", error: error.message });
  }
};

// Hapus transaksi
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!transaction) {
      logger.warn(`[DELETE] Transaksi dengan ID ${id} tidak ditemukan untuk user ${userId}`);
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    logger.info(`[DELETE] Transaksi ${id} dihapus oleh user ${userId}`);
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    logger.error(`[DELETE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal menghapus transaksi", error: error.message });
  }
};
