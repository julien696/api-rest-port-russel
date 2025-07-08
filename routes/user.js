const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateFormUser = require('../middleware/validateFormUser');
const validateFormUserUpdate = require('../middleware/validateFormUserUpdate');
const authenticateUser = require('../middleware/authenticateUser');


router.post('/login', userController.authenticate);
router.post('/logout', authenticateUser, userController.logout);
router.post('/create', authenticateUser, validateFormUser, userController.createUser);
router.post('/update', authenticateUser, validateFormUserUpdate, userController.updateUser);
router.post('/delete', authenticateUser, userController.deleteUser);

module.exports = router;