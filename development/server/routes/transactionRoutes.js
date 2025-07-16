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

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API untuk transaksi saham
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         ticker:
 *           type: string
 *           example: BBCA
 *         type:
 *           type: string
 *           enum: [buy, sell]
 *           example: buy
 *         lot:
 *           type: integer
 *           example: 100
 *         price:
 *           type: number
 *           example: 8500
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-07-10
 *         userId:
 *           type: string
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Tambah transaksi saham
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaksi berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
router.post("/", authMiddleware, createTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get("/", authMiddleware, getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi berdasarkan ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID transaksi yang ingin dihapus
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.delete("/:id", authMiddleware, deleteTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaksi berdasarkan ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID transaksi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaksi berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.put("/:id", authMiddleware, updateTransaction);

/**
 * @swagger
 * /transactions/portfolio-summary:
 *   get:
 *     summary: Dapatkan ringkasan portofolio user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ringkasan portofolio saham
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticker:
 *                     type: string
 *                     example: BBCA
 *                   totalLot:
 *                     type: integer
 *                     example: 200
 *                   totalCost:
 *                     type: number
 *                     example: 17000000
 *                   averageBuy:
 *                     type: number
 *                     example: 8500
 */
router.get("/portfolio-summary", authMiddleware, portfolioSummary);

/**
 * @swagger
 * /transactions/transaction-stats:
 *   get:
 *     summary: Statistik transaksi user (modal, jumlah transaksi, top 5 saham, dll.)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik transaksi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalInvestment:
 *                   type: number
 *                   example: 50000000
 *                 buyCount:
 *                   type: integer
 *                   example: 10
 *                 sellCount:
 *                   type: integer
 *                   example: 3
 *                 highestAverageBuy:
 *                   type: number
 *                   example: 9500
 *                 lowestAverageBuy:
 *                   type: number
 *                   example: 8000
 *                 top5StocksByLot:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticker:
 *                         type: string
 *                         example: BBRI
 *                       totalLot:
 *                         type: integer
 *                         example: 300
 *                       averageBuy:
 *                         type: number
 *                         example: 8500
 */
router.get("/transaction-stats", authMiddleware, transactionStats);

module.exports = router;
