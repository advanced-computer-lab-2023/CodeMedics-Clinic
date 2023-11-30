const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const upload = require('../config/multerConfig'); 
const jwt = require('jsonwebtoken');
const { updateDoctor } = require('../controllers/Doctor/UpdateDoctor');
const { filterAppointments , getAllApointments } = require('../controllers/Doctor/filterAppointments');
const { viewUpcomingAppointments , viewPastAppointments, getAllDocAppointments } = require('../controllers/Doctor/viewAppointments');
const { searchPatient } = require('../controllers/Doctor/searchForPatient');
const { viewPatients, getPatientByUsername } = require('../controllers/Doctor/viewPatients');
const{addTimeSlot}=require('../controllers/Doctor/AvailableTImeSlots.js');
const { filterPatients } = require('../controllers/Doctor/filterPatients');
const fs = require('fs');
const {createDoctor, viewDoctorRegister} = require('../controllers/Doctor/registerDoctor');
const {getDoctors, getDoctorsAndAppointments} = require('../controllers/Doctor/GetDoctors');
const {getAllDoctors} = require('../controllers/Doctor/registerDoctor');
const { scheduleFollowUp } = require('../controllers/Doctor/ScheduleFollowup')
const app = require('../app.js');
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


router.post('/register', upload.fields([
    { name: 'nationalIdFile', maxCount: 1 },
    { name: 'medicalDegreeFile', maxCount: 1 },
    { name: 'medicalLicenseFile', maxCount: 1 }
]), createDoctor);
//app.use(verifyToken);
router.get('/register', viewDoctorRegister);
router.get('/getAllDoctors', requireAuth, getAllDoctors);

router.post('/addAppointments', addAppointments);


router.post('/add-time-slot/:username', addTimeSlot);


router.post('/:doctorUsername/schedule-followup', scheduleFollowUp);
router.post('/changePassword', changePassword);
router.get('/:doctorUsername/upcoming-appointments', viewUpcomingAppointments);
router.get('/:doctorUsername/past-appointments', viewPastAppointments);


router.patch('/', updateDoctor);
router.patch('/CancelAppointment', CancelAppointment);
router.get('/viewAppointments', filterAppointments);
router.get('/getAllAppointments', getAllApointments);
router.get('/searchPatient', searchPatient);
router.get('/viewPatients', viewPatients);
router.get('/getDoctors', getDoctors);
router.get('/filterPatients', filterPatients);
router.get('/getDoctorsAndAppointments', getDoctorsAndAppointments);
router.get("/getAllDocAppointments", getAllDocAppointments);
router.get('/getPatientByUsername', getPatientByUsername);

router.get('/viewPatientDetails:Username', (req, res) => {
    const Username = req.params.Username;
    console.log(Username);
    res.setHeader('Content-Type', 'text/html');
    const path = './views/p/viewPatientDetails';
    path += '/' + Username;
    path += '.html';
    fs.readFile(path, null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });

});
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const username = req.query.Username;
    console.log("in the doctor route");
    console.log(username);
    fs.readFile('./views/Doctor/Doctor.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});
router.post('/:doctorUsername/addHealthRecord',uploadDocument, addHealthRecord);
router.get('/:doctorUsername/health-records',docViewHealthRecords);
router.post('/addPrescription', addPrescription);

router.post('/addMedicineToPrescription', addMedicineToPrescription);
router.post('/removeMedicineFromPrescription', removeMedicineFromPrescription);
router.post('/addMedicineDosage',addMedicineDosage);
router.post('/updateMedicineDosage', updateMedicineDosage);

module.exports = router;


