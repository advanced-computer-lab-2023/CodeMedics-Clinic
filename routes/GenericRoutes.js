const express = require('express');
const router = express.Router();
const Login = require('../controllers/Login.js');
const {resetPassword} = require('../controllers/ResetPassword.js');
const {getMe} = require('../controllers/GetMe.js');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    Login.login(req, res).then();
});

router.post('/logout', (req, res) => {
    Login.logout(req, res).then();    
});

router.post('/resetPassword', resetPassword);
router.get('/getMe' , getMe);

module.exports = router;