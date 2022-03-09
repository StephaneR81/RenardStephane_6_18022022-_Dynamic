const rateLimit = require('express-rate-limit');

const parameters = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    handler: (req, res, next) => {
        return res.status(429)
            .json({
                error: `Suite à plusieurs tentatives erronées, votre compte est temporairement suspendu. Veuillez retenter plus tard.`
            });
    }
});

module.exports = parameters;