const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { searchDoctor } = require('../controllers/patient/SearchDoctor');
const { addFamilyMember , viewFamilyMembers } = require('../controllers/Patient/FamilyMembersController');
const {filterPrescriptions} = require('../controllers/Patient/PrescriptionList');
const { filterAppointmentsPatient } = require('../controllers/Patient/filterAppointmentsPatient');
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


// app.use(verifyToken);

router.post('/familyMembers', addFamilyMember);
router.get('/familyMembers', viewFamilyMembers);
//router.get('/prescriptions', getPrescriptions);
//router.get('/prescriptions/date', getPrescriptionsByDate);
//router.get('/prescriptions/doctor', getPrescriptionsByDoctor);
//router.get('/prescriptions/status', getPrescriptionsByStatus);
router.get('/prescriptions/filter', filterPrescriptions);
router.get('/viewappointments', filterAppointmentsPatient);
router.get('/SearchDoctor', searchDoctor);
// router.get('/doctorSearch', (req, res) => {
//     res.render('SearchDoctor');
// });
module.exports = router;