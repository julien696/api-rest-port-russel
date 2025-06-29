const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const validateCatway = require('../middleware/validateCatway');

router.get('/', catwayController.getAllCatways);
router.post('/', validateCatway, catwayController.createCatway);
router.put('/:id', validateCatway, catwayController.updateCatway);
router.patch('/:id', validateCatway, catwayController.partialUpdateCatway);
router.get('/:id', catwayController.getCatwayById);
router.delete('/:id', catwayController.deleteCatway)

module.exports = router