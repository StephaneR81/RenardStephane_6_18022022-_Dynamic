const passwordValidator = require('password-validator');
const validator = require('validator');

const passwordSchema = new passwordValidator();
//Defines the schema for the password and the error message for each statement
passwordSchema
    .is().min(8, 'Le mot de passe doit contenir au minimum 8 caractères')
    .is().max(20, 'Le mot de passe doit contenir au maximum 20 caractères')
    .has().lowercase(1, 'Le mot de passe doit contenir au minimum une lettre minuscule')
    .has().uppercase(1, 'Le mot de passe doit contenir au minimum une lettre majuscule')
    .has().digits(1, 'Le mot de passe doit contenir au minimum un chiffre')
    .has().not().spaces(0, 'Le mot de passe ne doit pas contenir d\'espace');

module.exports = (req, res, next) => {

    const errors = passwordSchema.validate(req.body.password, {
        details: true
    })
    //If there is any error in the entered password
    if (errors.length > 0) {
        return res.status(401)
            .json({
                message: errors[0].message
            });
    }
    req.body.password = validator.escape(req.body.password);
    next();
}