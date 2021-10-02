const express = require('express');
const validate = require('express-validation');
const loginController = require('../controller/login');

const router = express.Router();

// GET => /employees
router.post('/', loginController.login);

module.exports = router;
