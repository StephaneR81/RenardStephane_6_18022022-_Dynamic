const express = require('express');
const router = express.Router();

const authMdw = require('../middleware/auth');
const multerMdw = require('../middleware/multer-config');
const sauceMdw = require('../middleware/checkSauce');

const saucesController = require('../controllers/saucesControllers');



//Add a new sauce
router.post('/', authMdw, multerMdw, sauceMdw, saucesController.addSauce);

//Like a sauce
router.post('/:id/like', authMdw, saucesController.likeSauce);

//Modify a sauce
router.put('/:id', authMdw, multerMdw, sauceMdw, saucesController.modifySauce);

//Delete a sauce
router.delete('/:id', authMdw, saucesController.deleteSauce);

//Get all sauces
router.get('/', authMdw, saucesController.getAllSauces);

//Get one sauce
router.get('/:id', authMdw, saucesController.getOneSauce);

module.exports = router;