const { SuccessResponse } = require('../cores/success.response');
const inventoryService = require('../services/inventory.service');

class InventoryController {
  async addStockToInventory(req, res, next) {
    return new SuccessResponse({
      message: 'Add stock to inventory success',
      metadata: await inventoryService.addStockToInventory(req.body),
    }).send(res);
  }
}

module.exports = new InventoryController();
