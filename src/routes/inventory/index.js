const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const inventoryController = require('../../controllers/inventory.controller');
const { authentication } = require('../../auth/authUtil');

router.use(authentication);
router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
