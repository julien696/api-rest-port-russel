const { body, validationResult } = require('express-validator');

const validateFormUserUpdate = [
  body('email').isEmail().withMessage("L'email actuel n'est pas valide").normalizeEmail(),
  body('newName').trim().isLength({ min: 3 }).withMessage('Le nouveau nom doit contenir au moins 3 lettres'),  
  body('newEmail').isEmail().withMessage("Le nouvel email n'est pas valide").normalizeEmail(), 
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('dashboard', {
        user: req.user || null,
        error: errors.array().map(error => error.msg).join(' | ')
      });
    }
    next();
  }
];

module.exports = validateFormUserUpdate;
