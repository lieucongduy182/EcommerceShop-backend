const ClothingService = require('../clothing/clothing.service');
const ElectronicsService = require('../electronics/electronic.service');
const FurnitureService = require('../furniture/furniture.service');

const ProductType = {
  CLOTHING: 'clothing',
  ELECTRONICS: 'electronic',
  FURNITURE: 'furniture',
};

const ProductTypeMap = {
  [ProductType.CLOTHING]: ClothingService,
  [ProductType.ELECTRONICS]: ElectronicsService,
  [ProductType.FURNITURE]: FurnitureService,
};

module.exports = {
  ProductType,
  ProductTypeMap,
};
