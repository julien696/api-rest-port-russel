const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');

router.get('/', catwayController.getAllCatways);
router.post('/', catwayController.createCatway);
router.put('/:id', catwayController.updateCatway);
router.patch('/:id', catwayController.partialUpdateCatway);
router.get('/:id', catwayController.getCatwayById);
router.delete('/:id', catwayController.deleteCatway)

module.exports = router