const { SuccessResponse } = require('../cores/success.response');
const discountService = require('../services/discount/discount.service');

class DiscountController {
  async generateDiscountCode(req, res, next) {
    return new SuccessResponse({
      message: 'Successful Discount Code Generations!',
      metadata: await discountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  async getAllDiscountCodeByProducts(req, res, next) {
    return new SuccessResponse({
      message: 'Get All Discount Code By Products Success!',
      metadata: await discountService.getAllDiscountCodeByProducts({
        ...req.query,
      }),
    }).send(res);
  }

  async getAllDiscountCodes(req, res, next) {
    return new SuccessResponse({
      message: 'Get All Discount Code By Shops Success!',
      metadata: await discountService.getAllDiscountCodeByShops({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  async getDiscountAmount(req, res, next) {
    return new SuccessResponse({
      message: 'Get Discount Amount Success!',
      metadata: await discountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  }
}

module.exports = new DiscountController();
