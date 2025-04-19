const express = require("express");
const router = express.Router();
const errorHandler = require("../../middleware/errorHandler");
const doctorService = require("../services/DoctorService");
const upload = require("../../config/multerConfig");
const uploadDocument = upload.single("document");

router.get("/", async (req, res) => {
  try {
    const doctors = await doctorService.getDoctors();
    res.status(200).json({ data: doctors });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const doctor = await doctorService.getDoctor(req.params.username);
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username", async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctor(
      req.params.username,
      req.body
    );
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username/password", async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctorPassword(
      req.params.username,
      req.body.password
    );
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/patients", async (req, res) => {
  try {
    const patients = await doctorService.getPatients(req.params.username);
    res.status(200).json({ data: patients });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get(
  "/:username/patients/:patientUsername/appointments",
  async (req, res) => {
    try {
      const appointments = await doctorService.getPatientAppointments(
        req.params.username,
        req.params.patientUsername
      );
      res.status(200).json({ data: appointments });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.get("/:username/appointments", async (req, res) => {
  try {
    const appointments = await doctorService.getAppointments(
      req.params.username,
      req.query.status
    );
    res.status(200).json({ data: appointments });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/appointments", async (req, res) => {
  try {
    const appointment = await doctorService.addAppointment(
      req.params.username,
      req.body
    );
    res.status(201).json({ data: appointment });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username/appointments/:appointmentId", async (req, res) => {
  try {
    const appointment = await doctorService.updateAppointment(
      req.params.username,
      req.params.appointmentId,
      req.body
    );
    res.status(200).json({ data: appointment });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch(
  "/:username/appointments/:appointmentId/cancel",
  async (req, res) => {
    try {
      const appointment = await doctorService.cancelAppointment(
        req.params.username,
        req.params.appointmentId
      );
      res.status(200).json({ data: appointment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.patch(
  "/:username/appointments/:appointmentId/complete",
  async (req, res) => {
    try {
      const appointment = await doctorService.completeAppointment(
        req.params.username,
        req.params.appointmentId
      );
      res.status(200).json({ data: appointment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.delete("/:username/appointments/:appointmentId", async (req, res) => {
  try {
    const appointment = await doctorService.deleteAppointment(
      req.params.username,
      req.params.appointmentId
    );
    res.status(200).json({ data: appointment });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/prescriptions", async (req, res) => {
  try {
    const prescriptions = await doctorService.getPrescriptions(
      req.params.username
    );
    res.status(200).json({ data: prescriptions });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/prescriptions", async (req, res) => {
  try {
    const prescription = await doctorService.addPrescription(
      req.params.username,
      req.body
    );
    res.status(201).json({ data: prescription });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post(
  "/:username/prescriptions/:prescriptionId/medicines",
  async (req, res) => {
    try {
      const prescription = await doctorService.addMedicineToPrescription(
        req.params.username,
        req.params.prescriptionId,
        req.body
      );
      res.status(200).json({ data: prescription });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.delete(
  "/:username/prescriptions/:prescriptionId/medicines/:medicineId",
  async (req, res) => {
    try {
      const prescription = await doctorService.removeMedicineFromPrescription(
        req.params.username,
        req.params.prescriptionId,
        req.params.medicineId
      );
      res.status(200).json({ data: prescription });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.patch("/:username/prescriptions/:prescriptionId", async (req, res) => {
  try {
    const prescription = await doctorService.updatePrescription(
      req.params.username,
      req.params.prescriptionId,
      req.body
    );
    res.status(200).json({ data: prescription });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get(
  "/:username/prescriptions/:prescriptionId/download",
  async (req, res) => {
    try {
      const prescription = await doctorService.downloadPrescription(
        req.params.username,
        req.params.prescriptionId
      );
      res.status(200).json({ data: prescription });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.get(
  "/:username/patients/:patientUsername/health-records",
  async (req, res) => {
    try {
      const healthRecords = await doctorService.getHealthRecords(
        req.params.username,
        req.params.patientUsername
      );
      res.status(200).json({ data: healthRecords });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.post(
  "/:username/patients/:patientUsername/health-records",
  uploadDocument,
  async (req, res) => {
    try {
      const healthRecord = await doctorService.addHealthRecord(
        req.params.username,
        req.params.patientUsername,
        req.file,
        req.body
      );
      res.status(201).json({ data: healthRecord });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.get("/:username/chats", async (req, res) => {
  try {
    const chats = await doctorService.getChats(req.params.username);
    res.status(200).json({ data: chats });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/chats/:chatId/messages", async (req, res) => {
  try {
    const messages = await doctorService.getMessages(
      req.params.username,
      req.params.chatId
    );
    res.status(200).json({ data: messages });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/chats/:chatId/messages", async (req, res) => {
  try {
    const message = await doctorService.sendMessage(
      req.params.username,
      req.params.chatId,
      req.body
    );
    res.status(201).json({ data: message });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/notifications", async (req, res) => {
  try {
    const messages = await doctorService.getNotifications(
      req.params.username
    );
    res.status(200).json({ data: messages });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

module.exports = router;
