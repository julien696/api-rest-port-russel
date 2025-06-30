const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validateUser');
const validateUserUpdate = require('../middleware/validateUserUpdate');

router.post('/login', userController.authenticate);
router.post('/create', validateUser, userController.createUser);
router.post('/update', validateUserUpdate, userController.updateUser);

module.exports = router;