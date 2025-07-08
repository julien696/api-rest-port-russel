const User = require('../models/User');
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');

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