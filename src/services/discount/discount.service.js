const {
  BadRequestError,
  NotFoundError,
} = require('../../cores/error.response');
const { DiscountModel } = require('../../models');
const {
  findDiscountCodeActiveRepo,
  findAllDiscountCodeUnSelectRepo,
} = require('../../repositories/discount/discount.repo');
const {
  findAllProductsRepo,
} = require('../../repositories/product/product.repo');
const { convertToObjectId } = require('../../utils');

class DiscountService {
  static async createDiscountCode(body) {
    const {
      name,
      description,
      type,
      value,
      discountCode,
      startDate,
      endDate,
      isActive,
      minOrderValue,
      shopId,
      productIds,
      appliedTo,
      maxUsage,
      maxUsageUsedCount,
      maxUsageUsers,
      maxUsagePerUser,
    } = body;

    if (new Date() > new Date(endDate)) {
      throw new BadRequestError('Discount code create invalid');
    } else if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError('Invalid date range');
    }

    const foundDiscountCode = await findDiscountCodeActiveRepo({
      discountCode,
      shopId,
    });

    if (foundDiscountCode) {
      throw new BadRequestError('Discount code already exists');
    }

    const newDiscount = await DiscountModel.create({
      name,
      description,
      type,
      value,
      discountCode,
      startDate,
      endDate,
      isActive,
      minOrderValue,
      shopId: convertToObjectId(shopId),
      productIds,
      appliedTo,
      maxUsage,
      maxUsageUsedCount,
      maxUsageUsers,
      maxUsagePerUser,
    });

    if (!newDiscount) {
      throw new BadRequestError('Failed to create discount code');
    }

    return newDiscount;
  }

  static async updateDiscountCode(body) {}

  static async getAllDiscountCodeByProducts({
    shopId,
    discountCode,
    limit,
    page,
  }) {
    const foundDiscountCode = await findDiscountCodeActiveRepo({
      discountCode,
      shopId,
    });

    const { appliedTo, productIds } = foundDiscountCode;
    const queryProduct = {
      filter: {
        isPublished: true,
        shop: shopId,
      },
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['name', 'price'],
    };

    if (appliedTo === 'specific') {
      queryProduct.filter._id = {
        $in: productIds,
      };
    }
    const products = await findAllProductsRepo(queryProduct);

    return products;
  }

  static async getAllDiscountCodeByShops({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelectRepo({
      limit,
      page,
      filter: {
        shopId: convertToObjectId(shopId),
        isActive: true,
      },
      unSelect: ['__v', 'shopId'],
    });

    return discounts;
  }

  static async getDiscountAmount({ products, discountCode, shopId, userId }) {
    const foundDiscount = await findDiscountCodeActiveRepo({
      discountCode,
      shopId,
    });

    const { isActive, maxUsage, startDate, endDate } = foundDiscount;
    if (!maxUsage) {
      throw new NotFoundError('Discount code is not available');
    }
    if (!isActive) {
      throw new NotFoundError('Discount code has been disabled');
    }
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new NotFoundError('Discount code has expired');
    }

    // check xem có giá trị order tối thiểu không
    const { minOrderValue } = foundDiscount;
    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrder < minOrderValue) {
        throw new NotFoundError(
          `Order require minimum value of ${minOrderValue}`,
        );
      }
    }

    const { maxUsagePerUser, maxUsageUsers } = foundDiscount;
    if (maxUsagePerUser > 0) {
      const userUseDiscount = maxUsageUsers?.find((user) => user === userId);
      if (userUseDiscount) {
        // handle max usage discount per user
        // throw new BadRequestError('Discount code has been used');
      }
    }

    // check xem discount là type gì và giá trị discount
    const { type, value } = foundDiscount;
    const discountAmount =
      type === 'fix_amount' ? value : (totalOrder * value) / 100;

    return {
      totalOrder,
      discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }

  static async removeDiscountCode({ discountCode, shopId }) {
    const foundDiscount = await findDiscountCodeActiveRepo({
      discountCode,
      shopId,
    });
    foundDiscount.isActive = false;
    return foundDiscount.save();
  }

  static async userCancelDiscountCode({ discountCode, shopId, userId }) {
    const foundDiscount = await findDiscountCodeActiveRepo({
      discountCode,
      shopId,
    });
    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { maxUsageUsers: userId }, // remove element in array
      $inc: { maxUsageUsedCount: -1, maxUsage: 1 },
    });

    return result;
  }
}

module.exports = DiscountService;
