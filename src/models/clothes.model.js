const mongoose = require('mongoose');

const COLLECTION_NAME = 'Clothes';
const DOCUMENT_NAME = 'Clothing';

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, clothingSchema);
