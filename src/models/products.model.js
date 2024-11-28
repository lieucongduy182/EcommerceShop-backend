const mongoose = require('mongoose');
const { Schema } = mongoose;

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ['electronic', 'clothing', 'furniture', 'accessories', 'others'],
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, productSchema);
