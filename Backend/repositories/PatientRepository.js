const bcrypt = require("bcryptjs");
const Patient = require("../../models/Patient");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const FamilyMember = require("../../models/FamilyMember");
const { FREE_PACKAGE } = require("../Constants");
const { validatePatient } = require("../../utils/validator");

exports.validatePatient = async (patientUsername) => {
  const patient = await this.getPatient(patientUsername);
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }
  return patient;
};

exports.getPatients = async () => {
  const patients = await Patient.find({});
  return patients;
};

exports.getPatient = async (patientUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  return patient;
};

exports.createPatient = async (patientData) => {
  const {
    firstName,
    lastName,
    username,
    password,
    email,
    dateOfBirth,
    gender,
    number,
    emergencyContactName,
    emergencyContactNumber,
    emergencyContactRelation,
  } = patientData;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const patient = new Patient({
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: hashedPassword,
    email: email,
    dateOfBirth: dateOfBirth,
    number: number,
    gender: gender,
    emergencyContact: {
      name: emergencyContactName,
      number: emergencyContactNumber,
      relation: emergencyContactRelation,
    },
  });
  await patient.save();

  return patient;
};

exports.updatePatient = async (patientUsername, patientData) => {
  const {
    firstName,
    lastName,
    username,
    email,
    dateOfBirth,
    gender,
    number,
    emergencyContact,
  } = patientData;

  console.log("patientData", patientData);

  const updatedPatient = await Patient.findOneAndUpdate(
    { username: patientUsername },
    {
      $set: {
        firstName,
        lastName,
        username,
        email,
        dateOfBirth,
        number,
        gender,
        emergencyContact,
      },
    },
    { new: true }
  );

  return updatedPatient;
};

exports.updatePatientPassword = async (patientUsername, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedPatient = await Patient.findOneAndUpdate(
    { username: patientUsername },
    { $set: { password: hashedPassword } },
    { new: true }
  );

  return updatedPatient;
};

exports.deletePatient = async (patientUsername) => {
  const deletedPatient = await Patient.findOneAndDelete({
    username: patientUsername,
  });
  return deletedPatient;
};

exports.payHealthPackage = async (patientUsername, package, price = 0) => {
  const patient = await this.validatePatient(patientUsername);
  patient.healthPackage = package;
  patient.wallet -= price;
  await patient.save();
  return patient;
};

exports.unsubscribeHealthPackage = async (patientUsername) => {
  const patient = await Patient.findOneAndUpdate(
    { username: patientUsername },
    { healthPackage: FREE_PACKAGE },
    { new: true }
  );
  return patient;
};

exports.getFamilyMembers = async (patientUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  const familyMembers = [];
  for (let i = 0; i < patient.familyMembers.length; i++) {
    const familyMember = await Patient.findOne({
      username: patient.familyMembers[i].username,
    });
    familyMembers.push(familyMember);
  }
  return familyMembers;
};

exports.getFamilyMembersWithNoAccount = async (patientUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  const familyMembers = [];
  for (let i = 0; i < patient.familyMembersNoAccount.length; i++) {
    const familyMember = await FamilyMember.findById(
      patient.familyMembersNoAccount[i]
    );
    familyMembers.push(familyMember);
  }
  return familyMembers;
};

exports.addFamilyMember = async (patientUsername, familyMemberUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  const familyMember = await Patient.findOne({
    username: familyMemberUsername,
  });
  if (!patient.familyMembers) {
    patient.familyMembers = [];
  }
  patient.familyMembers.push({ username: familyMemberUsername });
  familyMember.linked = patient._id;
  await patient.save();
  await familyMember.save();
  return familyMember;
};

exports.removeFamilyMember = async (patientUsername, familyMemberUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  const familyMember = await Patient.findOne({
    username: familyMemberUsername,
  });
  patient.familyMembers = patient.familyMembers.filter(
    (member) => member.username !== familyMemberUsername
  );
  familyMember.linked = null;
  await patient.save();
  await familyMember.save();
  return familyMember;
};

exports.addFamilyMemberWithNoAccount = async (
  patientUsername,
  familyMemberData
) => {
  const { name, nationalId, gender, dateOfBirth, relationship } =
    familyMemberData;
  const patient = await Patient.findOne({ username: patientUsername });
  const familyMember = new FamilyMember({
    name,
    nationalId,
    gender,
    dateOfBirth,
    relationship,
  });
  const savedFamilyMember = await familyMember.save();
  patient.familyMembersNoAccount.push(savedFamilyMember._id);
  await patient.save();
  return familyMemberData;
};

exports.removeFamilyMemberWithNoAccount = async (
  patientUsername,
  familyMemberId
) => {
  const patient = await Patient.findOne({ username: patientUsername });
  patient.familyMembersNoAccount = patient.familyMembersNoAccount.filter(
    (member) => member._id.toString() !== familyMemberId
  );
  await patient.save();
  return familyMemberId;
};

exports.getHealthRecords = async (patientUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  return patient.healthRecords;
};

exports.addHealthRecord = async (patientUsername, fileData, bodyData) => {
  const patient = await validatePatient(patientUsername);
  const { filename, originalname } = fileData;
  const { username, linkedId } = bodyData;

  console.log("adding health record", fileData, bodyData);
  const healthRecord = {
    filename,
    originalname,
    uploadedBy: username,
  };

  if (linkedId) {
    healthRecord.linked = linkedId;
  }

  patient.healthRecords.push(healthRecord);
  await patient.save();
  return healthRecord;
};

exports.removeHealthRecord = async (patientUsername, healthRecordId) => {
  const patient = await Patient.findOne({ username: patientUsername });
  patient.healthRecords = patient.healthRecords.filter(
    (record) => record._id.toString() !== healthRecordId
  );
  await patient.save();
  return healthRecordId;
};

exports.getNotifications = async (patientUsername) => {
  const patient = await Patient.findOne({ username: patientUsername });
  return patient.messages;
};
