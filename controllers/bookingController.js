const Booking = require('../models/Booking');
const Catway = require('../models/Catway');

exports.getAllBookings = async (req, res) => {
    try {
        const id = req.params.id;
        const catway = await Catway.findById(id);
        if(!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const bookings = await Booking.find({ catwayNumber: catway.catwayNumber });

        res.render('bookingsList', {
            title: `Réservations du catway ${catway.catwayNumber}`,
            booking: bookings,
            catway: catway
        });
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    };
};

exports.getBookingById = async (req, res) => {
    try {
        const catwayId = req.query.id;
        const bookingId = req.query.idReservation;

        const catway = await Catway.findById(catwayId);

        if(!catway) {
           return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null });
        }
        
        const booking = await Booking.findById(bookingId);

        if(!booking || booking.catwayNumber !== catway.catwayNumber) {
           return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catway });
        }
        return res.render('bookingById', { title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`, booking, catway });
    } catch(error) {
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const catwayId = req.params.id;

        const catway = await Catway.findById(catwayId);
        if(!catway) {
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null });
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
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const catwayId = req.params.id;
        const bookingId = req.params.idReservation;
        const catway = await Catway.findById(catwayId);

        if(!catway) {
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null });
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
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null });
    }
};

exports.deleteBooking = async (req, res) => {
   try { 
        const catwayId = req.params.id;
        const bookingId = req.params.idReservation;

        const catway = await Catway.findById(catwayId);

        if (!catway) {
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null });
        }
      
        const result = await Booking.deleteOne({ _id: bookingId, catwayNumber: catway.catwayNumber });
        if (result.deletedCount === 0) {
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catway });
        }

        res.redirect('/dashboard?success=Réservation supprimée');
    } catch (error) {
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null });
    }
};
