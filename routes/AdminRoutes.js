const express = require("express");
const router = express.Router();

// ==========================
// Controllers
// ==========================

// Admin
const AdminController = require("../controllers/Admin/AdminController");
const {
  getPackages,
  changePassword,
} = require("../controllers/Admin/AdminController");
const viewAdmins = require("../controllers/Admin/viewAdmins");
const addAdmin = require("../controllers/Admin/addAdmin");
const removeAdmin = require("../controllers/Admin/removeAdmin");

// Doctors
const viewDoctors = require("../controllers/Admin/viewDoctors");
const removeDoctor = require("../controllers/Admin/removeDoctor");
const {
  createAndDownloadContract,
} = require("../controllers/Admin/acceptDoctor");

// Patients
const viewPatients = require("../controllers/Admin/viewPatients");
const removePatient = require("../controllers/Admin/removePatient");
const { validateDoctor } = require("../utils/validator");

// ==========================
// Routes
// ==========================

// Admin Routes
router.get("/", viewAdmins);
router.get("/packages", getPackages);
router.post("/", addAdmin);
router.patch("/:adminUsername", changePassword);
router.delete("/:adminUsername", removeAdmin);

// Doctor Routes
router.get("/doctors", viewDoctors);
router.get("/doctors/applications", AdminController.getDoctorsReg);
router.delete("/doctors/:doctorUsername", removeDoctor);
router.patch(
  "/doctors/:doctorUsername/accept",
  AdminController.acceptDoctorRequest
);
router.patch(
  "/doctors/:doctorUsername/reject",
  AdminController.rejectDoctorRequest
);

// Patient Routes
router.get("/patients", viewPatients);
router.delete("/patients/:patientUsername", removePatient);

// Contract Generation Route
router.post("/download-contract", async (req, res) => {
  try {
    const doctorUsername = req.body.doctor;
    const doctor = await validateDoctor(doctorUsername, res);
    const pdfBuffer = await createAndDownloadContract(doctor);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Contract.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Package Management Routes
router.post("/packages", AdminController.addPackage);
router.delete("/packages/:packageName", AdminController.removePackage);
router.patch("/packages/:packageName", AdminController.updatePackage);

module.exports = router;
