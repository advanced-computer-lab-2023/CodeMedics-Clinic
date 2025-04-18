const patientRepo = require("../repositories/PatientRepository");
const appointmentRepo = require("../repositories/AppointmentRepository");
const doctorRepo = require("../repositories/DoctorRepository");
const adminRepo = require("../repositories/AdminRepository");
const prescriptionRepo = require("../repositories/PrescriptionRepository");
const packageRepo = require("../repositories/PackageRepository");

exports.getPatients = async () => {
  const patients = await patientRepo.getPatients();
  return patients;
};

exports.getPatient = async (patientUsername) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  return patient;
};

exports.createPatient = async (patientData) => {
  const requiredVariables = [
    "firstName",
    "lastName",
    "username",
    "password",
    "email",
    "dateOfBirth",
    "gender",
    "number",
    "emergencyContactName",
    "emergencyContactNumber",
  ];

  for (const variable of requiredVariables) {
    if (!patientData[variable]) {
      const error = new Error(`fill missing values`);
      error.statusCode = 400;
      throw error;
    }
  }
  const existingPatient =
    (await patientRepo.getPatient(patientData.username)) ||
    (await doctorRepo.getDoctor(patientData.username)) ||
    (await adminRepo.getAdmin(patientData.username));

  if (existingPatient) {
    const error = new Error("Username already exists");
    error.statusCode = 400;
    throw error;
  }

  const patient = await patientRepo.createPatient(patientData);
  return patient;
};

exports.updatePatient = async (patientUsername, patientData) => {
  await patientRepo.validatePatient(patientUsername);
  const patient = await patientRepo.updatePatient(patientUsername, patientData);
  return patient;
};

exports.updatePatientPassword = async (patientUsername, password) => {
  await patientRepo.validatePatient(patientUsername);
  const updatedPatient = await patientRepo.updatePatientPassword(
    patientUsername,
    password
  );
  return updatedPatient;
};

exports.getPatientAppointments = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const appointments = await appointmentRepo.getAppointments({
    patientUsername,
  });
  return appointments;
};

exports.bookAppointment = async (patientUsername, appointmentId) => {
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (appointment.status !== "unreserved") {
    const error = new Error("Appointment is not available for booking");
    error.statusCode = 400;
    throw error;
  }
  const bookedAppointment = await appointmentRepo.bookAppointment(
    patientUsername,
    appointmentId
  );
  return bookedAppointment;
};

exports.updateAppointment = async (appointmentId, appointmentData) => {
  await appointmentRepo.validateAppointment(appointmentId);
  const updatedAppointment = await appointmentRepo.updateAppointment(
    appointmentId,
    appointmentData
  );
  return updatedAppointment;
};

exports.cancelAppointment = async (appointmentId) => {
  await appointmentRepo.validateAppointment(appointmentId);
  const cancelledAppointment = await appointmentRepo.cancelAppointment(
    appointmentId
  );
  return cancelledAppointment;
};

exports.payHealthPackage = async (patientUsername, packageName) => {
  await patientRepo.validatePatient(patientUsername);
  await packageRepo.validatePackage(packageName);
  const payment = await packageRepo.payHealthPackage(
    patientUsername,
    packageName
  );
  return payment;
};

exports.subscribeHealthPackage = async (patientUsername, packageName) => {
  await patientRepo.validatePatient(patientUsername);
  const package = await packageRepo.validatePackage(packageName);
  const subscription = await patientRepo.subscribeHealthPackage(
    patientUsername,
    package
  );
  return subscription;
};

exports.unsubscribeHealthPackage = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const unsubscription = await patientRepo.unsubscribeHealthPackage(
    patientUsername
  );
  return unsubscription;
};

exports.getDoctorsWithAppointments = async (patientUsername) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  const appointments = await appointmentRepo.getAppointments({
    status: "unreserved",
  });
  const uniqueDoctorsUsernames = [
    ...new Set(appointments.map((a) => a.doctorUsername)),
  ];
  const doctorsWithAppointments = [];
  for (const doctorUsername of uniqueDoctorsUsernames) {
    const doctor = await doctorRepo.getDoctor(doctorUsername);
    const doctorAppointments = appointments.filter(
      (a) => a.doctorUsername === doctorUsername
    );
    const package = await packageRepo.getPackage(patient.healthPackage.name);
    let price = doctor.hourlyRate + 0.1 * doctor.hourlyRate;
    if (package) {
      price -= price * (package.sessionDiscount / 100);
    }
    doctorsWithAppointments.push({
      doctor,
      price,
      appointments: doctorAppointments,
    });
  }
  return doctorsWithAppointments;
};

exports.getDoctor = async (doctorUsername) => {
  const doctor = await doctorRepo.getDoctor(doctorUsername);
  return doctor;
};

exports.getDoctorAppointments = async (
  patientUsername,
  doctorUsername,
  status
) => {
  await patientRepo.validatePatient(patientUsername);
  await doctorRepo.validateDoctor(doctorUsername);
  const query = { doctorUsername };
  if (status) {
    const statusArray = Array.isArray(status) ? status : status.split(",");
    query.status = { $in: statusArray };
  }
  const appointments = await appointmentRepo.getAppointments(query);
  return appointments;
};

exports.payAppointment = async (patientUsername, appointmentId) => {
  await patientRepo.validatePatient(patientUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (appointment.status !== "unreserved") {
    const error = new Error("Appointment is not available for payment");
    error.statusCode = 400;
    throw error;
  }
  const payment = await appointmentRepo.payAppointment(
    patientUsername,
    appointmentId
  );
  return payment;
};

exports.getFamilyMembers = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const familyMembers = await patientRepo.getFamilyMembers(patientUsername);
  return familyMembers;
};

