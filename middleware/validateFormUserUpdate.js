const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');

/**
 * Valide les champs du formulaire d'utilisateur.
 * @function
 * @param {Object} req - objet de la requête HTTP. Récupére les champs du formulaire d'utilisateur.
 * @param {Object} res - objet de la réponse HTTP. Si il y a une erreur redirige vers la page de dashboard avec un message d'erreur.
 * @param {Function} next - fonction pour passer à la suite du middleware.
 */
const validateFormUserUpdate = [
  body('newName').trim().isLength({ min: 3 }).withMessage('Le nouveau nom doit contenir au moins 3 lettres'),  
  body('newEmail').trim().isEmail().withMessage("Le nouvel email n'est pas valide").normalizeEmail(), 
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
  
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const users = await User.find();
      const catways = await Catway.find();
      const bookings = await Booking.find();
      return res.render('dashboard', {
        user: req.user,
        users,
        catways,
        bookings,
        error: errors.array().map(error => error.msg).join(' | '),
        successMsg: null
      });
    }
    next();
  }
];

module.exports = validateFormUserUpdate;
