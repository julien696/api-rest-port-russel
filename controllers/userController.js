const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { comparePassword, hashPassword } = require('../services/passwordService');

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.render('index', { error: "Utilisateur non trouvé" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.render('index', { error: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(`/dashboard/${user.name}`);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('dashboard', { 
                user: req.user, 
                id: req.user.id, 
                error: 'Cet email est déjà utilisé', 
                successMsg: null, 
                catway: null 
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.redirect('/dashboard?success=Utilisateur créé avec succès');
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id, newName, newEmail, newPassword } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.render('dashboard', {
                user: req.user,
                id: req.user.id,
                error: 'Utilisateur non trouvé',
                catway: null 
            });
        }

        if (newName) user.name = newName;
        if (newEmail) user.email = newEmail;
        if (newPassword) user.password = newPassword;

        await user.save();

        return res.render('dashboard', {
            user: req.user,
            id: req.user.id,
            successMsg: `Utilisateur ${id} modifié avec succès`,
            error: null,
            catway: null 
        });
    } catch (error) {
        return res.render('dashboard', {
            user: req.user,
            error: 'Erreur serveur',
            catway: null 
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const deleteUser = await User.findByIdAndDelete(id);

        if (!deleteUser) {
            return res.render('dashboard', {
                user: req.user,
                id: req.user.id,
                error: `Utilisateur non trouvé`,
                successMsg: null,
                catway: null 
            });
        }

        return res.render('dashboard', {
            user: req.user,
            id: req.user.id,
            successMsg: `Utilisateur ${id} supprimé`,
            error: null,
            catway: null 
        });
    } catch (error) {
        return res.render('dashboard', {
            user: req.user,
            error: 'Erreur serveur',
            successMsg: null,
            catway: null 
        });
    }
};
