const rateLimit = require('express-rate-limit');

//Defines limit rate parameters
const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3,
    handler: (req, res) => {
        return res.status(429)
            .json({
                message: `Suite à plusieurs tentatives erronées, votre compte est temporairement suspendu. Veuillez retenter ultérieurement.`
            });
    },
    standardHeaders: true,
    legacyHeaders: false
});

//Exports the module
module.exports = loginLimiter;