const validator = require('validator');
const regex = /[#\\$/%&<>[\]`{|}~]/g;

module.exports = (req, res, next) => {
    let sauceObject = {}; //Creates an empty object    
    if (req.file) { //If the request contains a file        
        sauceObject = { //Retrieves the sauce informations from request in sauceObject
            ...JSON.parse(req.body.sauce)
        }
        for (const property in sauceObject) { //Sanitizes some special characters and so on for each value of the object
            sauceObject[property] = sauceObject[property].toString().replace(regex, '');
            sauceObject[property] = validator.trim(sauceObject[property].toString());
            if (validator.isEmpty(sauceObject[property])) { //Generates a default content in case where there would have an empty value after a sanitizing operation
                sauceObject[property] = `Unknown ${property}`;
            }
        }
        req.body.sauce = JSON.stringify(sauceObject); //Stringifies sanitized values and place it back in the request
    } else { //In case where there is no file with the request
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