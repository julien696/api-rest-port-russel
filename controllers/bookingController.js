const Booking = require('../models/Booking');
const Catway = require('../models/Catway');
const User = require('../models/User');

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}); 

        res.render('bookingsList', {
            title: `Liste de toutes les réservations`,
            bookings: bookings,
            catway: null,
            user: req.user 
        });
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id || req.query.idReservation;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catways, bookings, user: req.user });
        }
        const catway = await Catway.findOne({ catwayNumber: booking.catwayNumber });
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catways, bookings, user: req.user });
        }
        return res.render('booking', { title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`, booking, catway });
    } catch(error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catways, bookings, user: req.user });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const catwayId = req.params.id;
        const catway = await Catway.findById(catwayId);
        if(!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        const bookingData = {
            bookingId: req.body.bookingId,
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
        };

        await Booking.create(bookingData);

        res.redirect('/dashboard?success=Réservation enregistrée');
    } catch(error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { catwayId, bookingId } = req.body;
        const catway = await Catway.findById(catwayId);

        if(!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        const updatedData = {
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut
        };
        
        const booking = await Booking.findOneAndUpdate(
            { _id: bookingId, catwayNumber: catway.catwayNumber }, 
            updatedData,
            { new: true, runValidators: true } 
        );

        if(!booking) {
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catway });
        }

        res.redirect('/dashboard?success=Réservation modifiée');
    } catch(error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user });
    }
};

exports.deleteBooking = async (req, res) => {
   try { 
        const catwayId = req.params.id;
        const bookingId = req.params.idReservation;
        const catway = await Catway.findById(catwayId);
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }
      
        const result = await Booking.deleteOne({ _id: bookingId, catwayNumber: catway.catwayNumber });
        if (result.deletedCount === 0) {
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catway });
        }

        res.redirect('/dashboard?success=Réservation supprimée');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user });
    }
};
