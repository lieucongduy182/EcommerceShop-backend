'use strict';

const shopModel = require('../models/shops.model');

class ShopService {
  static findByEmail({
    email,
    select = {
      email: 1,
      password: 2,
      name: 1,
      role: 1,
    },
  }) {
    return shopModel.findOne({ email }).select(select).lean();
  }

  static findByEmailAndPassword({ email, password }) {
    return shopModel.findOne({ email, password }).lean();
  }
}

module.exports = ShopService;
