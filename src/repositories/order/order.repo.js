'use strict';

const { OrderModel } = require('../../models');

const createOrder = async (data) => {
  const newOrder = new OrderModel(data);
  return newOrder.save();
};

module.exports = { createOrder };
