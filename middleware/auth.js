const jsonWebToken = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1]; //Gets the token from headers
        const decodedToken = jsonWebToken.verify(token, process.env.RANDOM_TOKEN_SECRET); //Decodes the token by using the secret key
        const userIdFromToken = decodedToken.userId; //Sets userIdFromToken to userId from decoded token
        req.auth = {
            userId: userIdFromToken
        };
        if (req.body.userId && req.body.userId !== userIdFromToken) {
            throw `Echec de l'authentification !`
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error
        });
    }
};