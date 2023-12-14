const express = require('express');
const router = express.Router();
const { getPatientChats } = require('../controllers/Chat/PatientChats');
const { getDoctorChats } = require('../controllers/Chat/DoctorChats');
const { getMessages , sendMessage } = require('../controllers/Chat/Messages');

router.get('/getPatientChats', getPatientChats);
router.get('/getDoctorChats', getDoctorChats);
router.get('/getMessages', getMessages);
router.post('/sendMessage', sendMessage);

module.exports = router;