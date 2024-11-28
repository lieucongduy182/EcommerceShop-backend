const mongoose = require('mongoose');

const COLLECTION_NAME = 'Furniture';
const DOCUMENT_NAME = 'Furniture';

const furnitureSchema = new mongoose.Schema(
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

module.exports = mongoose.model(DOCUMENT_NAME, furnitureSchema);
