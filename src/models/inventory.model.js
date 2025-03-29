const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new mongoose.Schema(
  {
    inventoryProductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    inventoryLocation: {
      type: String,
      default: 'unknown',
    },
    inventoryStock: {
      type: Number,
      required: true,
    },
    inventoryShopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    inventoryReservations: {
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
