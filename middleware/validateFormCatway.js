const { body, validationResult } = require('express-validator');

/**
 * Valide les champs du formulaire de catway.
 * @function
 * @param {Object} req - objet de la requête HTTP. Récupére les champs du formulaire de catway.
 * @param {Object} res - objet de la réponse HTTP. Si il y a une erreur redirige vers la page de dashboard avec un message d'erreur.
 * @param {Function} next - fonction pour passer à la suite du middleware.
 */
const validateFormCatway = [
    body('catwayNumber').isNumeric().withMessage('Le numéro du catway doit être un nombre').notEmpty().withMessage('Le numéro du catway est requis'),
    body('catwayState').trim().isString().withMessage('L\'état du catway doit être une chaîne de caractères').notEmpty().withMessage('L\'état du catway est requis'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateFormCatway;