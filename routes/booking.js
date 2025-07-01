const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateFormBooking = require('../middleware/validateFormBooking')

router.get('/:id/reservations', bookingController.getAllBookings);
router.get('/booking/search', bookingController.getBookingById);
router.post('/booking/create',validateFormBooking, bookingController.createBooking);
router.post('/booking/update', bookingController.updateBooking);
router.post('/booking/delete', bookingController.deleteBooking);

module.exports = router;