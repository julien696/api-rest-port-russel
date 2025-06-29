const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateBooking = require('../middleware/validateBooking')

router.get('/:id/reservations', bookingController.getAllBookings);
router.get('/:id/reservation/:idReservation', bookingController.getBookingById);
router.post('/:id/reservation',validateBooking, bookingController.createBooking);
router.patch('/:id/reservation',validateBooking, bookingController.updateBooking);
router.delete('/:id/reservation', bookingController.deleteBooking);

module.exports = router;