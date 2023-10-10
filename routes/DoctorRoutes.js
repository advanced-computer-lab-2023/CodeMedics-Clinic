const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { updateDoctor } = require('../controllers/Doctor/UpdateDoctor');
const { filterAppointments } = require('../controllers/Doctor/filterAppointments');
const { searchPatient } = require('../controllers/Doctor/searchForPatient');
const { viewPatients } = require('../controllers/Doctor/viewPatients');
const { filterPatients } = require('../controllers/Doctor/filterPatients');

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
router.get('/viewappointments', filterAppointments);
router.get('searchPatient', searchPatient);
router.get('/viewpatients', viewPatients);
router.get('/', getDoctors);
router.get('/filterpatients', filterPatients);

module.exports = router;


