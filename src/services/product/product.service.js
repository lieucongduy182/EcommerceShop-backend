const { ProductTypeMap } = require('./base/config');

class ProductService {
  static productRegistry = new Map();

  static initializeProductTypes() {
    Object.entries(ProductTypeMap).forEach(([type, classRef]) => {
      this.registerProductType({ type, classRef });
    });
  }

  static registerProductType({ type, classRef }) {
    if (!type || !classRef) {
      throw new BadRequestError('Invalid product type registration');
    }
    this.productRegistry.set(type, classRef);
  }

  static createProduct({ type, payload }) {
    const productClass = this.productRegistry.get(type);
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`);
    }
    return new productClass(payload).create();
  }
}

ProductService.initializeProductTypes();

module.exports = ProductService;
