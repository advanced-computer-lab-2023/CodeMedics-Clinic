const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const upload = require('../config/multerConfig'); 
const { updateDoctor } = require('../controllers/Doctor/UpdateDoctor');
const { filterAppointments , getAllApointments } = require('../controllers/Doctor/filterAppointments');
const { viewUpcomingAppointments , viewPastAppointments, getAllDocAppointments } = require('../controllers/Doctor/viewAppointments');
const { searchPatient } = require('../controllers/Doctor/searchForPatient');
const { viewPatients, getPatientByUsername } = require('../controllers/Doctor/viewPatients');
const{addTimeSlot}=require('../controllers/Doctor/AvailableTImeSlots.js');
const { filterPatients } = require('../controllers/Doctor/filterPatients');
const {createDoctor, viewDoctorRegister} = require('../controllers/Doctor/registerDoctor');
const {getDoctors, getDoctorsAndAppointments} = require('../controllers/Doctor/GetDoctors');
const {getAllDoctors} = require('../controllers/Doctor/registerDoctor');
const { scheduleFollowUp } = require('../controllers/Doctor/ScheduleFollowup')
const { requireAuth } = require('../Middleware/authMiddleware');
const { changePassword } = require('../controllers/Doctor/registerDoctor');
const {addAppointments} = require('../controllers/Doctor/addAppointment');
const {docViewHealthRecords} = require('../controllers/Doctor/docViewHealthRecords');
const {addHealthRecord, uploadDocument} = require('../controllers/Doctor/addHealthRecord');
const { CancelAppointment } = require('../controllers/Doctor/CancelAppointment');
//const { addPrescription } = require('../controllers/Patient/PrescriptionList.js');
const {addPrescription} = require('../controllers/Doctor/addPrescription');
const {addMedicineToPrescription , removeMedicineFromPrescription} = require('../controllers/Doctor/updatePrescriptionMed');
const {updateMedicineDosage,addMedicineDosage} = require('../controllers/Doctor/updateMedicneDosage')
const {getDoctorMessages} = require('../controllers/Doctor/getDoctorMessages')
const {getPrescriptions}= require('../controllers/Doctor/viewAllPrescriptions')
const{checkMedicine}=require('../controllers/Doctor/checkMedicine')
const {rescheduleAppointment} = require('../controllers/Doctor/rescheduleAppointment');
const {viewPatientAppointment} = require('../controllers/Doctor/viewPatientAppointment.js');
const {getFollowRequests} = require('../controllers/Doctor/getFollowRequests');


router.post('/checkMedicine',checkMedicine);

router.post('/register', upload.fields([
    { name: 'nationalIdFile', maxCount: 1 },
    { name: 'medicalDegreeFile', maxCount: 1 },
    { name: 'medicalLicenseFile', maxCount: 1 }
]), createDoctor);

//app.use(verifyToken);

router.get('/patients', viewPatients);
router.get('/:doctorUsername/patients/:patientUsername/appointments', viewPatientAppointment)
router.get("/:doctorUsername/appointments", getAllDocAppointments);
router.get('/', getDoctorsAndAppointments);


router.post('/:doctorUsername/appointments', addAppointments);




router.get('/getAllDoctors', requireAuth, getAllDoctors);



router.post('/add-time-slot/:username', addTimeSlot);


router.post('/:doctorUsername/schedule-followup', scheduleFollowUp);
router.post('/changePassword', changePassword);
router.get('/:doctorUsername/upcoming-appointments', viewUpcomingAppointments);
router.get('/:doctorUsername/past-appointments', viewPastAppointments);
router.get('/getDoctorMessages', getDoctorMessages);
router.get('/getAllPrescriptions',getPrescriptions);

router.patch('/', updateDoctor);
router.patch('/CancelAppointment', CancelAppointment);
router.get('/viewPatientAppointment/:patientUsername', viewPatientAppointment);
router.patch('/rescheduleAppointments/:patientUsername', rescheduleAppointment);
router.get('/viewAppointments', filterAppointments);
router.get('/getAllAppointments', getAllApointments);
router.get('/searchPatient', searchPatient);
router.get('/getDoctors', getDoctors);
router.get('/filterPatients', filterPatients);
router.get('/getPatientByUsername', getPatientByUsername);


router.post('/:doctorUsername/addHealthRecord',uploadDocument, addHealthRecord);
router.get('/:doctorUsername/health-records',docViewHealthRecords);
router.post('/addPrescription', addPrescription);

router.post('/addMedicineToPrescription', addMedicineToPrescription);
router.post('/removeMedicineFromPrescription', removeMedicineFromPrescription);
router.post('/addMedicineDosage',addMedicineDosage);
router.post('/updateMedicineDosage', updateMedicineDosage);

router.get('/getFollowRequests', getFollowRequests);


module.exports = router;


