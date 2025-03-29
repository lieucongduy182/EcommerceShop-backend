const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const orderSchema = new mongoose.Schema(
  {
    orderUserId: {
      type: Number,
      required: true,
    },
    orderCheckout: {
      /**
       * totalPrice
       * totalApplyDiscount
       * feeShip
       */
      type: Object,
      default: {},
    },
    orderShipping: {
      /**
       * street
       * city
       * state
       * country
       */
      type: Object,
      default: {},
    },
    orderPayment: {
      /**
       * paymentMethod
       * paymentStatus
       */
      type: Object,
      default: {},
    },
    orderProducts: {
      type: Array,
      required: true,
    },
    orderTrackingNumber: {
      type: String,
      default: '#0000103292025',
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports.ORDER_STATUS = ORDER_STATUS;
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