exports.getFamilyMembersWithNoAccount = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const familyMembers = await patientRepo.getFamilyMembersWithNoAccount(
    patientUsername
  );
  return familyMembers;
};

exports.addFamilyMember = async (patientUsername, familyMemberUsername) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  const familyMember = await patientRepo.validatePatient(familyMemberUsername);
  if (familyMember.username === patientUsername) {
    const error = new Error("Cannot add yourself as a family member");
    error.statusCode = 400;
    throw error;
  }
  if (familyMember.linked) {
    const error = new Error("Family member already linked to another account");
    error.statusCode = 400;
    throw error;
  }
  if (
    patient.familyMembers.some(
      (el) => el.id.toString() === familyMember._id.toString()
    )
  ) {
    const error = new Error("Family member already linked to your account");
    error.statusCode = 400;
    throw error;
  }

  const result = await patientRepo.addFamilyMember(
    patientUsername,
    familyMemberUsername
  );

  return result;
};

exports.addFamilyMemberWithNoAccount = async (
  patientUsername,
  familyMemberData
) => {
  await patientRepo.validatePatient(patientUsername);
  const familyMember = await patientRepo.addFamilyMemberWithNoAccount(
    patientUsername,
    familyMemberData
  );
  return familyMember;
};

exports.removeFamilyMember = async (patientUsername, familyMemberUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const familyMember = await patientRepo.removeFamilyMember(
    patientUsername,
    familyMemberUsername
  );
  return familyMember;
};

exports.removeFamilyMemberWithNoAccount = async (
  patientUsername,
  familyMemberId
) => {
  await patientRepo.validatePatient(patientUsername);
  const familyMember = await patientRepo.removeFamilyMemberWithNoAccount(
    patientUsername,
    familyMemberId
  );
  return familyMember;
};

exports.getPrescriptions = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const prescriptions = await prescriptionRepo.getPrescriptions(
    patientUsername
  );
  return prescriptions;
};

exports.addPrescription = async (patientUsername, prescriptionData) => {
  await patientRepo.validatePatient(patientUsername);
  const prescription = await prescriptionRepo.addPrescription(
    patientUsername,
    prescriptionData
  );
  return prescription;
};

exports.downloadPrescriptionPdf = async (patientUsername, prescriptionData) => {
  await patientRepo.validatePatient(patientUsername);
  const prescription = await prescriptionRepo.downloadPrescription(
    prescriptionData
  );
  return prescription;
};

exports.updatePrescription = async (
  patientUsername,
  prescriptionId,
  prescriptionData
) => {
  await patientRepo.validatePatient(patientUsername);
  const prescription = await prescriptionRepo.updatePrescription(
    patientUsername,
    prescriptionId,
    prescriptionData
  );
  return prescription;
};

exports.fillPrescription = async (patientUsername, prescriptionId) => {
  await patientRepo.validatePatient(patientUsername);
  const prescription = await prescriptionRepo.fillPrescription(
    patientUsername,
    prescriptionId
  );
  return prescription;
};

exports.uploadDocument = async (patientUsername, documentData) => {
  await patientRepo.validatePatient(patientUsername);
  const document = await patientRepo.uploadDocument(
    patientUsername,
    documentData
  );
  return document;
};

exports.removeDocument = async (patientUsername, documentId) => {
  await patientRepo.validatePatient(patientUsername);
  const document = await patientRepo.removeDocument(
    patientUsername,
    documentId
  );
  return document;
};

exports.getHealthRecords = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const healthRecords = await patientRepo.getHealthRecords(patientUsername);
  return healthRecords;
};

exports.addHealthRecord = async (patientUsername, healthRecord) => {
  await patientRepo.validatePatient(patientUsername);
  const record = await patientRepo.addHealthRecord(
    patientUsername,
    healthRecord
  );
  return record;
};

exports.removeHealthRecord = async (patientUsername, healthRecordId) => {
  await patientRepo.validatePatient(patientUsername);
  const record = await patientRepo.removeHealthRecord(
    patientUsername,
    healthRecordId
  );
  return record;
};

exports.getNotifications = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const messages = await patientRepo.getNotifications(patientUsername);
  return messages;
};

exports.getChatMessages = async (patientUsername, chatId) => {
  await patientRepo.validatePatient(patientUsername);
  const messages = await patientRepo.getChatMessages(chatId);
  return messages;
};

exports.getPatientChats = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const finishedAppointments = await appointmentRepo.getAppointments({
    patientUsername,
    status: { $in: ["completed", "follow-up Requested"] },
  });
  const doctors = [];
  for (const appointment of finishedAppointments) {
    const doctor = await doctorRepo.getDoctor(appointment.doctorUsername);
    if (!doctors.some((doc) => doc.username === doctor.username)) {
      doctors.push(doctor);
    }
  }
  const chats = [];
  const pharmacyChat = await patientRepo.getPharmacyChat(patientUsername);
  chats.push(pharmacyChat);
  for (const doctor of doctors) {
    const chat = await patientRepo.getChat(patientUsername, doctor.username);
    if (!chat) {
      const newChat = await patientRepo.createChat(
        patientUsername,
        doctor.username
      );
      chats.push({ doctor, chat: newChat, latestMessage: null });
    } else {
      const latestMessage = await patientRepo.getLatestMessage(chat._id);
      chats.push({ doctor, chat, latestMessage });
    }
  }
  return chats;
};

exports.sendMessage = async (patientUsername, chatId, messageData) => {
  await patientRepo.validatePatient(patientUsername);
  const message = await patientRepo.sendMessage(
    chatId,
    patientUsername,
    messageData
  );
  return message;
};

exports.getAvailablePackages = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const packages = await packageRepo.getAvailablePackages();
  return packages;
};
