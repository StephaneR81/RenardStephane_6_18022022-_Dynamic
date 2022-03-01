const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesController = require('../controllers/saucesControllers');


//Add a new sauce
router.post('/', auth, multer, saucesController.addSauce);

//Like a sauce
router.post('/:id/like', auth, saucesController.likeSauce);

//Modify a sauce
router.put('/:id', auth, multer, saucesController.modifySauce);

//Delete a sauce
router.delete('/:id', auth, saucesController.deleteSauce);

//Get all sauces
router.get('/', auth, saucesController.getAllSauces);

//Get one sauce
router.get('/:id', auth, saucesController.getOneSauce);

module.exports = router;