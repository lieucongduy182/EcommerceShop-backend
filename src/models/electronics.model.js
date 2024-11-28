const mongoose = require('mongoose');

const COLLECTION_NAME = 'Electronics';
const DOCUMENT_NAME = 'Electronic';

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, electronicSchema);
