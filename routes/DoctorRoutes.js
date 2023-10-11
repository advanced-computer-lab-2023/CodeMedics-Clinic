const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const { updateDoctor } = require('../controllers/Doctor/UpdateDoctor');
const { filterAppointments } = require('../controllers/Doctor/filterAppointments');
const { searchPatient } = require('../controllers/Doctor/searchForPatient');
const { viewPatients } = require('../controllers/Doctor/viewPatients');
const { filterPatients } = require('../controllers/Doctor/filterPatients');
const fs = require('fs');
const {getDoctors} = require('../controllers/Doctor/GetDoctors');
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

//app.use(verifyToken);

router.put('/', updateDoctor);
router.get('/viewAppointments', filterAppointments);
router.get('/searchPatient', searchPatient);
router.get('/viewPatients', viewPatients);
router.get('/getDoctors', getDoctors);
router.get('/filterPatients', filterPatients);
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
    console.log('in the doctor route');
    const dr = new Doctor({
        FirstName: 'John',
        LastName: 'Smith',
        Username: 'thomasa',
        Password: 'password',
        Email: 'asf',
        DateOfBirth: '12/12/12',
        HourlyRate: 12,
        affiliation: 'aff',
        Degree: 'degree',
        Status: 'Pending',
        Specialty: 'specialty'

    });
    res.locals.token = dr;
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


