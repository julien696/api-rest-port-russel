const { body, validationResult } = require('express-validator');

/**
 * Valide les champs du formulaire d'utilisateur.
 * @function
 * @param {Object} req - objet de la requête HTTP. Récupére les champs du formulaire d'utilisateur.
 * @param {Object} res - objet de la réponse HTTP. Si il y a une erreur redirige vers la page de dashboard avec un message d'erreur.
 * @param {Function} next - fonction pour passer à la suite du middleware.
 */
const validateFormUser = [
    body('name').trim().notEmpty().withMessage('Le nom est requis et minimun 3 lettres').isLength({min:3}),
    body('email').trim().isEmail().withMessage(`L'email n'est pas valide`).normalizeEmail(),
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

module.exports = validateFormUser;