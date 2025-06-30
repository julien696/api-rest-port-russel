const { body, validationResult } = require('express-validator');

const validateUser = [
    body('name').trim().notEmpty().withMessage('Le nom est requis et minimun 3 lettres').isLength({min:3}),
    body('email').isEmail().withMessage(`L'email n'est pas valide`).normalizeEmail(),
    body('password').isLength({min:6}).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render('/dashboard', {
                user: req.user | null,
                error: errors.array().map(error => error.msg).join(' | ')
            });
        }
        next();
    }
];

module.exports = validateUser;