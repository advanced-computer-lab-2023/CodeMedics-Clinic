const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const patientController = require("../controllers/Patient/PatientController");
const { getDoctor } = require("../controllers/Patient/getDoctor.js");
const {
  addFamilyMember,
  viewFamilyMembers,
  removeFamilyMember,
  addFamilyMemberNoAccount,
  removeFamilyMemberNoAccount,
} = require("../controllers/Patient/FamilyMembersController");
const {
  uploadDocument,
  addDocument,
  removeDocument,
} = require("../controllers/Patient/MedicalHistory");
const {
  getPatientAppointments,
  viewPastAppointments,
} = require("../controllers/Patient/Appointment/getPatientAppointments.js");
const {
  bookAppointment,
  payWithWallet,
} = require("../controllers/Patient/Appointment/BookAppointment.js");
const { viewPatients } = require("../controllers/Patient/PatientController");
const { changePassword } = require("../controllers/Patient/PatientController");
const {
  CancelAppointment,
} = require("../controllers/Patient/CancelAppointment");
const {
  getAvailableAppointments,
} = require("../controllers/Patient/viewAvailableAppointments");
const {
  getPatientMessages,
} = require("../controllers/Patient/getPatientMessages");
const { RequestFollowUp } = require("../controllers/Patient/RequestFollowUp");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Prescription = require("../models/Prescription");

const {
  RescheduleAppointment,
} = require("../controllers/Patient/RescheduleAppointment");

const {
  getPrescriptions,
  filterPrescriptions,
  addPrescription,
  deletePrescriptionsByUsername,
  getPrescriptions1,
  createAndDownloadPDF,
  fillPrescription,
} = require("../controllers/Patient/PrescriptionList");
const app = require("../app.js");
const {
  filterAppointmentsPatient,
} = require("../controllers/Patient/filterAppointmentsPatient");

const { payAppointment } = require("../controllers/Payment/payAppointment");
const { payHealthPackage } = require("../controllers/Payment/payHealthPackage");
const {
  getAppointmentAmount,
} = require("../controllers/Patient/Appointment/getAppointmentAmount.js");
const {
  getPatientDoctorAppointments,
} = require("../controllers/Patient/getPatientDoctorAppointments.js");
const {
  viewHealthRecords,
} = require("../controllers/Patient/viewHealthRecords");
const Patient = require("../models/Patient.js");

const {
  updateAppointment,
} = require("../controllers/Patient/updateAppointment");
const {
  getAllFamilyAppointments,
} = require("../controllers/Patient/getAllFamilyAppointments");

function verifyToken(req, res, next) {
  const token = req.headers["token"];
  try {
    const model = jwt.verify(token, process.env.SECRET_KEY);
    res.locals.token = model;
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
}

router.get("/", patientController.getPatients);
router.get("/:patientUsername", patientController.getPatient);
router.get("/:patientUsername/appointments", getPatientAppointments);
router.get("/appointments/:appointmentId/amount", getAppointmentAmount);
router.get("/appointments", getAvailableAppointments);
router.get("/:patientUsername/messages", getPatientMessages);
router.get("/doctors/:doctorUsername/appointments", getPatientDoctorAppointments);
router.get("/doctors/:doctorUsername", getDoctor);

router.patch("/:patientUsername", patientController.updatePatient);
router.post("/", patientController.createPatient);
router.patch("/:patientUsername/prescriptions/:prescriptionId", fillPrescription);
router.patch("/:patientUsername/appointments/:appointmentId", bookAppointment);

router.patch("/:patientUsername/appointments/:appointmentId", updateAppointment);



router.patch("/RescheduleAppointment", RescheduleAppointment);

router.post("/payAppointment", payAppointment);
router.post("/payHealthPackage", payHealthPackage);

router.post(
  "/subscribeHealthPackage",
  patientController.healthPackageSubscription
);
router.post(
  "/unsubscribeHealthPackage",
  patientController.healthPackageUnsubscription
);

// app.use(verifyToken);

router.post("/:username/MedicalHistoryUpload", uploadDocument, addDocument);
router.delete("/:username/MedicalHistory/:documentId", removeDocument);

router.patch("/CancelAppointment", CancelAppointment);
router.patch("/payWithWallet", payWithWallet);
router.patch("/payWithWalletPackage", patientController.payWithWalletPackage);
router.patch("/familyMembers", addFamilyMember);
router.delete("/familyMembers", removeFamilyMember);
router.delete("/familyMembersNoAccount", removeFamilyMemberNoAccount);
router.get("/familyMembers", viewFamilyMembers);
router.get("/getAvailablePackages", patientController.getAvailablePackages);
router.get("/getPackage", patientController.getPackage);
router.post("/familyMembersNoAccount", addFamilyMemberNoAccount);
router.get("/viewappointments", filterAppointmentsPatient);

router.get("/getAllFamilyAppointments", getAllFamilyAppointments);

router.get("/prescriptions/filter", filterPrescriptions);
router.get("/prescriptions", getPrescriptions);
router.get("/prescriptions1", getPrescriptions1);

router.get("/prescriptionList", (req, res) => {
  res.render("prescriptionsList");
});
router.post("/addPrescription", addPrescription);
router.delete("/deletePrescription", deletePrescriptionsByUsername);

// Backend route to handle PDF generation
// Modify the function to generate PDF content and send it in the response
router.post("/download-prescription-pdf", async (req, res) => {
  try {
    const prescription = req.body.prescription;
    const pdfBuffer = await createAndDownloadPDF(prescription);

    // Send the PDF buffer as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Prescription_${prescription._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

router.get("/:username/health-records", viewHealthRecords);

module.exports = router;
