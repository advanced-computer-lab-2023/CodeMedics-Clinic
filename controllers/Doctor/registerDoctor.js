const doctorModel = require("../../models/Doctor.js");
const adminModel = require("../../models/Administrator.js");
const patientModel = require("../../models/Patient.js");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const uploads = require("../../config/multerConfig.js");
const infoGetter = require("../../config/infoGetter.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateDoctor } = require("../../utils/validator.js");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
  return jwt.sign({ username }, "supersecret", {
    expiresIn: maxAge,
  });
};

const createDoctor = asyncHandler(async (req, res) => {
  try {
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

    const { username, email } = req.body;
    console.log("creating doctor", req.body);
    const existingUser =
      (await adminModel.findOne({ username: username })) ||
      (await doctorModel.findOne({ username: username })) ||
      (await patientModel.findOne({ username: username }));
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail =
      (await adminModel.findOne({ email: email })) ||
      (await doctorModel.findOne({ email: email })) ||
      (await patientModel.findOne({ email: email }));
    if (existingEmail) {
      return res.status(400).json({ message: "Email already taken" });
    }

    for (const variable of requiredVariables) {
      if (!req.body[variable]) {
        return res
          .status(400)
          .json({ message: `Please fill the missing fields` });
      }
    }
    if (!req.files || Object.keys(req.files).length !== 3) {
      return res.status(400).json({
        message:
          "Please upload ID Document, Medical Degree, and Medical License",
      });
    }

    const idDocumentFile = req.files["nationalIdFile"][0].filename;
    const medicalDegreeFile = req.files["medicalDegreeFile"][0].filename;
    const medicalLicenseFile = req.files["medicalLicenseFile"][0].filename;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newDoctor = new doctorModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      hourlyRate: req.body.hourlyRate,
      affiliation: req.body.affiliation,
      degree: req.body.degree,
      speciality: req.body.speciality,
      nationalIdFile: idDocumentFile,
      medicalDegreeFile: medicalDegreeFile,
      medicalLicenseFile: medicalLicenseFile,
    });
    await newDoctor.save();

    const token = createToken(req.body.Username);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    return res.status(201).json("Doctor created successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const changePassword = async (req, res) => {
  const { doctorUsername } = req.params;
  const { password } = req.body;
  console.log("Here ---> ", doctorUsername, password);
  try {
    const doctor = await validateDoctor(doctorUsername, res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    doctor.password = hashedPassword;
    await doctor.save();

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  changePassword,
};
