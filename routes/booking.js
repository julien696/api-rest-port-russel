const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateFormBooking = require('../middleware/validateFormBooking');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/:username/bookingsList',authenticateUser, bookingController.getAllBookings);
router.get('/booking/search', bookingController.getBookingById);
router.post('/booking/create',validateFormBooking, bookingController.createBooking);
router.post('/booking/update', bookingController.updateBooking);
router.post('/booking/delete', bookingController.deleteBooking);

module.exports = router;