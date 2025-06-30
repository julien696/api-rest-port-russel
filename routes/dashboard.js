const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController')
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, dashboardController.indexDashboard);

module.exports = router;