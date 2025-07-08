const Catway = require('../models/Catway');
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * Récupère tous les catways et les affiche dans la vue 'catwaysList.ejs'.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére tous les catways.
 * @param {Object} res - objet de la réponse HTTP. Affiche la liste des catways.
 */
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

/**
 * Crée un catway.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére les champs utile à la création (catwayNumber, type, catwayState) dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.createCatway = async (req, res) => {
    try {
        let { catwayNumber, type, catwayState } = req.body;
        catwayNumber = Number(catwayNumber);
        const newCatway = new Catway({ catwayNumber, type, catwayState });
        await newCatway.save();

        res.redirect('/dashboard?success=Catway créé avec succès');
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
    }
};

/**
 * Modifie un catway grâce à son id.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id du catway et les champs utile à la modification (catwayNumber, type, catwayState) dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.updateCatway = async (req, res) => {
    try {
        let { id, catwayNumber, type, catwayState } = req.body;
        catwayNumber = Number(catwayNumber);
        const catway = await Catway.findById(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user, successMsg: null });
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
        res.status(500).render('dashboard', { error: 'Erreur mise à jour', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};

/**
 * Modifie l'état d'un catway grâce à son id.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id du catway et les champs utile à la modification (catwayState) dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.partialUpdateCatway = async (req, res) => {
    try {
        const { id, catwayState } = req.body;
        const update = {};

        if (catwayState) update.catwayState = catwayState;

        const catway = await Catway.findByIdAndUpdate(id, update, { new: true });
        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user, successMsg: null });
        }

        res.redirect('/dashboard?success=Catway partiellement modifié');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur modification partielle', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};

/**
 * Récupère un catway grâce à son id et l'afficher dans la vue 'catway.ejs'.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id du catway.
 * @param {Object} res - objet de la réponse HTTP. Affiche le détail du catway.
 */
exports.getCatwayById = async (req, res) => {
    try {
        const id = req.params.id;
        const catway = await Catway.findById(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user, successMsg: null });
        }

        return res.render('catway', {
            title: `Détail du catway ${catway.catwayNumber}`,
            catway,
        });
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};

/**
 * Supprime un catway grâce à son id.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id du catway dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.deleteCatway = async (req, res) => {
    try {
        const { id } = req.body; 
        const catway = await Catway.findByIdAndDelete(id);

        if (!catway) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.status(404).render('dashboard', { error: 'Catway non trouvé', catway: null, catways, bookings, users, user: req.user, successMsg: null });
        }

        res.redirect('/dashboard?success=Catway supprimé');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { error: 'Erreur serveur', catway: null, catways, bookings, users, user: req.user, successMsg: null });
    }
};
