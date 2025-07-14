const Transaction = require("../models/transaction");
const logger = require("../utils/logger");

// Tambah transaksi
exports.createTransaction = async (req, res) => {
  try {
    const { ticker, type, lot, price, date } = req.body;
    const userId = req.user.id || req.user;

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
    const cleanId = req.params.id.trim();
    const userId = req.user.id || req.user;

    const transaction = await Transaction.findOneAndDelete({ _id: cleanId, userId });

    if (!transaction) {
      logger.warn(`[DELETE] Gagal - ID ${cleanId} tidak ditemukan untuk user ${userId}`);
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    logger.info(`[DELETE] Transaksi ${cleanId} dihapus oleh user ${userId}`);
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    logger.error(`[DELETE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal menghapus transaksi", error: error.message });
  }
};

// Ubah transaksi
exports.updateTransaction = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const userId = req.user.id || req.user;

    logger.info(`🔥 [UPDATE] Request body dari user ${userId}: ${JSON.stringify(req.body)}`);

    const updated = await Transaction.findOneAndUpdate(
      { _id: cleanId, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      logger.warn(`[UPDATE] Transaksi dengan ID ${cleanId} tidak ditemukan untuk user ${userId}`);
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    logger.info(`[UPDATE] Transaksi ${cleanId} diubah oleh user ${userId}: ${JSON.stringify(updated)}`);
    res.json(updated);
  } catch (error) {
    logger.error(`[UPDATE ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengubah transaksi", error: error.message });
  }
};

// 📊 Ringkasan Portofolio
exports.portfolioSummary = async (req, res) => {
  try {
    const userId = req.user.id || req.user;
    const transactions = await Transaction.find({ userId });

    const summaryMap = {};

    transactions.forEach((tx) => {
      const { ticker, type, lot, price } = tx;
      if (type !== "buy") return;

      if (!summaryMap[ticker]) {
        summaryMap[ticker] = { totalLot: 0, totalCost: 0 };
      }

      summaryMap[ticker].totalLot += lot;
      summaryMap[ticker].totalCost += lot * price;
    });

    const summary = Object.entries(summaryMap).map(([ticker, data]) => {
      const averageBuy = data.totalCost / data.totalLot || 0;
      return {
        ticker,
        totalLot: data.totalLot,
        totalCost: data.totalCost,
        averageBuy: Math.round(averageBuy),
      };
    });

    logger.info(`[PORTFOLIO SUMMARY] Diambil oleh user ${userId}`);
    res.status(200).json(summary);
  } catch (error) {
    logger.error(`[PORTFOLIO SUMMARY ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil ringkasan", error: error.message });
  }
};

// 📈 Statistik Transaksi
exports.transactionStats = async (req, res) => {
  try {
    const userId = req.user.id || req.user;
    const transactions = await Transaction.find({ userId });

    let totalInvestment = 0;
    let buyCount = 0;
    let sellCount = 0;
    const lotMap = {};
    const avgPrices = [];

    for (const tx of transactions) {
      const { ticker, type, lot, price } = tx;

      if (type === "buy") {
        buyCount++;
        totalInvestment += lot * price;

        if (!lotMap[ticker]) {
          lotMap[ticker] = { totalLot: 0, totalCost: 0 };
        }

        lotMap[ticker].totalLot += lot;
        lotMap[ticker].totalCost += lot * price;
      }

      if (type === "sell") {
        sellCount++;
      }
    }

    const top5 = Object.entries(lotMap)
      .map(([ticker, data]) => {
        const avgBuy = data.totalCost / data.totalLot;
        avgPrices.push(avgBuy);
        return {
          ticker,
          totalLot: data.totalLot,
          averageBuy: Math.round(avgBuy),
        };
      })
      .sort((a, b) => b.totalLot - a.totalLot)
      .slice(0, 5);

    const highestAvgBuy = Math.max(...avgPrices);
    const lowestAvgBuy = Math.min(...avgPrices);

    const summary = {
      totalInvestment,
      buyCount,
      sellCount,
      top5StocksByLot: top5,
      highestAverageBuy: Math.round(highestAvgBuy) || 0,
      lowestAverageBuy: Math.round(lowestAvgBuy) || 0,
    };

    logger.info(`[TRANSACTION STATS] Statistik transaksi user ${userId}`);
    res.status(200).json(summary);
  } catch (error) {
    logger.error(`[TRANSACTION STATS ERROR] ${error.message}`);
    res.status(500).json({ msg: "Gagal mengambil statistik", error: error.message });
  }
};
