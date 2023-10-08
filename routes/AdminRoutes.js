const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');

router.post('/createAdmin', (req, res) => {
    AdminController.createAdmin(req, res).then();
});
router.delete('/removeAdmin', (req, res) => {
    AdminController.removeAdmin(req, res).then();
});
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