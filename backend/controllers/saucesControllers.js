const Sauce = require('../models/Sauce');


//Controller for adding a sauce
exports.addSauce = (req, res) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.imageUrl = '/images';
    sauce.save()
        .then((sauce) => {
            res.status(201)
                .json({
                    sauce
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
exports.likeSauce = (req, res) => {};


//Controller for modifying a sauce
exports.modifySauce = (req, res) => {};
//Controller for deleting a sauce
exports.deleteSauce = (req, res) => {};


//Controller for returning all sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200)
                .json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
};
//Controller for returning one sauce
exports.getOneSauce = (req, res) => {};