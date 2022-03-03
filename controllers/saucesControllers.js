const Sauce = require('../models/Sauce');
const jsonWebToken = require('jsonwebtoken');
const fs = require('fs');

//Controller adding a sauce
exports.addSauce = (req, res, next) => {
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
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauceToUpdate) => {
            const sauceOwner = sauceToUpdate.userId; //Retriving the user ID of the owner of the sauce to delete
            const userId = req.auth.userId; //Retrieving the user ID of the request authenticated sender
            if (userId !== sauceOwner) { //Checking if the sender is the owner of the sauce that he wants to delete
                throw 'Unauthorized';
            }
            const sauceObject = req.file ? { //Formats the new sauce object regarding of the presence of a new file or not
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
                ...req.body
            };
            if (req.file) { //If there is a new image file, delete the old image from folder
                const oldFileName = sauceToUpdate.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFileName}`, () => {});
            }
            Sauce.updateOne({
                    _id: req.params.id
                }, {
                    ...sauceObject,
                    _id: req.params.id
                })
                .then(() => {
                    res.status(201)
                        .json({
                            message: 'Sauce modifiée !'
                        });
                })
                .catch((error) => { //updateOne() failed
                    res.status(400).json({
                        error
                    });
                });
        })
        .catch((error) => { //findOne() failed
            res.status(400).json({
                error
            });
        });
};



//Controller deleting a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauceToDelete) => {
            const sauceOwner = sauceToDelete.userId; //Retriving the user ID of the owner of the sauce to delete
            const userId = req.auth.userId; //Retrieving the user ID of the request authenticated sender
            if (userId !== sauceOwner) { //Checking if the sender is the owner of the sauce that he wants to delete
                throw 'Unauthorized';
            }
            const sauceImage = sauceToDelete.imageUrl.split('/images/')[1]; //Retrieving the file name of the sauce to delete
            fs.unlink(`images/${sauceImage}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'Sauce supprimée !'
                        });
                    })
                    .catch((error) => { //deleteOne() failed
                        res.status(400).json({
                            error
                        });
                    });
            });
        })
        .catch((error) => { //findOne() failed
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