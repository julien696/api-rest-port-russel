const User = require('../models/User');
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');

/**
 * Récupère les informations de l'utilisateur connecté et les affiche dans la vue 'dashboard.ejs'.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'utilisateur connecté et les variables utiles au dashboard (error, successMsg, catways, bookings, users).
 * @param {Object} res - objet de la réponse HTTP. Affiche la page de dashboard.
 */
exports.dashboardByUsername = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send("Utilisateur non trouvé");

        const error = req.query.error;
        const successMsg = req.query.success;
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();

        res.render('dashboard', { 
            user,
            username: user.name,
            id: user._id,
            email: user.email,
            error,
            successMsg,
            catway:{ _id: '' },
            booking: { _id: '' },
            catways,
            bookings,
            users
        });

    } catch(error) {
        console.error("Erreur dans dashboardByUsername :", error);
        res.status(500).send("Erreur serveur");
    }
};