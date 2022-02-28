const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
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
                    new Error(error);
                });
        })
        .catch((error) => {
            new Error(error);
        });
};

exports.login = (req, res, next) => {
    console.log('PASSWORD DE LA REQUETE LOGIN ' + req.body.password);
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) { // IF USER DOES NOT EXIST IN DATABASE
                throw Error(error);
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) { //IF ENCRYPTED REQUEST PASSWORD IS DIFFERENT FROM USER PASSWORD
                        throw Error(error);
                    }
                    res.status(200) //RETURNS THE USER ID FROM DATABASE AND A TOKEN CONTAINING TH USER ID
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
                    new Error(error);
                });
        })
        .catch((error) => { //UTILISATEUR INEXISTANT
            new Error(error);
        });
};