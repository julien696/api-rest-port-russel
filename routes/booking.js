const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateFormBooking = require('../middleware/validateFormBooking')

router.get('/:id/reservations', bookingController.getAllBookings);
router.get('/booking/search', bookingController.getBookingById);
router.post('/:id/reservation/create',validateFormBooking, bookingController.createBooking);
router.post('/:id/reservation/update', bookingController.updateBooking);
router.post('/:id/reservation/delete', bookingController.deleteBooking);

module.exports = router;