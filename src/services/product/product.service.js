const { BadRequestError } = require('../../cores/error.response');
const {
  findAllDraftsForShopRepo,
  findAllPublishedForShopRepo,
  publishProductByShopRepo,
  unPublishProductByShopRepo,
  searchProductRepo,
  findAllProductsRepo,
  findProductRepo,
} = require('../../repositories/product/product.repo');
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

  static updateProduct({ type, payload, productId }) {
    const productClass = this.productRegistry.get(type);
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`);
    }
    return new productClass(payload).updateProduct({ productId });
  }

  static async publishProductByShop({ shop, productId }) {
    return publishProductByShopRepo({ shop, productId });
  }

  static async unPublishProductByShop({ shop, productId }) {
    return unPublishProductByShopRepo({ shop, productId });
  }

  static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isDraft: true };
    return findAllDraftsForShopRepo({ query, limit, skip });
  }

  static async findAllPublishedForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isPublished: true };
    return findAllPublishedForShopRepo({ query, limit, skip });
  }

  static async searchProduct({ keySearch, limit = 50, skip = 0 }) {
    return searchProductRepo({ keySearch, limit, skip });
  }

  static async findAllProducts({ keySearch, limit = 50, skip = 0 }) {
    return searchProductRepo({ keySearch, limit, skip });
  }

  static async findProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = {},
    select = {},
  }) {
    return findAllProductsRepo({
      limit,
      sort,
      page,
      filter,
      select: ['name', 'price', 'quantity', 'type'],
    });
  }

  static async findProduct({ productId }) {
    return findProductRepo({ productId, unSelect: ['__v'] });
  }
}

ProductService.initializeProductTypes();

module.exports = ProductService;
