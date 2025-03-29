const { InventoryModel } = require('../../models');
const { convertToObjectId } = require('../../utils');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  const inventory = await InventoryModel.findOne({
    inventoryProductId: convertToObjectId(productId),
    inventoryShopId: shopId,
  });

  if (inventory) {
    inventory.stock += stock;
    return inventory.save();
  }

  return InventoryModel.create({
    inventoryProductId: convertToObjectId(productId),
    inventoryShopId: shopId,
    inventoryStock: stock,
    inventoryLocation: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventoryProductId: convertToObjectId(productId),
    inventoryStock: { $gte: quantity },
  };

  const updateSet = {
    $inc: {
      inventoryStock: -quantity,
    },
    $push: {
      inventoryReservations: {
        cartId,
        quantity,
        createAt: new Date(),
      },
    },
  };

  const options = {
    upsert: true,
    new: true,
  };

  return InventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
