const Clothing = require('../clothing/clothing.service');
const Electronics = require('../electronics/electronic.service');
const Furniture = require('../furniture/furniture.service');

const ProductType = {
  CLOTHING: 'clothing',
  ELECTRONICS: 'electronic',
  FURNITURE: 'furniture',
};

const ProductTypeMap = {
  [ProductType.CLOTHING]: Clothing,
  [ProductType.ELECTRONICS]: Electronics,
  [ProductType.FURNITURE]: Furniture,
};

module.exports = {
  ProductType,
  ProductTypeMap,
};
