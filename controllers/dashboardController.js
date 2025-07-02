const User = require('../models/User');

exports.dashboardByUsername = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send("Utilisateur non trouvé");

        res.render('dashboard', { 
            user,
            username: user.name,
            id: user._id,
            email: user.email,
            error: null,
            successMsg: null,
            catway:{ _id: '' },
            booking: { _id: '' }
        });

    } catch(error) {
        console.error("Erreur dans dashboardByUsername :", error);
        res.status(500).send("Erreur serveur");
    }
};