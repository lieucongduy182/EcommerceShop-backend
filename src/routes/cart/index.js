const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const cartController = require('../../controllers/cart.controller');

router.post('', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.updateCart));
router.get('', asyncHandler(cartController.getListCart));
router.delete('/item', asyncHandler(cartController.deleteCartItem));
router.delete('/:userId', asyncHandler(cartController.deleteUserCart));

module.exports = router;
