const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController')
const authenticateUser = require('../middleware/authenticateUser');

router.get('/', authenticateUser, dashboardController.dashboardByUsername);

module.exports = router;