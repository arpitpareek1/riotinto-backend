// Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  imageSource: { type: String, required: true },
  link: { type: String, required: true },
  price: { type: Number, required: true },
  title: { type: String, required: true },
  dailyIncome: { type: Number, required: true },
  validity: { type: Number, required: true },
  purchaseLimit: { type: Number, required: true },
  desc: { type: String, required: true },
  isHot: { type: Boolean, require: true, default: false }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
