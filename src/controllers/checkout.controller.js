const { SuccessResponse } = require('../cores/success.response');
const checkoutService = require('../services/checkout.service');

class CheckoutController {
  async checkoutReview(req, res, next) {
    return new SuccessResponse({
      message: 'Checkout Review Success !',
      metadata: await checkoutService.checkoutReview(req.body),
    }).send(res);
  }
}

module.exports = new CheckoutController();
