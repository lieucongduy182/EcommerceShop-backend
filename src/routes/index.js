const express = require('express');
const { checkAuth, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

const SIMPLE = '0000';

// middleware
router.use(checkAuth);
router.use(checkPermission(SIMPLE));

router.use('/api/v1/product', require('./product'));
router.use('/api/v1/discount', require('./discount'));
router.use('/api/v1/cart', require('./cart'));
router.use('/api/v1/checkout', require('./checkout'));
router.use('/api/v1', require('./access'));

module.exports = router;
