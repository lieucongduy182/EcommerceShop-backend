const { NotFoundError } = require('../../cores/error.response');
const { DiscountModel } = require('../../models');
const { getUnSelectData, getSelectData } = require('../../utils');

const findDiscountCodeActiveRepo = async ({ discountCode, shopId }) => {
 const foundDiscount = await  DiscountModel.findOne({
    discountCode,
    shopId,
    isActive: true,
  });

  if (!foundDiscount) {
    throw new NotFoundError('Discount code not found');
  }

  return foundDiscount;
};

const findAllDiscountCodeUnSelectRepo = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter = {},
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortQuery = sort === 'ctime' ? { createdAt: -1 } : { _id: -1 };
  const unSelectData = getUnSelectData(unSelect);
  const discounts = await DiscountModel.find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .select(unSelectData)
    .lean()
    .exec();
  return discounts;
};

const findAllDiscountCodeSelectRepo = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter = {},
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortQuery = sort === 'ctime' ? { createdAt: -1 } : { _id: -1 };
  const selectData = getSelectData(select);
  const discounts = await DiscountModel.find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .select(selectData)
    .lean()
    .exec();
  return discounts;
};

const checkDiscountExistRepo = async ({ model, filter }) => {
  return model.findOne(filter).lean();
};

module.exports = {
  findDiscountCodeActiveRepo,
  findAllDiscountCodeUnSelectRepo,
  findAllDiscountCodeSelectRepo,
  checkDiscountExistRepo,
};
