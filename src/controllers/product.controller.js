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
}

module.exports = new ProductController();
