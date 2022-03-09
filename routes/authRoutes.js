const express = require('express');
const router = express.Router();
const email = require('../middleware/email');
const password = require('../middleware/password');

const authController = require('../controllers/authControllers');

router.post('/signup', email, password, authController.signup);
router.post('/login', authController.login);

module.exports = router;