const express = require('express');
const router = express.Router();
const Login = require('../controllers/Login.js');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    Login.login(req, res).then();
});

router.post('/logout', (req, res) => {
    Login.logout(req, res).then();    
});

module.exports = router;