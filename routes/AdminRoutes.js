const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const adminGetter = require('../controllers/Admin/AdminGetters');
const {getPackages} = require("../controllers/Admin/AdminController");
const { changePassword,generateOTP, sendOTP } = require('../controllers/Admin/AdminController');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const adminModel = require('../models/Administrator');

//const JWTAuth = require('../config/JWTAuth.js');

//const isAuth = JWTAuth.isAuth;

// Middleware to check authentication for the routes below
//router.use(isAuth);
//admin
router.get('/', adminGetter.viewAdminPanel);
router.get('/getPackages', getPackages);
router.get('/packageManager', adminGetter.viewPackageManager);
router.post('/changePassword', changePassword);

router.post('/createAdmin', (req, res) => {
    AdminController.createAdmin(req, res).then();
});
router.get('/register', (req, res) => {
    adminGetter.viewRegisterAdmin(req, res).then();
});
router.delete('/removeUser', (req, res) => {
    AdminController.removeUser(req, res).then();
});
router.get('/removeUser', adminGetter.viewRemoveUser);
router.patch('/updateAdmin', (req, res) => {
    AdminController.updateAdmin(req, res).then();
});

router.get('/getAllAdmins', (req, res) => {
    AdminController.getAllAdmins(req, res).then();
});


//doctor
router.post('/getDoctorsReg', (req, res) => {
    AdminController.getDoctorsReg(req, res).then();
});
router.get('/getDoctorsReg', adminGetter.viewDoctorRegister);


//packages

router.post('/addPackage', (req, res) => {
    AdminController.addPackage(req, res).then();
});
router.delete('/removePackage', (req, res) => {
    AdminController.removePackage(req, res).then();
});
router.patch('/updatePackage', (req, res) => {
    AdminController.updatePackage(req, res).then();
});




// Define a route for initiating the password reset process
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    // Generate a unique reset token (using crypto) and store it in the database along with the admin's email
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpiry = Date.now() + 3600000; // Token valid for 1 hour

    try {
        const admin = await adminModel.findOneAndUpdate(
            { Email: email },
            { $set: { resetToken, resetExpiry } },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Send the OTP to the admin's email
        const otp = generateOTP(); // You need to implement this function in AdminController
        sendOTP(email, otp); // You need to implement this function in AdminController

        return res.status(200).json({ message: 'Password reset initiated. Check your email for OTP.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error initiating password reset' });
    }
});

// Define a route for verifying the OTP and updating the password
router.post('/resetPassword', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const admin = await adminModel.findOne({
            Email: email,
            resetToken: otp,
            resetExpiry: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Hash the new password and update it in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        admin.Password = hashedPassword;
        admin.resetToken = undefined;
        admin.resetExpiry = undefined;
        await admin.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ error: 'Error resetting password' });
    }
});


module.exports = router;