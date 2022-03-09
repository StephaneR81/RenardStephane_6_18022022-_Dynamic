const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


//CONTROLLER FOR REGISTERING A NEW USER
exports.signup = (req, res) => {
    //Creates a hash for the entered password with 10 salt rounds
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            //Creates the new user
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //Registering the new user in database
            user.save()
                .then(() => {
                    res.status(201)
                        .json({
                            message: 'Utilisateur créé avec succès !'
                        });
                })
                .catch((error) => {
                    res.status(400)
                        .json({
                            message: error.toString()
                        });
                });
        })
        .catch((error) => {
            res.status(500)
                .json({
                    message: error.toString()
                });
        });
};


//CONTROLLER FOR AUTHENTICATING AN EXISTING USER
exports.login = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            //If the user does not exist in database
            if (!user) {
                return res.status(401).json({
                    error: 'Authentification erronée !'
                });
            }
            //Compares the submited password with the one in the database
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    //If the encrypted password in the request is different from the password of the user
                    if (!valid) { 
                        return res.status(401).json({
                            message: 'Authentification erronée !'
                        });
                    }
                    //Authentication successfull, returns the userId from database and a token also containing the userId
                    res.status(200)
                        .json({
                            userId: user._id,
                            token: jsonWebToken.sign({
                                userId: user._id
                            }, process.env.RANDOM_TOKEN_SECRET, {
                                expiresIn: '24h'
                            })
                        });
                })
                //Server error if bcrypt.compare failed for any reason
                .catch((error) => {
                    res.status(500)
                        .json({
                            error
                        });
                });
        })
        //The user does not exist
        .catch((error) => {
            res.status(500)
                .json({
                    error
                });
        });
};