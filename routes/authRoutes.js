const express = require('express');
const router = express.Router();
const validators = require('./../validators/validators');

const authController = require('../controllers/authControllers');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;