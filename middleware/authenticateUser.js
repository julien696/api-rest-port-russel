const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Vérifie si l'utilisateur est connecté.
 * @function
 * @async
 * @param {Object} req - objet de la requête HTTP. Récupére le token dans le cookie de la requête.
 * @param {Object} res - objet de la réponse HTTP. Redirige vers la page d'index si l'utilisateur n'est pas connecté.
 * @param {Function} next - fonction pour passer à la suite du middleware.
 */
const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.id);

        if(!user) return res.redirect('/');

        req.user = user;
        next();
    } catch (error){
        return res.redirect('/');
    }
};

module.exports = authenticateUser;