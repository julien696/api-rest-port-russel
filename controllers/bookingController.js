const Booking = require('../models/Booking');
const Catway = require('../models/Catway');
const User = require('../models/User');

/**
 * Récupère toutes les réservations et les affiche dans la vue 'bookingsList.ejs'.
 * @function
 * @async
 * @param {import('express').Request} req - objet de la requête HTTP. Récupére toutes les réservations.
 * @param {import('express').Response} res - objet de la réponse HTTP. Affiche la liste des réservations.
 */
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

/**
 * Récupère une réservation par son id et l'affiche dans la vue 'booking.ejs'.
 * @function
 * @async
 * @param {import('express').Request} req - objet de la requête HTTP. Récupére l'id de la réservation.
 * @param {import('express').Response} res - objet de la réponse HTTP. Affiche la réservation.
 */
exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catways, bookings, user: req.user, successMsg: null });
        }
        const catway = await Catway.findOne({ catwayNumber: booking.catwayNumber });
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catways, bookings, user: req.user, successMsg: null });
        }
        return res.render('booking', { title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`, booking, catway });
    } catch(error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catways, bookings, user: req.user, successMsg: null });
    }
};

/**
 * Crée une nouvelle réservation.
 * @function
 * @async
 * @param {import('express').Request} req - objet de la requête HTTP. Récupére les champs utile à la création (catwayNumber, clientName, boatName, checkIn, checkOut) de la réservation dans le body de la requête.
 * @param {import('express').Response} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.createBooking = async (req, res) => {
    try {
        const catwayNumber = Number(req.body.catwayNumber);
        const catway = await Catway.findOne({ catwayNumber });
        if(!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user, successMsg: null });
        }

        const bookingData = {
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
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.body;
        const booking = await Booking.findById(id);

        if (!booking) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catways, bookings, users, user: req.user, successMsg: null });
        }

        const catway = await Catway.findOne({ catwayNumber: booking.catwayNumber });
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catways, bookings, users, user: req.user, successMsg: null });
        }

        const updatedData = {
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut
        };

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catway });
        }

        res.redirect('/dashboard?success=Réservation modifiée');
    } catch(error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.body; 

        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Réservation non trouvée', catways, bookings, users, user: req.user, successMsg: null });
        }

        res.redirect('/dashboard?success=Réservation supprimée');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        return res.status(500).render('dashboard', { error: 'Erreur serveur', catways, bookings, users, user: req.user, successMsg: null });
    }
};
