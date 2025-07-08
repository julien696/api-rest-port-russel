const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { comparePassword } = require('../services/passwordService');
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');

/**
 * Authentifie un utilisateur.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'email et le mot de passe dans le body de la requête et créer un token.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page dashboard.
 */
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('index', { error: "Utilisateur non trouvé" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.render('index', { error: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

/**
 * Déconnecte un utilisateur.
 * @function
 * @param {Object} req - non utilisé.
 * @param {Object} res - Objet de la réponse HTTP. Supprime le token dans le cookie de la requête et redirige vers la page d'index.
 */
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

/**
 * Crée un utilisateur.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére les champs utile à la création (name, email, password) dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();
            return res.render('dashboard', { 
                user: req.user, 
                id: req.user.id, 
                error: 'Cet email est déjà utilisé', 
                successMsg: null,  
                catways, bookings, users
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.redirect('/dashboard?success=Utilisateur créé avec succès');
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        res.status(500).render('dashboard', { user: req.user, error: 'Erreur serveur', catways, bookings, users, successMsg: null });
    }
};

/**
 * Modifie un utilisateur.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id de l'utilisateur, les champs utile à la modification (newName, newEmail, newPassword) dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.updateUser = async (req, res) => {
    const { id, newName, newEmail, newPassword } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();

            return res.render('dashboard', {
                user: req.user,
                id: req.user.id,
                error: 'Utilisateur non trouvé',
                successMsg: null,
                catways, bookings, users
            });
        }

        if (newName) user.name = newName;
        if (newEmail) user.email = newEmail;
        if (newPassword) user.password = newPassword;

        await user.save();

        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();

        return res.render('dashboard', {
            user: req.user,
            id: req.user.id,
            successMsg: `Utilisateur ${user.name} modifié avec succès`,
            error: null,
            catways,
            bookings,
            users
        });
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();

        return res.render('dashboard', {
            user: req.user,
            error: 'Erreur serveur',
            catways, bookings, users,
            successMsg: null
        });
    }
};

/**
 * Supprime un utilisateur.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére l'id de l'utilisateur dans le body de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page de dashboard avec un message de succès.
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const deleteUser = await User.findByIdAndDelete(id);

        if (!deleteUser) {
            const catways = await Catway.find().sort({catwayNumber: 1});
            const bookings = await Booking.find();
            const users = await User.find();

            return res.render('dashboard', {
                user: req.user,
                id: req.user.id,
                error: `Utilisateur non trouvé`,
                successMsg: null,
                catways, bookings, users
            });
        }

        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();

        return res.render('dashboard', {
            user: req.user,
            id: req.user.id,
            successMsg: `Utilisateur ${id} supprimé`,
            error: null,
            catways, bookings, users
        });
    } catch (error) {
        const catways = await Catway.find().sort({catwayNumber: 1});
        const bookings = await Booking.find();
        const users = await User.find();
        return res.render('dashboard', {
            user: req.user,
            error: 'Erreur serveur',
            successMsg: null,
            catways, bookings, users,
            successMsg: null
        });
    }
};
