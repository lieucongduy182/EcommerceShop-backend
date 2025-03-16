const BaseProduct = require('../base/base');
const { ClothingModel } = require('../../../models');

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

  async updateProduct({ productId }) {
    if (!productId) {
      throw new BadRequestError('Invalid product id');
    }

    const updateData = this;
    if (updateData.attributes) {
      await this.updateBaseProduct({
        productId,
        model: ClothingModel,
        updateData: updateData.attributes,
      });
    }

    const updatedProduct = await this.updateBaseProduct({productId, updateData});
    return updatedProduct
  }
}

module.exports = Clothing;
