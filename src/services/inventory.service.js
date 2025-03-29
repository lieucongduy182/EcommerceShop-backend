const { NotFoundError } = require('../cores/error.response');
const { InventoryModel } = require('../models');
const { findProductByIdRepo } = require('../repositories/product/product.repo');

class InventoryService {
  static async addStockToInventory({
    productId,
    stock,
    shopId,
    location = 'Binh Thanh, HCM city',
  }) {
    const product = await findProductByIdRepo({
      productId,
    });

    if (!product) {
      throw new NotFoundError('Product does not exist');
    }

    const query = {
      inventoryShopId: shopId,
      inventoryProductId: productId,
    };
    const updateSet = {
      $inc: {
        inventoryStock: stock,
      },
      $set: {
        inventoryLocation: location,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return InventoryModel.create(query, updateSet, options);
  }
}

module.exports = new InventoryService();
