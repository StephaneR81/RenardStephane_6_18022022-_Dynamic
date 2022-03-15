const validator = require('validator');
const regex = /[#\\$/%&<>[\]`{|}~]/g;

module.exports = (req, res, next) => {
    //Creates an empty litteral object
    let sauceObject = {};
    //If the request contains a file
    if (req.file) {
        //Retrieves the sauce informations from request in sauceObject
        sauceObject = {
            ...JSON.parse(req.body.sauce)
        }
        //Sanitizes some special characters and so on for each value of the object
        for (const property in sauceObject) {
            sauceObject[property] = sauceObject[property].toString().replace(regex, '');
            sauceObject[property] = validator.trim(sauceObject[property].toString());
            //Generates a default content in case where there would have en empty value after a sanitize treatment
            if (validator.isEmpty(sauceObject[property])) {
                sauceObject[property] = `Unknown ${property}`;
            }
        }
        //Defines the stringified sanitized values in the request
        req.body.sauce = JSON.stringify(sauceObject);
    }
    //In case where there is no file with the request
    else {
        sauceObject = {
            ...req.body
        }
        for (const property in sauceObject) {
            sauceObject[property] = sauceObject[property].toString().replace(regex, '');
            sauceObject[property] = validator.trim(sauceObject[property].toString());
            if (validator.isEmpty(sauceObject[property])) {
                if (validator.isEmpty(sauceObject[property])) {
                    sauceObject[property] = `Unknown ${property}`;
                }
            }
            req.body = sauceObject;
        }
    }

    next();
};