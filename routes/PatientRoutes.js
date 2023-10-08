const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { addFamilyMember , viewFamilyMembers } = require('../controllers/Patient/FamilyMembersController');
const {getPrescriptions, getPrescriptionsByDate, getPrescriptionsByDoctor, getPrescriptionsByStatus} = require('../controllers/Patient/PrescriptionList');
const app = require('../app.js');
function verifyToken(req, res, next) {
    const token = req.headers['token'];
    try{
        const model = jwt.verify(token, process.env.SECRET_KEY);
        res.locals.token = model;
        next();
    }
    catch(e){
        res.status(401).json({message: e.message});
    }
}

//app.use(verifyToken);
router.post('/family-members', addFamilyMember);
router.get('/family-members', viewFamilyMembers);
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions/date', getPrescriptionsByDate);
router.get('/prescriptions/doctor', getPrescriptionsByDoctor);
router.get('/prescriptions/status', getPrescriptionsByStatus);

module.exports = router;