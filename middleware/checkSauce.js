const validator = require('validator');


module.exports = (req, res, next) => {

    console.log(req.body);

    next();
}