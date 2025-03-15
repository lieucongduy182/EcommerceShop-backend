'use strict';

const { ShopModel } = require('../models');

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
    return ShopModel.findOne({ email }).select(select).lean();
  }

  static findByEmailAndPassword({ email, password }) {
    return ShopModel.findOne({ email, password }).lean();
  }
}

module.exports = ShopService;
