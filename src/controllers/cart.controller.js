const { SuccessResponse } = require('../cores/success.response');
const cartService = require('../services/cart.service');

class CartController {
  /**
   *
   * @param {int} userid
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @returns {
   *  message: 'Add To Cart Success !',
   * }
   */

  async addToCart(req, res, next) {
    return new SuccessResponse({
      message: 'Add To Cart Success !',
      metadata: await cartService.addCart(req.body),
    }).send(res);
  }

  async updateCart(req, res, next) {
    return new SuccessResponse({
      message: 'Update Cart Quantity Success !',
      metadata: await cartService.addCartV2(req.body),
    }).send(res);
  }

  async deleteCartItem(req, res, next) {
    return new SuccessResponse({
      message: 'Delete Cart Item Success !',
      metadata: await cartService.deleteCartItem(req.body),
    }).send(res);
  }

  async deleteUserCart(req, res, next) {
    return new SuccessResponse({
      message: 'Delete User Cart Success !',
      metadata: await cartService.deleteUserCart(req.params),
    }).send(res);
  }

  async getListCart(req, res, next) {
    return new SuccessResponse({
      message: 'Get List Cart Success !',
      metadata: await cartService.getListCart(req.body),
    }).send(res);
  }
}

module.exports = new CartController();
