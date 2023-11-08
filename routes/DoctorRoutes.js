const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const upload = require('../config/multerConfig'); 
const jwt = require('jsonwebtoken');
const { updateDoctor } = require('../controllers/Doctor/UpdateDoctor');
const { filterAppointments , getAllApointments } = require('../controllers/Doctor/filterAppointments');
const { searchPatient } = require('../controllers/Doctor/searchForPatient');
const { viewPatients } = require('../controllers/Doctor/viewPatients');
const { filterPatients } = require('../controllers/Doctor/filterPatients');
const fs = require('fs');
const {createDoctor, viewDoctorRegister} = require('../controllers/Doctor/registerDoctor');
const {getDoctors, getDoctorsAndSpecialties} = require('../controllers/Doctor/GetDoctors');
const {getAllDoctors} = require('../controllers/Doctor/registerDoctor');
const app = require('../app.js');

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
    { name: 'IDDocument', maxCount: 1 },
    { name: 'MedicalDegree', maxCount: 1 },
    { name: 'MedicalLicense', maxCount: 1 }
]), createDoctor);
//app.use(verifyToken);
router.get('/register', viewDoctorRegister);
router.get('/getAllDoctors', getAllDoctors);


router.patch('/', updateDoctor);
router.get('/viewAppointments', filterAppointments);
router.get('/getAllAppointments', getAllApointments);
router.get('/searchPatient', searchPatient);
router.get('/viewPatients', viewPatients);
router.get('/getDoctors', getDoctors);
router.get('/filterPatients', filterPatients);
router.get('/getDoctorsAndSpecialties', getDoctorsAndSpecialties);
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
    process.env.Username = username;
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

module.exports = router;


