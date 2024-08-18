// models/Product.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  product_type: { type: String, required: true },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price_per_product: { type: Number, required: false },
  desc: { type: String, required: false },
});

module.exports = mongoose.model('Product', productSchema);