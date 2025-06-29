const express = require('express');
const router = express.Router();

const bookingRoute = require('./booking');
const catwayRoute = require('./catway');
const userRoute = require('./user');

router.use('/catways', bookingRoute);
router.use('/catway', catwayRoute);
router.use('/user', userRoute)


module.exports = router;