const express = require('express');
const router = express.Router();
const emailMdw = require('../middleware/checkEmail');
const passwordMdw = require('../middleware/checkPassword');
const loginMdw = require('../middleware/checkLogin');
const authController = require('../controllers/authControllers');

router.post('/signup', emailMdw, passwordMdw, authController.signup);
router.post('/login', loginMdw, authController.login);

module.exports = router;