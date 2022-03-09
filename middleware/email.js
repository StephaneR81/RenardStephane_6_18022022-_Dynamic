const validator = require('validator');

module.exports = (req, res, next) => {
    if (validator.isEmpty(req.body.email)) {
        return res.status(401)
            .json({
                message: 'Veuillez renseigner une adresse email'
            });
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(401)
            .json({
                message: 'Veuillez renseigner une adresse email valide'
            });
    }
    req.body.email = validator.trim(req.body.email);
    req.body.email = validator.escape(req.body.email);
    next();
}