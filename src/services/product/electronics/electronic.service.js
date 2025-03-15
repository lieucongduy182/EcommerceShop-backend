const BaseProduct = require('../base/base');
const ElectronicModel = require('../../../models/electronics.model');

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
}

module.exports = Electronics;
