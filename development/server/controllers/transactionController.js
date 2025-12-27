const Transaction = require("../models/transaction");
const logger = require("../utils/logger");

// ======================
// CREATE TRANSACTION
// ======================
exports.createTransaction = async (req, res) => {
  try {
    const { ticker, type, lot, price, date } = req.body;
    const userId = req.user;

    const transaction = new Transaction({
      userId,
      ticker,
      type,
      lot,
      price,
      date,
    });

    await transaction.save();

    logger.info(`[CREATE] Transaksi ditambahkan oleh user ${userId}: ${JSON.stringify(transaction)}`);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error(`[CREATE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal menambahkan transaksi" });
  }
};

// ======================
// GET TRANSACTIONS
// ======================
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    logger.info(`[GET] ${transactions.length} transaksi diambil oleh user ${userId}`);
    res.json(transactions);
  } catch (error) {
    logger.error(`[GET ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil transaksi" });
  }
};

// ======================
// DELETE TRANSACTION
// ======================
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user;
    const id = req.params.id.trim();

    const deleted = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    logger.info(`[DELETE] Transaksi ${id} dihapus oleh user ${userId}`);
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    logger.error(`[DELETE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal menghapus transaksi" });
  }
};

// ======================
// UPDATE TRANSACTION
// ======================
exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.user;
    const id = req.params.id.trim();

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    logger.info(`[UPDATE] Transaksi ${id} diubah oleh user ${userId}`);
    res.json(updated);
  } catch (error) {
    logger.error(`[UPDATE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengubah transaksi" });
  }
};

// ======================
// PORTFOLIO SUMMARY
// ======================
exports.portfolioSummary = async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ userId }).sort({ date: 1 });

    const summaryMap = {};

    for (const tx of transactions) {
      const { ticker, type, lot, price } = tx;

      if (!summaryMap[ticker]) {
        summaryMap[ticker] = { totalLot: 0, totalCost: 0 };
      }

      if (type === "buy") {
        summaryMap[ticker].totalLot += lot;
        summaryMap[ticker].totalCost += lot * 100 * price;
      }

      if (type === "sell") {
        const currentLot = summaryMap[ticker].totalLot;
        if (currentLot <= 0) continue;

        const avgBuy = summaryMap[ticker].totalCost / currentLot;
        const sellLot = Math.min(lot, currentLot);

        summaryMap[ticker].totalLot -= sellLot;
        summaryMap[ticker].totalCost -= avgBuy * sellLot;

        if (summaryMap[ticker].totalLot === 0) {
          delete summaryMap[ticker];
        }
      }
    }

    const summary = Object.entries(summaryMap).map(([ticker, data]) => ({
      ticker,
      totalLot: data.totalLot,
      totalCost: Math.round(data.totalCost),
      averageBuy: Math.round(data.totalCost / data.totalLot),
    }));

    logger.info(`[PORTFOLIO SUMMARY] Diambil oleh user ${userId}`);
    res.json(summary);
  } catch (error) {
    logger.error(`[PORTFOLIO SUMMARY ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil ringkasan" });
  }
};

// ======================
// TRANSACTION STATS
// ======================
exports.transactionStats = async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ userId });

    let totalInvestment = 0;
    let buyCount = 0;
    let sellCount = 0;

    const lotMap = {};

    for (const tx of transactions) {
      const { ticker, type, lot, price } = tx;

      if (!lotMap[ticker]) {
        lotMap[ticker] = { totalLot: 0, totalCost: 0 };
      }

      if (type === "buy") {
        buyCount++;
        totalInvestment += lot * 100 * price;
        lotMap[ticker].totalLot += lot;
        lotMap[ticker].totalCost += lot * 100 * price;
      }

      if (type === "sell") {
        sellCount++;

        const currentLot = lotMap[ticker].totalLot;
        if (currentLot <= 0) continue;

        const avgBuy = lotMap[ticker].totalCost / currentLot;
        const sellLot = Math.min(lot, currentLot);

        lotMap[ticker].totalLot -= sellLot;
        lotMap[ticker].totalCost -= avgBuy * sellLot;

        if (lotMap[ticker].totalLot === 0) {
          delete lotMap[ticker];
        }
      }
    }

    const top5StocksByLot = Object.entries(lotMap)
      .map(([ticker, data]) => ({
        ticker,
        totalLot: data.totalLot,
        averageBuy: Math.round(data.totalCost / data.totalLot),
      }))
      .sort((a, b) => b.totalLot - a.totalLot)
      .slice(0, 5);

    logger.info(`[TRANSACTION STATS] Statistik transaksi user ${userId}`);
    res.json({
      totalInvestment,
      buyCount,
      sellCount,
      top5StocksByLot,
    });
  } catch (error) {
    logger.error(`[TRANSACTION STATS ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil statistik" });
  }
};
