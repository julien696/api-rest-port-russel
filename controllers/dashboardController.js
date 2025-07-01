const User = require('../models/User');

exports.dashboardByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ name: username });
        if (!user) return res.status(404).send("Utilisateur non trouvé");

        res.render('dashboard', { user, id: user._id, email: user.email, error: null, successMsg: null, catway: null });

    } catch(error) {
        res.status(500).send("Erreur serveur");
    }
};