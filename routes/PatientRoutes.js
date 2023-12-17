const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const patientController = require('../controllers/Patient/PatientController');
const { searchDoctor } = require('../controllers/patient/SearchDoctor');
const { getDoctorByUsername } = require('../controllers/patient/SearchDoctor');
const {addFamilyMember, viewFamilyMembers, removeFamilyMember, addFamilyMemberNoAccount, removeFamilyMemberNoAccount} = require('../controllers/Patient/FamilyMembersController');
const { uploadDocument, addDocument, removeDocument } = require('../controllers/Patient/MedicalHistory');
const { viewUpcomingAppointments , viewPastAppointments } = require('../controllers/Patient/viewAppointments');
const {  bookAppointment , payWithWallet } = require('../controllers/Patient/BookAppointment');
const {viewPatients} = require('../controllers/Patient/PatientController');
const { changePassword } = require('../controllers/Patient/PatientController');
const  { CancelAppointment } = require('../controllers/Patient/CancelAppointment');
const{getAvailableAppointments} =require('../controllers/Patient/viewAvailableAppointments');
const{getPatientMessages} =require('../controllers/Patient/getPatientMessages');
const {RequestFollowUp} = require('../controllers/Patient/RequestFollowUp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Prescription = require('../models/Prescription'); 

const { RescheduleAppointment } = require('../controllers/Patient/RescheduleAppointment');

const {
    getPrescriptions,
    filterPrescriptions,
    addPrescription,
    deletePrescriptionsByUsername,
    getPrescriptions1,  
    createAndDownloadPDF,
    fillPrescription
} = require('../controllers/Patient/PrescriptionList');
const app = require('../app.js');
const {filterAppointmentsPatient} = require('../controllers/Patient/filterAppointmentsPatient');

const {payAppointment} = require('../controllers/Payment/payAppointment');
const {payHealthPackage} = require('../controllers/Payment/payHealthPackage');
const {getAppointmentAmount} = require('../controllers/Patient/getAppointmentAmount');
const {filterDoctorFreeSlots} = require('../controllers/Patient/filterDoctorFreeSlots');
const {viewHealthRecords} = require('../controllers/Patient/viewHealthRecords');
const Patient = require('../models/Patient.js');
const {updateAppointmentStatus} = require('../controllers/Patient/updateAppointmentStatus');
const {getAllFamilyAppointments} = require('../controllers/Patient/getAllFamilyAppointments');
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
router.get('/getMe', patientController.getMe);
router.patch('/updateMe', patientController.updateMe);
router.post('/register', patientController.createPatient);
router.post('/changePassword', changePassword);
router.get('/:patientUsername/upcoming-appointments', viewUpcomingAppointments);
router.get('/:patientUsername/past-appointments', viewPastAppointments);
router.get('/getAppointmentAmount', getAppointmentAmount);
router.get('/available-appointments/:doctorUsername', getAvailableAppointments);
router.patch('/fillPrescription', fillPrescription);

router.get('/getPatientMessages' , getPatientMessages );
router.get('/getFreeSlotsOfDoctor', filterDoctorFreeSlots);
router.get('/SearchDoctor', searchDoctor);
router.get('/getDoctorByUsername', getDoctorByUsername);
router.patch('/bookAppointment', bookAppointment);

router.patch('/RequestFollowUp', RequestFollowUp);

router.patch('/updateAppointmentStatus', updateAppointmentStatus);
router.patch('/RescheduleAppointment', RescheduleAppointment);

router.post('/payAppointment', payAppointment);
router.post('/payHealthPackage', payHealthPackage);

router.post('/subscribeHealthPackage', patientController.healthPackageSubscription);
router.post('/unsubscribeHealthPackage', patientController.healthPackageUnsubscription);


// app.use(verifyToken);


router.post('/:username/MedicalHistoryUpload', uploadDocument, addDocument);
router.delete('/:username/MedicalHistory/:documentId', removeDocument);

router.patch('/CancelAppointment', CancelAppointment);
router.patch('/payWithWallet', payWithWallet);
router.patch('/payWithWalletPackage', patientController.payWithWalletPackage);
router.patch('/familyMembers', addFamilyMember);
router.delete('/familyMembers', removeFamilyMember);
router.delete('/familyMembersNoAccount', removeFamilyMemberNoAccount);
router.get('/familyMembers', viewFamilyMembers);
router.get('/getAvailablePackages', patientController.getAvailablePackages);
router.get('/getPackage', patientController.getPackage);
router.post('/familyMembersNoAccount', addFamilyMemberNoAccount);
router.get('/viewappointments', filterAppointmentsPatient);
router.get('/SearchDoctor', searchDoctor);
router.get('/doctorSearch', (req, res) => {
    res.render('SearchDoctor');
});
router.get('/getAllFamilyAppointments', getAllFamilyAppointments);

router.get('/prescriptions/filter', filterPrescriptions);
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions1', getPrescriptions1);

router.get('/prescriptionList', (req, res) => {
    res.render('prescriptionsList');
});
router.post('/addPrescription', addPrescription);
router.delete('/deletePrescription', deletePrescriptionsByUsername);

// Backend route to handle PDF generation
// Modify the function to generate PDF content and send it in the response
router.post('/download-prescription-pdf', async (req, res) => {
    try {
      const prescription = req.body.prescription;
      const pdfBuffer = await createAndDownloadPDF(prescription);
  
      // Send the PDF buffer as a response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Prescription_${prescription._id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  });

  

router.get('/:username/health-records', viewHealthRecords);

module.exports = router;