const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User/UserController');

router.post('/login', (req, res) => {
    UserController.login(req, res).then();
});

router.post('/signup', (req, res) => {
    UserController.signUp(req, res).then();
});

module.exports = router;