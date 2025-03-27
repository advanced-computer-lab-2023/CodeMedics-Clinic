const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

// ==========================
// Controllers
// ==========================

// Doctor
const { updateDoctor } = require("../controllers/Doctor/UpdateDoctor");
const { createDoctor } = require("../controllers/Doctor/registerDoctor");
const { getDoctorsAndAppointments, getDoctor } = require("../controllers/Doctor/GetDoctors");

// Patient
const { viewPatients } = require("../controllers/Doctor/viewPatients");
const { viewPatientAppointment } = require("../controllers/Doctor/viewPatientAppointment");

// Appointments
const { getAllDocAppointments } = require("../controllers/Doctor/viewAppointments");
const { addAppointment } = require("../controllers/Doctor/addAppointment");
const { CancelAppointment } = require("../controllers/Doctor/CancelAppointment");
const { CompleteAppointment, DeleteAppointment, UpdateAppointment } = require("../controllers/Doctor/UpdateAppointment");

// Prescriptions
const { getPrescriptions } = require("../controllers/Doctor/viewAllPrescriptions");
const { addPrescription } = require("../controllers/Doctor/addPrescription");
const { addMedicineToPrescription, removeMedicineFromPrescription, updatePrescription } = require("../controllers/Doctor/updatePrescriptionMed");
const { downloadPrescription } = require("../controllers/Patient/PrescriptionList");

// Health Records
const { docViewHealthRecords } = require("../controllers/Doctor/docViewHealthRecords");
const { uploadDocument } = require("../controllers/Doctor/addHealthRecord");
const { viewHealthRecords } = require("../controllers/Patient/viewHealthRecords");
const { addDocument } = require("../controllers/Patient/MedicalHistory");

// Chat & Messages
const { getDoctorMessages } = require("../controllers/Doctor/getDoctorMessages");
const { getDoctorChats } = require("../controllers/Chat/DoctorChats");
const { getMessages, sendMessage } = require("../controllers/Chat/Messages");

// ==========================
// Routes
// ==========================

// Doctor Routes
router.get("/", getDoctorsAndAppointments);
router.get("/:doctorUsername", getDoctor);
router.post(
  "/",
  upload.fields([
    { name: "nationalIdFile", maxCount: 1 },
    { name: "medicalDegreeFile", maxCount: 1 },
    { name: "medicalLicenseFile", maxCount: 1 },
  ]),
  createDoctor
);
router.patch("/:doctorUsername", updateDoctor);

// Patient Routes
router.get("/:doctorUsername/patients", viewPatients);
router.get("/:doctorUsername/patients/:patientUsername/appointments", viewPatientAppointment);

// Appointment Routes
router.get("/:doctorUsername/appointments", getAllDocAppointments);
router.post("/:doctorUsername/appointments", addAppointment);
router.patch("/appointments/:appointmentId", UpdateAppointment);
router.patch("/appointments/:appointmentId/complete", CompleteAppointment);
router.patch("/appointments/:appointmentId/cancel", CancelAppointment);
router.delete("/appointments/:appointmentId", DeleteAppointment);

// Prescription Routes
router.get("/:doctorUsername/prescriptions", getPrescriptions);
router.post("/:doctorUsername/prescriptions", addPrescription);
router.post("/:doctorUsername/prescriptions/:prescriptionId", addMedicineToPrescription);
router.post("/:doctorUsername/download-prescription-pdf", downloadPrescription);
router.patch("/:doctorUsername/prescriptions/:prescriptionId", updatePrescription);
router.delete("/:doctorUsername/prescriptions/:prescriptionId/drugs/:drugName", removeMedicineFromPrescription);

// Health Records Routes
router.get("/:doctorUsername/health-records", docViewHealthRecords);
router.get("/patients/:patientUsername/health-records", viewHealthRecords);
router.post("/patients/:patientUsername/health-records", uploadDocument, addDocument);

// Chat & Message Routes
router.get("/:doctorUsername/chats", getDoctorChats);
router.get("/:doctorUsername/messages", getDoctorMessages);
router.get("/chats/:chatId/messages", getMessages);
router.post("/chats/:chatId/messages", sendMessage);

module.exports = router;
