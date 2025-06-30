const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { comparePassword, hashPassword } = require('../services/passwordService');

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) return res.render('index', { error: "Utilisateur non trouvé" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.render('index', { error: "Mot de passe incorrect" });
        
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.cookie('token', token,{
            httpOnly: true,
            maxAge: 24*60*60*1000
        });

        res.render('dashboard', { user, email: user.email, error: null, successMsg: null } );
        
    }catch(error){
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.render('dashboard', { user: req.user, email: req.user.email, error: 'Cet email est déjà utilisé', successMsg: null })
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.redirect('/dashboard?success=Utilisateur créé avec succès');
    } catch(error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message});
    }
};

exports.updateUser = async (req, res) => {
    const { email, newName,newEmail, newPassword } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.render('dashboard', {user: req.user, email: req.user.email, error:'Utilisateur non trouvé'});
        }

        if(newName) user.name = newName;
        if(newEmail) user.email = newEmail;
        if(newPassword) user.password = newPassword;

        await user.save();

        return res.render('dashboard', {user: req.user, email: req.user.email, successMsg: `Utilisateur modifié avec succès`, error: null})
    }catch(error) {
        return res.render('dashboard', { user: req.user, error: 'Erreur serveur' });
    }
};

exports.deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const deleteUser= await User.findOneAndDelete({ email });
        
        if(!deleteUser){
            return res.render('dashboard', {user: req.user, email: req.user.email, error: `Utilisateur non trouvé`, successMsg : null});
        }

        return res.render('dashboard', { user: req.user, email: req.user.email, successMsg: `Utilisateur ${email} supprimé`, error: null})
    } catch(error) {
        return res.render('dashboard', { user: req.user, error: 'Erreur serveur', successMsg: null });
    }
};