const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateFormUser = require('../middleware/validateFormUser');
const validateFormUserUpdate = require('../middleware/validateFormUserUpdate');

router.post('/login', userController.authenticate);
router.post('/create', validateFormUser, userController.createUser);
router.post('/update', validateFormUserUpdate, userController.updateUser);
router.post('/delete', userController.deleteUser);

module.exports = router;