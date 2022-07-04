var express = require('express');
var router = express.Router();

require('./../models/User.js');
const AuthService = require('./../services/authService');
const AuthController = require('./../controllers/authController');

router.get('/myprofile', AuthService.verifyToken(), AuthController.getProfile());
router.post('/login', AuthController.login());
router.post('/register', AuthController.register());
module.exports = router;
