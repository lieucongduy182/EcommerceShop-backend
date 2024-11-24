const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller');
const { authentication } = require('../../auth/authUtil');

router.post('/shop/signUp', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// middleware for auth
router.use(authentication)
router.post('/shop/refreshToken', asyncHandler(accessController.handleRefreshToken));
router.delete('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
