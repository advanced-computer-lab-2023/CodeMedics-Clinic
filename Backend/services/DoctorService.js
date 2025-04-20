const doctorRepo = require("../repositories/DoctorRepository");
const patientRepo = require("../repositories/PatientRepository");
const adminRepo = require("../repositories/AdminRepository");
const appointmentRepo = require("../repositories/AppointmentRepository");
const prescriptionRepo = require("../repositories/PrescriptionRepository");
const packageRepo = require("../repositories/PackageRepository");
const generalRepo = require("../repositories/GeneralRepository");

exports.getDoctor = async (doctorUsername) => {
  const doctor = await doctorRepo.validateDoctor(doctorUsername);
  return doctor;
};

exports.getDoctors = async () => {
  const doctors = await doctorRepo.getDoctors();
  return doctors;
};

exports.createDoctor = async (doctorData, files) => {
  const requiredVariables = [
    "firstName",
    "lastName",
    "username",
    "password",
    "email",
    "dateOfBirth",
    "affiliation",
    "hourlyRate",
    "degree",
    "speciality",
  ];
  for (const variable of requiredVariables) {
    if (!doctorData[variable]) {
      const error = new Error(`Missing required field: ${variable}`);
      error.statusCode = 400;
      throw error;
    }
  }
  const existingUsername =
    (await patientRepo.getPatient(doctorData.username)) ||
    (await doctorRepo.getDoctor(doctorData.username)) ||
    (await adminRepo.getAdmin(doctorData.username));

  if (existingUsername) {
    const error = new Error("Username already exists");
    error.statusCode = 400;
    throw error;
  }

  const existingEmail =
    (await doctorRepo.getDoctorByEmail(doctorData.email)) ||
    (await patientRepo.getPatientByEmail(doctorData.email)) ||
    (await adminRepo.getAdminByEmail(doctorData.email));

  if (existingEmail) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  if (!files || Object.keys(files).length !== 3) {
    const error = new Error(
      "Please upload ID Document, Medical Degree, and Medical License"
    );
    error.statusCode = 400;
    throw error;
  }
  const idDocumentFile = files["nationalIdFile"][0].filename;
  const medicalDegreeFile = files["medicalDegreeFile"][0].filename;
  const medicalLicenseFile = files["medicalLicenseFile"][0].filename;

  const doctor = await doctorRepo.createDoctor(
    doctorData,
    idDocumentFile,
    medicalDegreeFile,
    medicalLicenseFile
  );

  return doctor;
};

exports.updateDoctor = async (doctorUsername, doctorData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const doctor = await doctorRepo.updateDoctor(doctorUsername, doctorData);
  return doctor;
};

exports.updateDoctorPassword = async (doctorUsername, password) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const doctor = await doctorRepo.updateDoctorPassword(
    doctorUsername,
    password
  );
  return doctor;
};

exports.getPatients = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const patientsUsernames = await doctorRepo.getPatients(doctorUsername);
  const patients = [];
  for (const patientUsername of patientsUsernames) {
    const patient = await patientRepo.validatePatient(patientUsername);
    const yes = await appointmentRepo.checkExistingAppointmentWithQuery({
      patientUsername,
      doctorUsername,
      status: "upcoming",
    });
    patients.push({ patient, upcoming: yes });
  }
  return patients;
};

exports.getAppointments = async (doctorUsername, status) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const query = { doctorUsername };
  if (status) {
    const statusArray = Array.isArray(status) ? status : status.split(",");
    query.status = { $in: statusArray };
  }
  const appointments = await appointmentRepo.getAppointments(query);
  return appointments;
};

exports.addAppointment = async (doctorUsername, bodyData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.addEmptyAppointment(
    doctorUsername,
    bodyData
  );
  return appointment;
};

exports.updateAppointment = async (doctorUsername, appointmentId, bodyData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.updateAppointment(
    appointmentId,
    bodyData
  );
  return appointment;
};

exports.completeAppointment = async (doctorUsername, appointmentId) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.completeAppointment(appointmentId);
  return appointment;
};

exports.cancelAppointment = async (doctorUsername, appointmentId) => {
  const doctor = await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (
    appointment.status === "completed" ||
    appointment.status === "unreserved"
  ) {
    const error = new Error("Cannot cancel this appointment");
    error.statusCode = 400;
    throw error;
  }
  const patient = await patientRepo.validatePatient(
    appointment.patientUsername
  );
  const package = await packageRepo.validatePackage(patient.healthPackage.name);
  const updatedAppointment = await appointmentRepo.cancelAppointment(
    appointmentId
  );
  await appointmentRepo.handleAppointmentCancellation(
    appointmentId,
    patient,
    doctor,
    package
  );
  return updatedAppointment;
};

exports.deleteAppointment = async (doctorUsername, appointmentId) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  await appointmentRepo.deleteAppointment(appointmentId);
  return appointment;
};

exports.getPrescriptions = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const prescriptions = await prescriptionRepo.getPrescriptions({
    doctorUsername,
  });
  return prescriptions;
};

