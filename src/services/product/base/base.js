const { BadRequestError } = require('../../../cores/error.response');
const { ProductModel } = require('../../../models');
const {
  insertInventory,
} = require('../../../repositories/inventory/inventory.repo');

const {
  updateProductByIdRepo,
} = require('../../../repositories/product/product.repo');

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

    await insertInventory({
      productId: newProduct._id,
      shopId: newProduct.shop,
      stock: newProduct.quantity,
    });

    return newProduct;
  }

  async updateBaseProduct({ productId, updateData, model = ProductModel }) {
    return updateProductByIdRepo({
      productId,
      model,
      updateData,
    });
  }
}

module.exports = Product;
