const express = require("express");
const router = express.Router();
const errorHandler = require("../../middleware/errorHandler");
const patientService = require("../services/PatientService");

router.get("/", async (req, res) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).json({ data: patients });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const patient = await patientService.getPatient(req.params.username);
    res.status(200).json({ data: patient });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json({ data: patient });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username", async (req, res) => {
  try {
    const patient = await patientService.updatePatient(
      req.params.username,
      req.body
    );
    res.status(200).json({ data: patient });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username/password", async (req, res) => {
  try {
    const patient = await patientService.updatePatientPassword(
      req.params.username,
      req.body.password
    );
    res.status(200).json({ data: patient });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/appointments", async (req, res) => {
  try {
    const appointments = await patientService.getPatientAppointments(
      req.params.username,
      req.query.status
    );
    res.status(200).json({ data: appointments });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch(
  "/:username/appointments/:appointmentId/cancel",
  async (req, res) => {
    try {
      const appointment = await patientService.cancelAppointment(
        req.params.username,
        req.params.appointmentId
      );
      res.status(200).json({ data: appointment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.patch("/:username/appointments/:appointmentId", async (req, res) => {
  try {
    const appointment = await patientService.updateAppointment(
      req.params.username,
      req.params.appointmentId,
      req.body
    );
    res.status(200).json({ data: appointment });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/health-packages/subscription", async (req, res) => {
  try {
    const subscription = await patientService.subscribeHealthPackage(
      req.params.username,
      req.body.packageName
    );
    res.status(201).json({ data: subscription });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/:username/health-packages/subscription", async (req, res) => {
  try {
    const subscription = await patientService.unsubscribeHealthPackage(
      req.params.username
    );
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/family-members", async (req, res) => {
  try {
    const familyMembers = await patientService.getFamilyMembers(
      req.params.username
    );
    res.status(200).json({ data: familyMembers });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/family-members-no-account", async (req, res) => {
  try {
    const familyMembers = await patientService.getFamilyMembersWithNoAccount(
      req.params.username
    );
    res.status(200).json({ data: familyMembers });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/family-members", async (req, res) => {
  try {
    const familyMember = await patientService.addFamilyMember(
      req.params.username,
      req.body.familyMemberUsername
    );
    res.status(201).json({ data: familyMember });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/family-members-no-account", async (req, res) => {
  try {
    const familyMember = await patientService.addFamilyMemberWithNoAccount(
      req.params.username,
      req.body
    );
    res.status(201).json({ data: familyMember });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete(
  "/:username/family-members/:familyMemberUsername",
  async (req, res) => {
    try {
      const familyMember = await patientService.removeFamilyMember(
        req.params.username,
        req.params.familyMemberUsername
      );
      res.status(204).send();
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.delete(
  "/:username/family-members-no-account/:familyMemberId",
  async (req, res) => {
    try {
      const familyMember = await patientService.removeFamilyMemberWithNoAccount(
        req.params.username,
        req.params.familyMemberId
      );
      res.status(204).send();
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.get("/:username/health-records", async (req, res) => {
  try {
    const healthRecords = await patientService.getHealthRecords(
      req.params.username
    );
    res.status(200).json({ data: healthRecords });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/health-records", async (req, res) => {
  try {
    const healthRecord = await patientService.addHealthRecord(
      req.params.username,
      req.body
    );
    res.status(201).json({ data: healthRecord });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/doctors", async (req, res) => {
  try {
    const doctors = await patientService.getDoctorsWithAppointments(
      req.params.username
    );
    res.status(200).json({ data: doctors });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/doctors/:doctorUsername", async (req, res) => {
  try {
    const doctor = await patientService.getDoctor(req.params.doctorUsername);
    res.status(200).json({ data: doctor });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get(
  "/:username/doctors/:doctorUsername/appointments",
  async (req, res) => {
    try {
      const appointments = await patientService.getDoctorAppointments(
        req.params.username,
        req.params.doctorUsername,
        req.query.status
      );
      res.status(200).json({ data: appointments });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.post(
  "/:username/payment/appointments/:appointmentId",
  async (req, res) => {
    try {
      const payment = await patientService.payAppointment(
        req.params.username,
        req.params.appointmentId,
        req.body.paymentMethod
      );
      res.status(200).json({ data: payment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.post(
  "/:username/payment/health-packages/:packageName",
  async (req, res) => {
    try {
      const payment = await patientService.payHealthPackage(
        req.params.username,
        req.params.packageName,
        req.body.paymentMethod
      );
      res.status(200).json({ data: payment });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
);

router.get("/:username/prescriptions", async (req, res) => {
  try {
    const prescriptions = await patientService.getPrescriptions(
      req.params.username
    );
    res.status(200).json({ data: prescriptions });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/prescriptions", async (req, res) => {
  try {
    const prescription = await patientService.addPrescription(
      req.params.username,
      req.body
    );
    res.status(201).json({ data: prescription });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/download-prescription-pdf", async (req, res) => {
  try {
    const pdf = await patientService.downloadPrescriptionPdf(req.body);
    res.status(200).json({ data: pdf });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.patch("/:username/prescriptions/:prescriptionId", async (req, res) => {
  try {
    const prescription = await patientService.updatePrescription(
      req.params.username,
      req.params.prescriptionId,
      req.body
    );
    res.status(200).json({ data: prescription });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/notifications", async (req, res) => {
  try {
    const notifications = await patientService.getNotifications(
      req.params.username
    );
    res.status(200).json({ data: notifications });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/:username/chats", async (req, res) => {
  try {
    const chats = await patientService.getPatientChats(req.params.username);
    res.status(200).json({ data: chats });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.get("/chats/:chatId/messages", async (req, res) => {
  try {
    const messages = await patientService.getChatMessages(req.params.chatId);
    res.status(200).json({ data: messages });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/chats/:chatId/messages", async (req, res) => {
  try {
    const message = await patientService.sendMessage(
      req.params.chatId,
      req.body.sender,
      req.body.content
    );
    res.status(201).json({ data: message });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/:username/medical-history", async (req, res) => {
  try {
    const document = await patientService.addDocument(
      req.params.username,
      req.body.document
    );
    res.status(201).json({ data: document });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/:username/medical-history/:documentId", async (req, res) => {
  try {
    const document = await patientService.removeDocument(
      req.params.username,
      req.params.documentId
    );
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
});

module.exports = router;
