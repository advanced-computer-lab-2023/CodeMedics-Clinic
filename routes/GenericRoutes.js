const express = require('express');
const router = express.Router();
const Login = require('../controllers/Login');

router.post('/login', (req, res) => {
    Login.Login(req, res).then();
});
module.exports = router;