const validator = require('validator');

module.exports = (req, res, next) => {
    if (validator.isEmpty(req.body.email)) { //If the email is empty
        return res.status(401)
            .json({
                message: 'Veuillez renseigner une adresse email valide'
            });
    }
    if (!validator.isEmail(req.body.email)) { //If the input doesn't match email pattern
        return res.status(401)
            .json({
                message: 'Veuillez renseigner une adresse email valide'
            });
    }
    req.body.email = validator.trim(req.body.email); //Removes spaces at start and end of the email
    req.body.email = validator.escape(req.body.email); //Escapes some characters that have special meaning in HTML (<>"&)
    next();
}