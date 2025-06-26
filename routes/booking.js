const express = requier('express');
const router = express.Router;
const bookingController = require('../controllers/bookingController');
const validateBooking = require('../middleware/validateBooking')

router.get('/:id/reservations', bookingController.getAllBookings);
router.get('/:id/reservation/:idReservation', bookingController.getBookingById);
router.post('/:id/reservation',validateBooking, bookingController.createBooking);
router.patch('/:id/reservation',validateBooking, bookingController.partialUpdateBooking);
router.delete('/:id/reservation', bookingController.deletebooking);

module.exports = router;