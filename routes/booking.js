const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateFormBooking = require('../middleware/validateFormBooking');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/bookingsList',authenticateUser, bookingController.getAllBookings);
router.get('/:id',authenticateUser, bookingController.getBookingById);
router.post('/create',authenticateUser, validateFormBooking, bookingController.createBooking);
router.post('/update',authenticateUser, bookingController.updateBooking);
router.post('/delete',authenticateUser, bookingController.deleteBooking);

module.exports = router;