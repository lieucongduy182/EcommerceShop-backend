const express = require('express');
const router = express.Router();

const accessController = require('../../controllers/access.controller');
router.post('/shop/signUp', accessController.signUp);

module.exports = router;
