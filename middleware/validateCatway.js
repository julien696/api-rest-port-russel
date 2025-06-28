const { body, validationResult } = require('express-validator');

const validateCatway = [
    body('catwayNumber').isNumeric().withMessage('Le numéro du catway doit être un nombre').notEmpty().withMessage('Le numéro du catway est requis'),
    body('type').isIn(['long', 'court']).withMessage('Le type doit être soit "long" soit "court"'),
    body('catwayState').isString().withMessage('L\'état du catway doit être une chaîne de caractères').notEmpty().withMessage('L\'état du catway est requis'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateCatway;