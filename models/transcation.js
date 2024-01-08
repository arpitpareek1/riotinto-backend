const mongoose = require("mongoose");

// Withdrawal Schema
const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    cardInfo: {
      type: String,
      default: null,
    },
    iefc_code: {
      type: String,
      default: null,
    },
    bank_name: {
      type: String,
      default: null,
    },
    upi_id: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      required: true,
    },
    // Add more fields as needed for transaction details
  },
  { timestamps: true }
);

// Withdrawal Model
const withdrawalModel = mongoose.model("withdrawals", withdrawalSchema);

// Transaction Model
const transactionModel = mongoose.model("transactions", transactionSchema);

module.exports = {
  withdrawalModel,
  transactionModel,
};
