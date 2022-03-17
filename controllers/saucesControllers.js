const Sauce = require('../models/Sauce');
const fs = require('fs');

//Controller adding a new sauce
exports.addSauce = (req, res, next) => {
    //Parsing sauce string to object
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //Creates a new sauce
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //Registers the new sauce in database
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
exports.likeSauce = (req, res, next) => {
    //Searches for the sauce to like in database
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauceObject) => {
            //Retrieving the userId from request
            const userId = req.body.userId;
            //Gets the action (like 1 / dislike -1 / cancel 0) sent by the user
            const userAction = req.body.like;
            //Gets the index of the user if he already likes this sauce, or -1 if not
            const userAlreadyLikes = sauceObject.usersLiked.indexOf(userId);
            //Gets the index of the user if he already dislikes this sauce, or -1 if not
            const userAlreadyDislikes = sauceObject.usersDisliked.indexOf(userId);
            let actionMessage;
            let actionContent;
            switch (userAction) {
                // The user likes the sauce => Add user to usersLiked[] and increase likes by 1
                case 1:
                    if (userAlreadyLikes === -1) {
                        actionContent = {
                            $push: {
                                usersLiked: userId
                            },
                            $inc: {
                                likes: 1
                            }
                        };
                        actionMessage = "L'utilisateur a ajouté un [Like] sur la sauce";
                    }
                    break;
                    //The user dislikes the sauce => Remove user from usersDisliked[] and decrease dislikes by 1
                case -1:
                    if (userAlreadyDislikes === -1) {
                        actionContent = {
                            $push: {
                                usersDisliked: userId
                            },
                            $inc: {
                                dislikes: 1
                            }
                        };
                        actionMessage = "L'utilisateur a ajouté un [Dislike] sur la sauce";
                    }
                    break;
                    //The user wants to revoke a "like" or a "dislike"
                default:
                    if (userAlreadyLikes !== -1) {
                        actionContent = {
                            $pull: {
                                usersLiked: userId
                            },
                            $inc: {
                                likes: -1
                            }
                        };
                        actionMessage = "L'utilisateur a supprimé son [Like] de la sauce";
                    } else if (userAlreadyDislikes !== -1) {
                        actionContent = {
                            $pull: {
                                usersDisliked: userId
                            },
                            $inc: {
                                dislikes: -1
                            }
                        };
                        actionMessage = "L'utilisateur a supprimé son [Dislike] de la sauce";
                    }
                    break;
            }
            //Update the sauce object regarding the "actionContent" to perform (defined in the switch statement above)
            Sauce.updateOne({
                    _id: req.params.id
                }, actionContent)
                .then(() => {
                    res.status(200)
                        .json({
                            message: actionMessage
                        });
                })
                //updateOne failed
                .catch((error) => {
                    res.status(400)
                        .json({
                            error
                        });
                });
        })
        //findOne() failed
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
};



//Controller modifying an existing sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauceToUpdate) => {
            //Checking if the sender is the owner of the sauce that he wants to modify
            if (req.auth.userId !== sauceToUpdate.userId) {
                res.status(403)
                    .json({
                        error: new Error('Modification non autorisée !')
                    });
            }
            //Formats the new sauce object regarding of the presence of a new file or not
            const sauceObject = req.file ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
                ...req.body
            };
            //If there is a new image file, delete the old image from folder
            if (req.file) {
                const oldFileName = sauceToUpdate.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFileName}`, () => {});
            }
            //Updating the sauce
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
                //updateOne() failed
                .catch((error) => {
                    res.status(400).json({
                        error
                    });
                });
        })
        //findOne() failed
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
};



//Controller deleting an existing sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauceToDelete) => {
            //If the sauce to delete has not been found
            if (!sauceToDelete) {
                res.status(404).json({
                    error: new Error('Sauce non trouvée !')
                });
            }
            //Checks if the sender is the owner of the sauce that he wants to delete
            if (req.auth.userId !== sauceToDelete.userId) {
                res.status(403)
                    .json({
                        error: new Error('Suppression non autorisée')
                    });
            }
            //Retrieving the image file name of the sauce to delete
            const fileName = sauceToDelete.imageUrl.split('/images/')[1];
            //Deletes the image of the sauce 
            fs.unlink(`images/${fileName}`, () => {
                //Deletes the sauce
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'Sauce supprimée !'
                        });
                    })
                    //deleteOne() failed
                    .catch((error) => {
                        res.status(400).json({
                            error
                        });
                    });
            });
        })
        //findOne() failed
        .catch((error) => {
            res.status(500).json({
                error
            });
        });
}



//Controller returning all existing sauces
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



//Controller returning only one sauce
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