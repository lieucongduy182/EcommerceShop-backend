const { BadRequestError } = require('../../cores/error.response');
const ProductModel = require('../../models/products.model');
const ClothingModel = require('../../models/clothes.model');
const ElectronicModel = require('../../models/electronics.model');

const ProductType = {
  CLOTHING: 'clothing',
  ELECTRONICS: 'electronic',
};

class ProductFactory {
  static createProduct({ type, payload }) {
    switch (type) {
      case ProductType.CLOTHING:
        return new Clothing(payload).createClothing();
      case ProductType.ELECTRONICS:
        return new Electronics(payload).createElectronic();
      default:
        throw new BadRequestError(`Invalid product type ${type}`);
    }
  }
}

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

  async createProduct({ productId }) {
    return ProductModel.create({ ...this, _id: productId });
  }
}

class Clothing extends Product {
  async createClothing() {
    const newClothing = await ClothingModel.create(this.attributes);
    if (!newClothing) {
      throw new BadRequestError('Failed to create clothing');
    }

    const newProduct = await super.createProduct({
      productId: newClothing._id,
    });
    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }
    return newProduct;
  }
}

class Electronics extends Product {
  async createElectronic() {
    const newElectronic = await ElectronicModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Failed to create electronic');
    }

    const newProduct = await super.createProduct({
      productId: newElectronic._id,
    });
    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }
    return newProduct;
  }
}

module.exports = ProductFactory;
