const express = require('express');
const router = express.Router();

const bookingRoute = require('./booking');
const catwayRoute = require('./catway');

router.use('/catways', bookingRoute);
router.use('/catway', catwayRoute);


module.exports = router;