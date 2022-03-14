const jsonWebToken = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        //Gets the token from headers
        const token = req.headers.authorization.split(' ')[1];
        //Decodes the token by using the secret key
        const decodedToken = jsonWebToken.verify(token, process.env.RANDOM_TOKEN_SECRET);
        //Sets userId to userId from decoded token
        const userIdFromToken = decodedToken.userId;
        req.auth = {
            userId: userIdFromToken
        };
        if (req.body.userId && req.body.userId !== userIdFromToken) {
            throw 'Identifiant utilisateur invalide !'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error
        });
    }
};