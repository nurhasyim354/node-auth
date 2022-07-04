var express = require('express');
var router = express.Router();

const authService = require('./../services/authService');
const cache = require('./../services/cacheService');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.get('/', authService.verifyToken(), cache.get(cache.type.user), userController.getAll());
router.get('/:id', [authService.verifyToken(), cache.get(cache.type.userdetail)], userController.getSingle());

//Use same function as registering new user
router.post('/', authService.verifyToken(), authController.register());

router.post('/:id', authService.verifyToken(), userController.update());
router.delete('/:id', authService.verifyToken(), userController.delete());

module.exports = router;
