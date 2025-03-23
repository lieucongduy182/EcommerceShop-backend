const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      ref: 'Product',
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      default: 'fix_amount',
    },
    value: {
      type: Number,
      default: 0,
      required: true,
    },
    discountCode: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUsage: {
      type: Number,
      default: 1,
      required: true,
    },
    maxUsageUsedCount: {
      type: Number,
      required: true,
    },
    maxUsageUsers: {
      type: Array,
      default: [],
    },
    maxUsagePerUser: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliedTo: {
      type: String,
      enum: ['all', 'specific'],
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
