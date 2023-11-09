const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");
const {getUsername} = require('../config/infoGetter.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const login = async (req, res) => {
    const { Username, password } = req.body;
    try {
        const user1 = await adminModel.findOne({ Username });
        const user2 = await doctorModel.findOne({ Username });
        const user3 = await patientModel.findOne({ Username });
        
        const user = user1 || user2 || user3;


        if (user) {
            const auth = await bcrypt.compare(password, user.Password);
            if (auth) {
                const token = createToken(user.Username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(200).json(user)
            } else {
                res.status(400).json({ error: "Wrong password" })
            }
        } else {
            res.status(400).json({ error: "User not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: "User logged out" });
}

module.exports = { logout, login };
