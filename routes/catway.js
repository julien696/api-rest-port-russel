const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const validateFormCatway = require('../middleware/validateFormCatway');

router.get('/', catwayController.getAllCatways);
router.post('/create', validateFormCatway, catwayController.createCatway);
router.post('/update', validateFormCatway, catwayController.updateCatway);
router.post('/partialUpdate',validateFormCatway, catwayController.partialUpdateCatway);
router.get('/catway-by-id', catwayController.getCatwayById);
router.post('/delete', catwayController.deleteCatway)

module.exports = router