const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ==========================
// Controllers
// ==========================

// Patient
const patientController = require("../controllers/Patient/PatientController");

// Doctor
const { getDoctor } = require("../controllers/Patient/getDoctor.js");
const { getDoctorsAndAppointments } = require("../controllers/Doctor/GetDoctors.js");

// Family Members
const {
  addFamilyMember,
  viewFamilyMembers,
  removeFamilyMember,
  addFamilyMemberNoAccount,
  removeFamilyMemberNoAccount,
} = require("../controllers/Patient/FamilyMembersController");

// Medical History
const { uploadDocument, addDocument, removeDocument } = require("../controllers/Patient/MedicalHistory");

// Chat
const { getMessages, sendMessage } = require("../controllers/Chat/Messages");
const { getPatientChats } = require("../controllers/Chat/PatientChats.js");

// Appointments
const { getPatientAppointments } = require("../controllers/Patient/Appointment/getPatientAppointments.js");
const { bookAppointment } = require("../controllers/Patient/Appointment/bookAppointment.js");
const { CancelAppointment } = require("../controllers/Patient/CancelAppointment");
const { updateAppointment } = require("../controllers/Patient/updateAppointment");
const { getPatientDoctorAppointments } = require("../controllers/Patient/getPatientDoctorAppointments.js");

// Messages
const { getPatientMessages } = require("../controllers/Patient/getPatientMessages");

// Prescriptions
const {
  getPrescriptions,
  addPrescription,
  fillPrescription,
  downloadPrescription,
} = require("../controllers/Patient/PrescriptionList");

// Payment
const { payAppointment } = require("../controllers/Payment/payAppointment");
const { payHealthPackage } = require("../controllers/Payment/payHealthPackage");

// Health Records
const { viewHealthRecords } = require("../controllers/Patient/viewHealthRecords");

// ==========================
// Middleware
// ==========================
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.locals.token = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// ==========================
// Routes
// ==========================

// Patient Routes
router.get("/", patientController.getPatients);
router.get("/packages", patientController.getAvailablePackages);
router.get("/:patientUsername", patientController.getPatient);
router.post("/", patientController.createPatient);
router.patch("/:patientUsername", patientController.updatePatient);

// Appointment Routes
router.get("/:patientUsername/appointments", getPatientAppointments);
router.patch("/:patientUsername/appointments/:appointmentId", bookAppointment);
router.patch("/appointments/:appointmentId", updateAppointment);
router.patch("/appointments/:appointmentId/cancel", CancelAppointment);

// Payment Routes
router.post("/:patientUsername/payment/appointments/:appointmentId", payAppointment);
router.post("/:patientUsername/payment/health-packages/:packageName", payHealthPackage);
router.post("/:patientUsername/health-packages/subscription", patientController.healthPackageSubscription);
router.delete("/:patientUsername/health-packages/subscription", patientController.healthPackageUnsubscription);

// Doctor Routes
router.get("/:patientUsername/doctors", getDoctorsAndAppointments);
router.get("/doctors/:doctorUsername", getDoctor);
router.get("/doctors/:doctorUsername/appointments", getPatientDoctorAppointments);

// Family Members Routes
router.get("/:patientUsername/family-members", viewFamilyMembers);
router.post("/:patientUsername/family-members", addFamilyMember);
router.post("/:patientUsername/family-members-no-account", addFamilyMemberNoAccount);
router.delete("/:patientUsername/family-members/:familyMemberUsername", removeFamilyMember);
router.delete("/:patientUsername/family-members-no-account/:familyMemberId", removeFamilyMemberNoAccount);

// Prescription Routes
router.get("/:patientUsername/prescriptions", getPrescriptions);
router.post("/:patientUsername/prescriptions", addPrescription);
router.post("/download-prescription-pdf", downloadPrescription);
router.patch("/:patientUsername/prescriptions/:prescriptionId", fillPrescription);

// Medical History Routes
router.post("/:patientUsername/medical-history", uploadDocument, addDocument);
router.delete("/:patientUsername/medical-history/:documentId", removeDocument);

// Health Records Routes
router.get("/:patientUsername/health-records", viewHealthRecords);

// Chat Routes
router.get("/:patientUsername/messages", getPatientMessages);
router.get("/chats/:chatId/messages", getMessages);
router.get("/:patientUsername/chats", getPatientChats);
router.post("/chats/:chatId/messages", sendMessage);

module.exports = router;
