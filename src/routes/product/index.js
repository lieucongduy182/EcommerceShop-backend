const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');

router.post('/', asyncHandler(productController.createProduct));

module.exports = router;
