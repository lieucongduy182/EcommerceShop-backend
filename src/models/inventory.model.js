const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    location: {
      type: String,
      default: 'unknown',
    },
    stock: {
      type: Number,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    reservations: {
      type: Array,
      default: [],
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
