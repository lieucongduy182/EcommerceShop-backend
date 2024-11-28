const BaseProduct = require('../base/base.service');
const ClothingModel = require('../../../models/clothes.model');

class Clothing extends BaseProduct {
  async create() {
    const newClothing = await ClothingModel.create(this.attributes);
    if (!newClothing) {
      throw new BadRequestError('Failed to create clothing');
    }

    return this.createBaseProduct({
      productId: newClothing._id,
    });
  }
}

module.exports = Clothing;
