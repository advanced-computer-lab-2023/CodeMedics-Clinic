const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const adminGetter = require('../controllers/Admin/AdminGetters');
const {getPackages} = require("../controllers/Admin/AdminController");

//const JWTAuth = require('../config/JWTAuth.js');

//const isAuth = JWTAuth.isAuth;

// Middleware to check authentication for the routes below
//router.use(isAuth);
//admin
router.get('/', adminGetter.viewAdminPanel);
router.get('/getPackages', getPackages);
router.get('/packageManager', adminGetter.viewPackageManager);
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
module.exports = router;