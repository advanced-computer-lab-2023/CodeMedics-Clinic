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

exports.getPatientAppointments = async (patientUsername, status) => {
  await patientRepo.validatePatient(patientUsername);
  const query = { patientUsername };
  if (status) {
    const statusArray = Array.isArray(status) ? status : status.split(",");
    query.status = { $in: statusArray };
  }
  const appointments = await appointmentRepo.getAppointments(query);
  return appointments;
};

exports.updateAppointment = async (
  patientUsername,
  appointmentId,
  appointmentData
) => {
  await patientRepo.validatePatient(patientUsername);
  await appointmentRepo.validateAppointment(appointmentId);
  const updatedAppointment = await appointmentRepo.updateAppointment(
    appointmentId,
    appointmentData
  );
  return updatedAppointment;
};

exports.cancelAppointment = async (patientUsername, appointmentId) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (
    appointment.status === "completed" ||
    appointment.status === "unreserved"
  ) {
    const error = new Error("Cannot cancel this appointment");
    error.statusCode = 400;
    throw error;
  }
  const doctor = await doctorRepo.validateDoctor(appointment.doctorUsername);
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

exports.payHealthPackage = async (
  patientUsername,
  packageName,
  paymentMethod
) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  const package = await packageRepo.validatePackage(packageName);
  let price = package.price;
  if (paymentMethod === "Wallet") {
    if (patient.wallet < price) {
      const error = new Error("Insufficient funds in wallet");
      error.statusCode = 402;
      throw error;
    }
  } else {
    price = 0;
  }
  const updatedPatient = await patientRepo.payHealthPackage(
    patientUsername,
    package,
    price
  );

  return updatedPatient;
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

exports.payAppointment = async (
  patientUsername,
  appointmentId,
  paymentMethod
) => {
  const patient = await patientRepo.validatePatient(patientUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (appointment.status !== "unreserved") {
    const error = new Error("Appointment is not available for payment");
    error.statusCode = 400;
    throw error;
  }
  const doctor = await doctorRepo.validateDoctor(appointment.doctorUsername);
  const package = await packageRepo.validatePackage(patient.healthPackage.name);
  if (paymentMethod === "Card") {
    await appointmentRepo.addAppointment(appointment, patient, doctor);
  } else if (paymentMethod === "Wallet") {
    let price = doctor.hourlyRate + 0.1 * doctor.hourlyRate;
    const hours = Math.abs(
      parseInt(appointment.startHour) - parseInt(appointment.endHour)
    );
    price *= hours;
    if (package) {
      price -= price * (package.sessionDiscount / 100);
    }
    if (patient.wallet < price) {
      const error = new Error("Insufficient funds in wallet");
      error.statusCode = 402;
      throw error;
    }
    const result = await appointmentRepo.addAppointment(
      appointment,
      patient,
      doctor,
      price
    );
    return result;
  } else {
    const error = new Error("Invalid payment method");
    error.statusCode = 400;
    throw error;
  }
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

exports.addFamilyMember = async (patientUsername, familyMemberData) => {
  console.log("familyMemberData", familyMemberData, familyMemberData.username);
  const patient = await patientRepo.validatePatient(patientUsername);
  const familyMember = await patientRepo.validatePatient(
    familyMemberData.username
  );
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
    familyMemberData.username
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
  const prescriptions = await prescriptionRepo.getPrescriptions({
    patientUsername,
  });
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
  const prescription = await prescriptionRepo.createAndDownloadPDF(
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

exports.addDocument = async (patientUsername, fileData, bodyData) => {
  await patientRepo.validatePatient(patientUsername);
  const document = await patientRepo.addHealthRecord(
    patientUsername,
    fileData,
    bodyData
  );
  return document;
};

exports.removeDocument = async (patientUsername, documentId) => {
  await patientRepo.validatePatient(patientUsername);
  const document = await patientRepo.removeHealthRecord(
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

exports.sendMessage = async (patientUsername, chatId, content) => {
  await patientRepo.validatePatient(patientUsername);
  const message = await patientRepo.sendMessage(
    chatId,
    patientUsername,
    content
  );
  return message;
};

exports.getAvailablePackages = async (patientUsername) => {
  await patientRepo.validatePatient(patientUsername);
  const packages = await packageRepo.getPackages();
  return packages;
};
