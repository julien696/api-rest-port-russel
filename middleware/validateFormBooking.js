const { body, validationResult } = require('express-validator');

/**
 * Valide les champs du formulaire de réservation.
 * @function
 * @param {Object} req - objet de la requête HTTP. Récupére les champs du formulaire de réservation.
 * @param {Object} res - objet de la réponse HTTP. Si il y a une erreur redirige vers la page de dashboard avec un message d'erreur.
 * @param {Function} next - fonction pour passer à la suite du middleware.
 */
const validateFormBooking = [
    body('clientName').trim().isLength({ min: 3 }).withMessage('Le nom du client doit contenir au moins 3 caractères'),
    body('boatName').trim().isLength({ min: 3 }).withMessage('Le nom du bateau doit contenir au moins 3 caractères'),
    body('checkIn').isDate().withMessage('checkIn doit être une date'),
    body('checkOut').isDate().withMessage('checkOut doit être une date'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateFormBooking;
