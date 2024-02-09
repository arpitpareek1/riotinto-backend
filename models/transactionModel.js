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
    ifsc: {
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
    product_name: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["in_progress", "expired"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

const withdrawalModel = mongoose.model("withdrawals", withdrawalSchema);
const transactionModel = mongoose.model("transactions", transactionSchema);

module.exports = {
  withdrawalModel,
  transactionModel,
};
