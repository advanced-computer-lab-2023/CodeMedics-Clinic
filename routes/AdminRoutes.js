const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');

router.post('/createAdmin', (req, res) => {
    AdminController.createAdmin(req, res);
});
router.delete('/removeAdmin', (req, res) => {
    AdminController.removeAdmin(req, res);
});
router.post('/addPackage', (req, res) => {
    AdminController.addPackage(req, res);
});
router.delete('/removePackage', (req, res) => {
    AdminController.removePackage(req, res);
});
router.patch('/updatePackage', (req, res) => {
    AdminController.updatePackage(req, res);
});
module.exports = router;