const Sauce = require('../models/Sauce');
const jsonWebToken = require('jsonwebtoken');
const fs = require('fs');

//Controller adding a sauce
exports.addSauce = (req, res, next) => {
    console.table(req.body);
    console.table(req.file);

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then((sauce) => {
            res.status(201)
                .json({
                    message: 'Sauce enregistrée !'
                });
        })
        .catch((error) => {
            res.status(400)
                .json({
                    error
                });
        });
};



//Controller for liking a sauce
exports.likeSauce = (req, res, next) => {};



//Controller modifying a sauce
exports.modifySauce = (req, res, next) => {};



//Controller deleting a sauce
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({
            _id: req.params.id
        })
        .then((saudeToDelete) => {
            const sauceOwner = saudeToDelete.userId;
            const userId = req.auth.userId;

            console.log('SauceOwner ', sauceOwner);
            console.log('req.auth ', userId);


            if (userId !== sauceOwner) {
                throw 'Unauthorized';
            }
            const sauceImage = saudeToDelete.imageUrl.split('/images/')[1];
            fs.unlink(`images/${sauceImage}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'Sauce supprimée !'
                        });
                    })
                    .catch((error) => {
                        res.status(400).json({
                            error
                        });
                    });
            });
        })
        .catch((error) => { //Sauce not found
            res.status(500).json({
                error
            });
        });

}



//Controller returning all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200)
                .json(
                    sauces
                );
        })
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
};



//Controller returning one sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            console.log('RETURN findOneSauce', sauce);
            res.status(200).json(
                sauce
            );
        })
        .catch((error) => {
            res.status(404).json({
                error
            });
        });
};