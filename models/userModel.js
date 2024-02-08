const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
    money: {
      type: Number,
      required: true,
    },
    rechargePoints: {
      type: Number,
      required: true,
      default: 0
    },
    role: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    isReferAmountAdded: {
      type: Boolean,
      default: false
    },
    isRefered: {
      type: Boolean,
      default: false,
    },
    userReferCode: {
      type: String,
      default: null,
    },
    lastRedeem: {
      type: String,
      default: null
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
