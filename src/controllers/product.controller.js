const { SuccessResponse } = require('../cores/success.response');
const productService = require('../services/product/product.service');

class ProductController {
  async createProduct(req, res, next) {
    const productData = {
      ...req.body,
      shop: req.user.userId,
    };
    return new SuccessResponse({
      message: 'Create Product Success!',
      metadata: await productService.createProduct({
        type: req.body.type,
        payload: productData,
      }),
    }).send(res);
  }

  async updateProduct(req, res, next) {   
    return new SuccessResponse({
      message: 'Update Product Success!',
      metadata: await productService.updateProduct({
        type: req.body.type,
        payload: req.body,
        productId: req.params.id,
      }),
    }).send(res);
  }

  async getAllDrafts(req, res, next) {
    const products = await productService.findAllDraftsForShop({
      shop: req.user.userId,
      limit: req.query.limit,
      skip: req.query.skip,
    });
    return new SuccessResponse({
      message: 'Find All Drafts For Shop Success!',
      metadata: products,
    }).send(res);
  }

  async getAllPublished(req, res, next) {
    const products = await productService.findAllPublishedForShop({
      shop: req.user.userId,
      limit: req.query.limit,
      skip: req.query.skip,
    });
    return new SuccessResponse({
      message: 'Find All Drafts For Shop Success!',
      metadata: products,
    }).send(res);
  }

  async publishProduct(req, res, next) {
    const publishProduct = await productService.publishProductByShop({
      shop: req.user.userId,
      productId: req.params.id,
    });
    return new SuccessResponse({
      message: 'Publish Product Success!',
      metadata: publishProduct,
    }).send(res);
  }

  async unPublishProduct(req, res, next) {
    const unPublishProduct = await productService.unPublishProductByShop({
      shop: req.user.userId,
      productId: req.params.id,
    });
    return new SuccessResponse({
      message: 'Unpublish Product Success!',
      metadata: unPublishProduct,
    }).send(res);
  }

  async getListSearchProducts(req, res, next) {
    const products = await productService.searchProduct({
      keySearch: req.params.keySearch,
      limit: req.query.limit,
      skip: req.query.skip,
    });
    return new SuccessResponse({
      message: 'Search Product Success!',
      metadata: products,
    }).send(res);
  }

  async getListProducts(req, res, next) {
    const products = await productService.findProducts({
      limit: req.query.limit,
      sort: req.query.sort,
      page: req.query.page,
      filter: req.query.filter,
      select: req.query.select,
    });
    return new SuccessResponse({
      message: 'Get Products Success!',
      metadata: products,
    }).send(res);
  }

  async getProductDetail(req, res, next) {
    const product = await productService.findProduct({
      productId: req.params.id,
    });
    return new SuccessResponse({
      message: 'Get Product Detail Success!',
      metadata: product,
    }).send(res);
  }
}

module.exports = new ProductController();
