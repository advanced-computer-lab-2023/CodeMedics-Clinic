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
} = require("../controllers/Patient/Appointment/getPatientAppointments.js");
const {
  bookAppointment,
} = require("../controllers/Patient/Appointment/bookAppointment.js");
const {
  CancelAppointment,
} = require("../controllers/Patient/CancelAppointment");
const {
  getAvailableAppointments,
} = require("../controllers/Patient/viewAvailableAppointments");
const {
  getPatientMessages,
} = require("../controllers/Patient/getPatientMessages");

const {
  getPrescriptions,
  addPrescription,
  deletePrescriptionsByUsername,
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
router.get("/:patientUsername/messages", getPatientMessages);
router.get("/doctors/:doctorUsername/appointments", getPatientDoctorAppointments);
router.get("/doctors/:doctorUsername", getDoctor);

router.patch("/:patientUsername", patientController.updatePatient);
router.post("/", patientController.createPatient);
router.patch("/:patientUsername/prescriptions/:prescriptionId", fillPrescription);
router.patch("/:patientUsername/appointments/:appointmentId", bookAppointment);
router.patch("/:patientUsername/appointments/:appointmentId", updateAppointment);
router.post("/:patientUsername/payment/appointments/:appointmentId", payAppointment);
router.post("/:patientUsername/payment/health-packages/:packageName", payHealthPackage);




router.post("/:patientUsername/health-packages/subscription", patientController.healthPackageSubscription);
router.delete("/:patientUsername/health-packages/subscription", patientController.healthPackageUnsubscription);
router.post("/:patientUsername/medical-history", uploadDocument, addDocument);
router.delete("/:patientUsername/medical-history/:documentId", removeDocument);
router.patch("/:patientUsername/appointments/:appointmentId/cancel", CancelAppointment);

router.post("/:patientUsername/family-members", addFamilyMember);
router.post("/:patientUsername/family-members-no-account", addFamilyMemberNoAccount);
router.delete("/:patientUsername/family-members", removeFamilyMember);
router.delete("/:patientUsername/family-members-no-account", removeFamilyMemberNoAccount);
router.get("/:patientUsername/family-members", viewFamilyMembers);
router.get("/:patientUsername/family-members/appointments", getAllFamilyAppointments);
router.post("/:patientUsername/prescriptions", addPrescription);
router.delete("/:patientUsername/prescriptions", deletePrescriptionsByUsername);
router.get("/:patientUsername/health-records", viewHealthRecords);

/*
 general, to be moved
*/

router.get("/pacakges", patientController.getAvailablePackages);
router.get("/appointments/:appointmentId/amount", getAppointmentAmount);
router.get("/appointments", getAvailableAppointments);
router.get("/packages/package-name", patientController.getPackage);
router.get("/prescriptions", getPrescriptions);


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


module.exports = router;
