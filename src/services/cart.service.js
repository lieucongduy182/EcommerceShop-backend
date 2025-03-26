/**
 * Key features Cart service:
 * - add product to cart
 * - reduce product quantity by one [User]
 * - increase product quantity by one [User]
 * - delete cart
 * - get all cart by user [User]
 * - get cart by item [User]
 */

const { NotFoundError, BadRequestError } = require('../cores/error.response');
const { CartModel } = require('../models');
const { findProductByIdRepo } = require('../repositories/product/product.repo');
const { convertToObjectId } = require('../utils');

class CartService {
  static async createCart({ userId, product }) {
    const query = {
      cartUserId: userId,
      cartState: 'active',
    };

    const updateOrInsert = {
      $addToSet: {
        cartProducts: product,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    return CartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, productId, quantity }) {
    const query = {
      cartUserId: userId,
      cartState: 'active',
      'cartProducts.productId': productId,
    };

    const updateSet = {
      $inc: {
        'cartProducts.$.quantity': quantity,
      },
    };

    const options = {
      new: true,
    };

    return CartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addCart({ userId, product = {} }) {
    const [foundProduct, userCart] = await Promise.all([
      findProductByIdRepo({ productId: product.id }),
      CartModel.findOne({ cartUserId: userId }),
    ]);

    if (!foundProduct) {
      throw new NotFoundError('Product not found');
    }

    const cartProduct = {
      productId: product.id,
      quantity: product.quantity,
      name: foundProduct.name,
      price: foundProduct.price,
      shopId: foundProduct.shop,
    };

    if (!userCart) {
      return this.createCart({ userId, product: cartProduct });
    }

    const isProductExist = userCart.cartProducts.find(
      (cart) => cart.productId === product.id,
    );
    if (isProductExist) {
      return this.updateUserCartQuantity({
        userId,
        productId: product.id,
        quantity: product.quantity,
      });
    }

    userCart.cartProducts.push(cartProduct);
    return userCart.save();
  }

  static async updateCartItems({ userId, shopOrderIds }) {}

  static async addCartV2({ userId, shopOrderIds }) {
    try {
      return Promise.all(
        shopOrderIds.map(async (shopOrder) => {
          return Promise.all(
            shopOrder.itemProducts.map(async (itemProduct) => {
              const { productId, quantity, oldQuantity } = itemProduct;
              const foundProduct = await findProductByIdRepo({ productId });

              if (!foundProduct) {
                throw new NotFoundError('Product not found');
              }

              if (foundProduct.shop.toString() !== shopOrder.shopId) {
                throw new BadRequestError('Product not belong to this shop');
              }

              return this.updateUserCartQuantity({
                userId,
                productId,
                quantity: quantity - oldQuantity,
              });
            }),
          );
        }),
      );
    } catch (error) {
      throw BadRequestError(error.message);
    }
  }

  static async deleteCartItem({ userId, productId }) {
    const query = {
      cartUserId: +userId,
      cartState: 'active',
    };

    const updateSet = {
      $pull: {
        cartProducts: { productId },
      },
    };

    const options = {
      new: true,
    };

    return CartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async deleteUserCart({ userId }) {
    return CartModel.findOneAndDelete({
      cartUserId: userId,
      cartState: 'active',
    });
  }

  static async getListCart({ userId }) {
    return CartModel.findOne({ cartUserId: userId }).lean();
  }
}

module.exports = CartService;
