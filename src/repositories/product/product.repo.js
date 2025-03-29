'use strict';

const { ProductModel } = require('../../models');
const { BadRequestError } = require('../../cores/error.response');
const utils = require('../../utils');

const findAllDraftsForShopRepo = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const findAllPublishedForShopRepo = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const publishProductByShopRepo = async ({ shop, productId }) => {
  const foundProductShop = await ProductModel.findOne({
    _id: productId,
    shop,
  });
  if (!foundProductShop) {
    throw new BadRequestError('Product not found');
  }
  foundProductShop.isDraft = false;
  foundProductShop.isPublished = true;

  return foundProductShop.save();
};

const unPublishProductByShopRepo = async ({ shop, productId }) => {
  const foundProductShop = await ProductModel.findOne({
    _id: productId,
    shop,
  });
  if (!foundProductShop) {
    throw new BadRequestError('Product not found');
  }
  foundProductShop.isDraft = true;
  foundProductShop.isPublished = false;
  return foundProductShop.save();
};

const queryProduct = async ({ query, limit, skip }) => {
  return ProductModel.find(query)
    .populate('shop', 'name email status -_id')
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductRepo = async ({ keySearch, limit, skip }) => {
  const regexSearch = new RegExp(keySearch);
  const searchProduct = await ProductModel.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return searchProduct;
};

const findAllProductsRepo = async ({
  limit = 50,
  sort,
  page,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortQuery = sort === 'ctime' ? { createdAt: -1 } : { _id: -1 };
  const selectQuery = utils.getSelectData(select);
  const products = await ProductModel.find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .select(selectQuery)
    .lean()
    .exec();
  return products;
};

const findProductRepo = async ({ productId, unSelect = [] }) => {
  const unSelectQuery = utils.getUnSelectData(unSelect);
  const product = await ProductModel.findById(productId)
    .select(unSelectQuery)
    .lean()
    .exec();
  return product;
};

const updateProductByIdRepo = async ({
  productId,
  updateData,
  model,
  isNew = true,
}) => {
  return model
    .findByIdAndUpdate(productId, updateData, {
      new: isNew,
    })
    .lean()
    .exec();
};

const findProductByIdRepo = async ({ productId }) => {
  return ProductModel.findById(productId).lean().exec();
};

const checkProductByServerRepo = async ({ products }) => {
  return Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductByIdRepo({ productId: product.productId });
      if (foundProduct) {
        return {
          price: product.price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    }),
  );
};

module.exports = {
  findAllDraftsForShopRepo,
  findAllPublishedForShopRepo,
  publishProductByShopRepo,
  unPublishProductByShopRepo,
  searchProductRepo,
  findAllProductsRepo,
  findProductRepo,
  updateProductByIdRepo,
  findProductByIdRepo,
  checkProductByServerRepo,
};
