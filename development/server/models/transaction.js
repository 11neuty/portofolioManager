const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticker: String,
  type: {
    type: String,
    enum: ["buy", "sell"],
  },
  lot: Number,
  price: Number,
  date: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);
