const { InventoryModel } = require('../../models');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  const inventory = await InventoryModel.findOne({
    productId,
    shopId,
  });

  if (inventory) {
    inventory.stock += stock;
    return inventory.save();
  }

  return InventoryModel.create({
    productId,
    shopId,
    stock,
    location,
  });
};

module.exports = {
  insertInventory,
};
