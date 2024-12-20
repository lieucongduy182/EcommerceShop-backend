const BaseProduct = require('../base/base.service');
const FurnitureModel = require('../../../models/furniture.model');

class Furniture extends BaseProduct {
  async create() {
    const newFurniture = await FurnitureModel.create(this.attributes);

    if (!newFurniture) {
      throw new BadRequestError('Failed to create furniture');
    }

    return this.createBaseProduct({
      productId: newFurniture._id,
    });
  }
}

module.exports = Furniture;
