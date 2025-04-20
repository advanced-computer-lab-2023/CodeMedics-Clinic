const express = require("express");
const router = express.Router();
const errorHandler = require("../../middleware/errorHandler");
const adminService = require("../services/AdminService");

router.get("/", async (req, res) => {
  try {
    const admins = await adminService.getAdmins();
    res.status(200).json({ data: admins });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/packages", async (req, res) => {
  try {
    const packages = await adminService.getPackages();
    res.status(200).json({ data: packages });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/packages", async (req, res) => {
  try {
    const package = await adminService.createPackage(req.body);
    res.status(201).json({ data: package });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/packages/:packageName", async (req, res) => {
  try {
    const updatedPackage = await adminService.updatePackage(
      req.params.packageName,
      req.body
    );
    res.status(200).json({ data: updatedPackage });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/packages/:packageName", async (req, res) => {
  try {
    await adminService.deletePackage(
      req.params.packageName
    );
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await adminService.getDoctors();
    res.status(200).json({ data: doctors });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/doctors/applications", async (req, res) => {
  try {
    const applications = await adminService.getDoctorApplications();
    res.status(200).json({ data: applications });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/doctors/:doctorUsername", async (req, res) => {
  try {
    await adminService.deleteDoctor(req.params.doctorUsername);
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/doctors/:doctorUsername/accept", async (req, res) => {
  try {
    const doctor = await adminService.acceptDoctor(
      req.params.username,
      req.params.doctorUsername
    );
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/doctors/:doctorUsername/reject", async (req, res) => {
  try {
    const doctor = await adminService.rejectDoctor(
      req.params.username,
      req.params.doctorUsername
    );
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/patients", async (req, res) => {
  try {
    const patients = await adminService.getPatients();
    res.status(200).json({ data: patients });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/patients/:patientUsername", async (req, res) => {
  try {
    await adminService.deletePatient(
      req.params.patientUsername
    );
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/download-contract", async (req, res) => {
  try {
    const doctorUsername = req.body.doctor;
    const pdfBuffer = await adminService.createAndDownloadContract(
      doctorUsername
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Contract.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const admin = await adminService.getAdmin(req.params.username);
    res.status(200).json({ data: admin });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({ data: admin });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username", async (req, res) => {
  try {
    const admin = await adminService.updateAdmin(req.params.username, req.body);
    res.status(200).json({ data: admin });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username/password", async (req, res) => {
  try {
    const admin = await adminService.updatePassword(
      req.params.username,
      req.body.password
    );
    res.status(200).json({ data: admin });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/:username", async (req, res) => {
  try {
    await adminService.deleteAdmin(req.params.username);
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

module.exports = router;
