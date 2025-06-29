const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message : 'Utilisateur non trouvé'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Mot de passe incorrect"});

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

