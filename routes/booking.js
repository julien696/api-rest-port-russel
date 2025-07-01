const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateFormBooking = require('../middleware/validateFormBooking')

router.get('/:id/reservations', bookingController.getAllBookings);
router.get('/:id/reservation/:idReservation', bookingController.getBookingById);
router.post('/:id/reservation',validateFormBooking, bookingController.createBooking);
router.post('/:id/reservation', bookingController.updateBooking);
router.post('/:id/reservation', bookingController.deleteBooking);

module.exports = router;