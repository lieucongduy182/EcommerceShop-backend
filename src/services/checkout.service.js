const { BadRequestError } = require('../cores/error.response');
const { findCartByIdRepo } = require('../repositories/cart/cart.repo');
const {
  checkProductByServerRepo,
} = require('../repositories/product/product.repo');
const { getDiscountAmount } = require('./discount/discount.service');

class CheckoutService {
  static async checkoutReview({ cartId, userId, shopOrderIds }) {
    const foundCart = await findCartByIdRepo(cartId);

    if (!foundCart) {
      throw new BadRequestError('Cart does not exist');
    }

    if (foundCart.cartUserId !== userId) {
      throw new BadRequestError('Cart does not belong to user');
    }

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const newShopOrderIds = [];

    for (const shopOrderId of shopOrderIds) {
      const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderId;
      // check product available
      const checkProductAvailable = await checkProductByServerRepo({
        products: itemProducts,
      });

      if (!checkProductAvailable[0]) {
        throw new BadRequestError('Something went wrong !');
      }

      // total checkout price
      const checkoutPrice = checkProductAvailable.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceApplyDiscount: checkoutPrice, // initial price
        itemProducts: checkProductAvailable,
        priceRaw: checkoutPrice, // price before discount
      };

      if (shopDiscounts.length > 0) {
        const { totalPrice = 0, discountAmount = 0 } = await getDiscountAmount({
          discountCode: shopDiscounts[0].discountCode,
          userId,
          shopId,
          products: checkProductAvailable,
        });

        if (discountAmount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discountAmount;
          checkoutOrder.totalDiscount += discountAmount;
        }
      }

      // total discount

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;

      newShopOrderIds.push(itemCheckout);
    }
    return {
      shopOrderIds,
      shopOrderId: newShopOrderIds,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;
