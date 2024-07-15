const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware');
const accessController = require('../../controllers/access.controller');

router.post('/shop/signUp', asyncHandler(accessController.signUp));

module.exports = router;
