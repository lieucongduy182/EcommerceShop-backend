const express = require('express');
const { checkAuth, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

const SIMPLE = '0000';

// middleware
router.use(checkAuth);
router.use(checkPermission(SIMPLE));

router.use('/api/v1', require('./access'));

module.exports = router;
