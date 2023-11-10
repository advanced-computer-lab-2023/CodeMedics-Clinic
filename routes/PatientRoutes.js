const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const patientController = require('../controllers/Patient/PatientController');
const { searchDoctor } = require('../controllers/patient/SearchDoctor');
const {addFamilyMember, viewFamilyMembers} = require('../controllers/Patient/FamilyMembersController');
const { uploadDocument, addDocument, removeDocument } = require('../controllers/Patient/MedicalHistory');
const { viewUpcomingAppointments , viewPastAppointments } = require('../controllers/Patient/viewAppointments');
const {viewPatients} = require('../controllers/Patient/PatientController');
const {
    getPrescriptions,
    getPrescriptionsByDate,
    getPrescriptionsByDoctor,
    getPrescriptionsByStatus,
    filterPrescriptions
} = require('../controllers/Patient/PrescriptionList');
const app = require('../app.js');
const {filterAppointmentsPatient} = require('../controllers/Patient/filterAppointmentsPatient');

const {payAppointment} = require('../controllers/Payment/payAppointment');
const {payHealthPackage} = require('../controllers/Payment/payHealthPackage');

const {filterDoctorFreeSlots} = require('../controllers/Patient/filterDoctorFreeSlots');

function verifyToken(req, res, next) {
    const token = req.headers['token'];
    try {   
        const model = jwt.verify(token, process.env.SECRET_KEY);
        res.locals.token = model;
        next();
    } catch (e) {
        res.status(401).json({message: e.message});
    }
}

router.get('/register', patientController.viewPatientRegister);
router.get('/getPatients', viewPatients);
router.post('/register', patientController.createPatient);
router.get('/:patientUsername/upcoming-appointments', viewUpcomingAppointments);
router.get('/:patientUsername/past-appointments', viewPastAppointments);
router.get('/getFreeSlotsOfDoctor', filterDoctorFreeSlots);


router.post('/payAppointment', payAppointment);
router.post('/payHealthPackage', payHealthPackage);

router.post('/subscribeHealthPackage', patientController.healthPackageSubscription);
router.post('/unsubscribeHealthPackage', patientController.healthPackageUnsubscription);

// app.use(verifyToken);

router.post('/familyMembers', addFamilyMember);

router.post('/:username/MedicalHistoryUpload', uploadDocument, addDocument);
router.delete('/:username/MedicalHistory/:documentId', removeDocument);


router.get('/familyMembers', viewFamilyMembers);
router.get('/prescriptions/filter', filterPrescriptions);
router.get('/prescriptions', getPrescriptions);
router.get('/viewappointments', filterAppointmentsPatient);
router.get('/SearchDoctor', searchDoctor);
router.get('/doctorSearch', (req, res) => {
    res.render('SearchDoctor');
});
router.get('/prescriptionList', (req, res) => {
    res.render('prescriptionsList');
});
module.exports = router;