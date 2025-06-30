const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { comparePassword } = require('../services/passwordService');

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

        res.redirect('/dashboard')
        
    }catch(error){
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

