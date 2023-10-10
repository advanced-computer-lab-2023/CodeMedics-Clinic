const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const JWTAuth = require('../config/JWTAuth.js');

const isAuth = JWTAuth.isAuth;

// Middleware to check authentication for the routes below
router.use(isAuth);
//admin
router.post('/createAdmin', isAuth, AdminController.createAdmin);
router.delete('/removeAdmin', (req, res) => {
    AdminController.removeAdmin(req, res).then();
});
router.patch('/updateAdmin', (req, res) => {
    AdminController.updateAdmin(req, res).then();
});

router.get('/getAllAdmins', (req, res) => {
    AdminController.getAllAdmins(req, res).then();
});


//doctor
router.get('/getAllDoctorsReg', (req, res) => {
    AdminController.getAllDoctorsReg(req, res).then();
});


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