const { BadRequestError } = require('../../../cores/error.response');
const { ProductModel } = require('../../../models');

class Product {
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  async createBaseProduct({ productId }) {
    const newProduct = await ProductModel.create({ ...this, _id: productId });

    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }
    return newProduct;
  }
}

module.exports = Product;
