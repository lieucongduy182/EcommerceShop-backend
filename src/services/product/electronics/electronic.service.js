const BaseProduct = require('../base/base');
const { ElectronicModel } = require('../../../models');
const { BadRequestError } = require('../../../cores/error.response');
const { removeEmptyFields, parseNestedObject } = require('../../../utils');

class Electronics extends BaseProduct {
  async create() {
    const newElectronic = await ElectronicModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Failed to create electronic');
    }

    return this.createBaseProduct({
      productId: newElectronic._id,
    });
  }

  async updateProduct({ productId }) {
    if (!productId) {
      throw new BadRequestError('Invalid product id');
    }

    const updateData = removeEmptyFields(this);
    if (!!Object.keys(updateData.attributes).length) {
      await this.updateBaseProduct({
        productId,
        model: ElectronicModel,
        updateData: parseNestedObject(updateData.attributes),
      });
    }

    const updatedProduct = await this.updateBaseProduct({
      productId,
      updateData: parseNestedObject(updateData),
    });
    return updatedProduct;
  }
}

module.exports = Electronics;
