const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtil');

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProducts),
);
router.get('/', asyncHandler(productController.getListProducts));
router.get('/:id', asyncHandler(productController.getProductDetail));

router.use(authentication);
router.post('/', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct));

router.patch('/:id', asyncHandler(productController.updateProduct));

router.get('/drafts/all', asyncHandler(productController.getAllDrafts));
router.get('/published/all', asyncHandler(productController.getAllPublished));

module.exports = router;