exports.addPrescription = async (doctorUsername, bodyData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const { drugs, patientUsername, date } = bodyData;
  await patientRepo.validatePatient(patientUsername);
  if (!drugs || !date) {
    const error = new Error("Incomplete data for prescription");
    error.statusCode = 400;
    throw error;
  }
  if (drugs.length == 0) {
    const error = new Error("Add at least one medicine for the prescription");
    error.statusCode = 400;
    throw error;
  }
  for (const drug of drugs) {
    if (Number(drug.dosage) <= 0) {
      const error = new Error("Dosage should be positive");
      error.statusCode = 400;
      throw error;
    }
    const medicine = await generalRepo.validateMedicine(drug.drugName);
    if (medicine.availableQuantity < Number(drug.dosgae)) {
      const error = new Error(`Out-of-stock medicine ${drug.drugName}`);
      error.statusCode = 400;
      throw error;
    }
  }
  const newPrescription = await prescriptionRepo.addPrescription({
    doctorUsername,
    patientUsername,
    drug: drugs,
    date,
    filled: false,
  });
  return newPrescription;
};

exports.updatePrescription = async (
  doctorUsername,
  prescriptionId,
  bodyData
) => {
  await doctorRepo.validateDoctor(doctorUsername);
  await prescriptionRepo.validatePrescription(prescriptionId);
  const updatedPrescription = await prescriptionRepo.updatePrescription(
    prescriptionId,
    bodyData
  );
  return updatedPrescription;
};

exports.downloadPrescription = async (doctorUsername, prescriptionId) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const prescription = await prescriptionRepo.validatePrescription(
    prescriptionId
  );
  const pdfBuffer = await prescriptionRepo.createAndDownloadPDF(prescription);
  return pdfBuffer;
};

exports.addMedicineToPrescription = async (
  doctorUsername,
  prescriptionId,
  bodyData
) => {
  await doctorRepo.validateDoctor(doctorUsername);
  await prescriptionRepo.validatePrescription(prescriptionId);
  const { medicineName, dosage } = bodyData;
  console.log("adding medicine", bodyData, medicineName, dosage);
  if (!medicineName || !dosage) {
    const error = new Error("Incomplete data for prescription");
    error.statusCode = 400;
    throw error;
  }
  if (Number(dosage) <= 0) {
    const error = new Error("Dosage should be positive");
    error.statusCode = 400;
    throw error;
  }
  const medicine = await generalRepo.validateMedicine(medicineName);
  if (medicine.availableQuantity < Number(dosage)) {
    const error = new Error(`Out-of-stock medicine ${medicineName}`);
    error.statusCode = 400;
    throw error;
  }
  const updatedPrescription = await prescriptionRepo.addMedicineToPrescription(
    prescriptionId,
    medicineName,
    dosage
  );
  return updatedPrescription;
};

exports.removeMedicineFromPrescription = async (
  doctorUsername,
  prescriptionId,
  drugName
) => {
  await doctorRepo.validateDoctor(doctorUsername);
  await prescriptionRepo.validatePrescription(prescriptionId);
  await generalRepo.validateMedicine(drugName);
  const updatedPrescription =
    await prescriptionRepo.removeMedicineFromPrescription(
      prescriptionId,
      drugName
    );
  return updatedPrescription;
};

exports.getHealthRecords = async (doctorUsername, patientUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const healthRecords = await patientRepo.getHealthRecords(patientUsername);
  return healthRecords;
};

exports.addHealthRecord = async (
  doctorUsername,
  patientUsername,
  fileData,
  bodyData
) => {
  await doctorRepo.validateDoctor(doctorUsername);
  await patientRepo.validatePatient(patientUsername);
  const healthRecord = await patientRepo.addHealthRecord(
    patientUsername,
    fileData,
    bodyData
  );
  return healthRecord;
};

exports.getChatMessages = async (doctorUsername, chatId) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const messages = await generalRepo.getChatMessages(chatId);
  return messages;
};

exports.getChats = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const finishedAppointments = await appointmentRepo.getAppointments({
    doctorUsername,
    status: { $in: ["completed", "follow-up Requested"] },
  });
  const patients = [];
  for (const appointment of finishedAppointments) {
    const patient = await patientRepo.validatePatient(
      appointment.patientUsername
    );
    if (!patients.some((p) => p.username === patient.username)) {
      patients.push(patient);
    }
  }
  const chats = [];
  const pharmacyChat = await generalRepo.getPharmacyChat(doctorUsername);
  chats.push(pharmacyChat);
  for (const patient of patients) {
    const chat = await generalRepo.getChat(patient.username, doctorUsername);
    if (!chat) {
      const newChat = await generalRepo.createChat(
        patient.username,
        doctorUsername
      );
      chats.push({ patient, chat: newChat, latestMessage: null });
    } else {
      const latestMessage = await generalRepo.getLatestMessage(chat._id);
      chats.push({ patient, chat, latestMessage });
    }
  }
  chats.sort((a, b) => {
    if (a.chat.updatedAt > b.chat.updatedAt) return -1;
    if (a.chat.updatedAt < b.chat.updatedAt) return 1;
    return 0;
  });
  return chats;
};

exports.sendMessage = async (doctorUsername, chatId, content) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const message = await generalRepo.sendMessage(
    chatId,
    doctorUsername,
    content
  );
  return message;
};

exports.getNotifications = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const notifications = await doctorRepo.getNotifications(doctorUsername);
  return notifications;
};
