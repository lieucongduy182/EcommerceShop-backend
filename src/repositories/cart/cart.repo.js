'use strict';

const { CartModel } = require('../../models');
const utils = require('../../utils');

const findCartByIdRepo = async (cartId) => {
  return CartModel.findOne({
    _id: utils.convertToObjectId(cartId),
    cartState: 'active',
  })
    .lean()
    .exec();
};

module.exports = { findCartByIdRepo };
