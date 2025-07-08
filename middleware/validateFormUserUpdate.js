const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');

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
