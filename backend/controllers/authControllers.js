const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/User');



exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
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



exports.login = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) { // IF USER DOES NOT EXIST IN DATABASE
                return res.status(401).json({
                    message: 'Utilisateur inexistant'
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) { //IF ENCRYPTED REQUEST PASSWORD IS DIFFERENT FROM USER PASSWORD
                        return res.status(401).json({
                            message: 'Mot de passe invalide'
                        });
                    }
                    res.status(200) //RETURNS THE USER ID FROM DATABASE AND A TOKEN CONTAINING THE USER ID
                        .json({
                            userId: user._id,
                            token: jsonWebToken.sign({
                                userid: user._id
                            }, 'RANDOM_TOKEN_SECRET', {
                                expiresIn: '1h'
                            })
                        });
                })
                .catch((error) => {
                    res.status(500)
                        .json({
                            message: error.toString()
                        });
                });
        })
        .catch((error) => { //UTILISATEUR INEXISTANT
            res.status(500)
                .json({
                    message: error.toString()
                });
        });
};