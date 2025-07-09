const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { ticker, type, lot, price, date } = req.body;

    const transaction = new Transaction({
      userId: req.user,
      ticker,
      type,
      lot,
      price,
      date,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ msg: "Gagal menambahkan transaksi", error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ msg: "Gagal mengambil transaksi", error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menghapus transaksi", error: error.message });
  }
};