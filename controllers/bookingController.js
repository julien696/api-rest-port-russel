const Booking = require('../models/Booking');
const Catway = require('../models/Catway');

exports.getAllBookings = async (req, res) => {
    try {
        const id = req.params.id;
        const catway = await Catway.findById(id);
        if(!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const bookings = await Booking.find({catway : id});

        res.render('bookings', {
            title : `Réservations du catway ${catway.catwayNumber}`,
            booking : bookings,
            catway : catway
        });
    } catch(error) {
        res.status(500).json({message: 'Erreur serveur', error: error.message})
    };
};

exports.getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        const idReservation = req.params.idReservation;

        const catway = await Catway.findById(id)
        if(!catway) {
           return res.status(404).json({message : 'Catway non trouvé'});
        }

        const booking = await Booking.findOne({ _id : idReservation, catway : catway._id});
        if(!booking) {
            return res.status(404).json({ message: 'Réservation non trouvée pour ce catway' });
        }

        return res.render('bookingById', { title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`, booking, catway});
    } catch(error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const id = req.params.id;

        const catway = await Catway.findById(id);
        if(!catway) {
            return res.status(404).json({ message : 'Catway non trouvé'});
        }

        const bookingData = {
            bookingId: req.body.bookingId,
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
        };

        const newBooking = await Booking.create(bookingData);
        res.status(201).json(newBooking);
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

