const express = require('express');
const router = express.Router();

const bookingRoute = require('./booking');
const catwayRoute = require('./catway');
const userRoute = require('./user');
const dashboardRoute = require('./dashboard')

router.get('/', (req, res) => {
    res.render('index', {error : null});
});

router.use('/catways', bookingRoute);
router.use('/catway', catwayRoute);
router.use('/user', userRoute);
router.use('/dashboard', dashboardRoute);

module.exports = router;