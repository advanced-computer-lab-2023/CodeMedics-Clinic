const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');


//admin
router.post('/createAdmin', (req, res) => {
    AdminController.createAdmin(req, res).then();
});
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