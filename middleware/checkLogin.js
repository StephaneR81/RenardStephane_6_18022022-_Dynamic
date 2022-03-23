const rateLimit = require('express-rate-limit');

//Defines login limit rate parameters
module.exports = rateLimit({
    windowMs: 10 * 60 * 1000, // Blocks attempts for 10 minutes
    max: 3, //Max tries before beeing blocked
    handler: (req, res) => {
        return res.status(429)
            .json({
                message: `Suite à plusieurs tentatives erronées, votre compte est temporairement suspendu. Veuillez retenter ultérieurement.`
            });
    },
    standardHeaders: true,
    legacyHeaders: false
});