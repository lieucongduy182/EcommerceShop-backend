const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const checkoutController = require('../../controllers/checkout.controller');

router.get('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router;
