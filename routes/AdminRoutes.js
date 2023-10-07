const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');

router.post('/createAdmin', (req, res) => {
    AdminController.createAdmin(req, res);
});
router.delete('/removeAdmin', (req, res) => {
    AdminController.removeAdmin(req, res);
});



module.exports = router;