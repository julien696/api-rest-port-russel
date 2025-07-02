const Catway = require('../models/Catway');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find().sort({catwayNumber: 1});

        res.render('catwaysList', {
            title: 'Liste des Catways',
            catways: catways,
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, type, catwayState });
        await newCatway.save();

        res.redirect('/dashboard?success=Catway créé avec succès');
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
    }
};

exports.updateCatway = async (req, res) => {
    try {
        const { id, catwayNumber, type, catwayState } = req.body;
        const catway = await Catway.findById(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        catway.catwayNumber = catwayNumber;
        catway.type = type;
        catway.catwayState = catwayState;
        await catway.save();

        res.redirect('/dashboard?success=Catway modifié avec succès');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur mise à jour', catway: null, catways, bookings, users, user: req.user });
    }
};

exports.partialUpdateCatway = async (req, res) => {
    try {
        const { id, type, catwayState } = req.body;
        const update = {};

        if (type) update.type = type;
        if (catwayState) update.catwayState = catwayState;

        const catway = await Catway.findByIdAndUpdate(id, update, { new: true });
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        res.redirect('/dashboard?success=Catway partiellement modifié');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur modification partielle', catway: null, catways, bookings, users, user: req.user });
    }
};

exports.getCatwayById = async (req, res) => {
    const username = req.params.username;

    try {
        const id = req.params.id;
        const catway = await Catway.findById(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        return res.render('catway', {
            title: `Détail du catway ${catway.catwayNumber}`,
            catway,
            username,
        });
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user });
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        const { id } = req.body; 
        const catway = await Catway.findByIdAndDelete(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user });
        }

        res.redirect('/dashboard?success=Catway supprimé');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user });
    }
};
