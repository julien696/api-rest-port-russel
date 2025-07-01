const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController')
const authenticateUser = require('../middleware/authenticateUser');

router.get('/:username', authenticateUser, dashboardController.dashboardByUsername);

module.exports = router;