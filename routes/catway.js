const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const validateFormCatway = require('../middleware/validateFormCatway');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/catwaysList',authenticateUser, catwayController.getAllCatways);
router.post('/create',authenticateUser, validateFormCatway, catwayController.createCatway);
router.post('/update',authenticateUser, validateFormCatway, catwayController.updateCatway);
router.post('/partialUpdate',authenticateUser, validateFormCatway, catwayController.partialUpdateCatway);
router.get('/:id',authenticateUser, catwayController.getCatwayById);
router.post('/delete', authenticateUser, catwayController.deleteCatway)

module.exports = router