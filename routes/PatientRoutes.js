const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { addFamilyMember , viewFamilyMembers } = require('../controllers/Patient/FamilyMembersController');
<<<<<<< HEAD
const { filterAppointmentsPatient } = require('../controllers/Patient/filterAppointmentsPatient');
=======
const {getPrescriptions, getPrescriptionsByDate, getPrescriptionsByDoctor, getPrescriptionsByStatus} = require('../controllers/Patient/PrescriptionList');
const app = require('../app.js');
>>>>>>> 3972e1645c071457576c19c8976741b91440071b
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
<<<<<<< HEAD
router.get('/viewappointments', filterAppointmentsPatient);
=======
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions/date', getPrescriptionsByDate);
router.get('/prescriptions/doctor', getPrescriptionsByDoctor);
router.get('/prescriptions/status', getPrescriptionsByStatus);

module.exports = router;
>>>>>>> 3972e1645c071457576c19c8976741b91440071b
