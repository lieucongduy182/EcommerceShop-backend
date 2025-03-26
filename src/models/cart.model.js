const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new mongoose.Schema(
  {
    cartState: {
      type: String,
      enum: ['active', 'completed', 'pending', 'failed'],
      required: true,
    },
    cartProducts: {
      type: Array,
      required: true,
      default: [],
    },
    cartCountProduct: {
      type: Number,
      required: true,
      default: 0,
    },
    cartUserId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
