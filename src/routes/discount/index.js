const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const discountController = require('../../controllers/discount.controller');
const { authentication } = require('../../auth/authUtil');

// all user can access
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeByProducts));

// authentication
router.use(authentication);
router.post('', asyncHandler(discountController.generateDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
