const adminModel = require("../../models/Administrator.js");
const doctorModel = require("../../models/Doctor.js");
const patientModel = require("../../models/Patient.js");
const packageModel = require("../../models/Package.js");
const infoGetter = require("../../config/infoGetter.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { validateDoctor } = require("../../utils/validator.js");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
  return jwt.sign({ username }, "supersecret", {
    expiresIn: maxAge,
  });
};

const createAdmin = asyncHandler(async (req, res) => {
  //create an admin in the database
  //check req body
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty" });
  }
  const requiredVariables = ["Name", "Username", "Password", "Email"];

  for (const variable of requiredVariables) {
    console.log(req.body[variable]);
    if (
      !req.body[variable] &&
      (variable === "Username" || variable === "Password")
    ) {
      return res
        .status(400)
        .json({ message: `Missing ${variable} in the request body` });
    }
  }
  const found = await adminModel.findOne({ Username: req.body.Username });
  // If all required variables are present, proceed with creating an admin
  const { Name, Username, Password, Email } = req.body;
  if (found) {
    return res.status(400).json({ message: "Username already exists" });
  }
  // Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(Password, salt);

  const newAdmin = new adminModel({
    Name,
    Username,
    Password: hashedPassword,
    Email,
  });
  await newAdmin.save();
  const token = createToken(Username);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  return res.status(201).json("Admin created successfully!");
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await adminModel.find(); // Assuming adminModel is your Mongoose model

  if (admins.length === 0) {
    return res.status(404).json({ message: "No admins found" });
  }

  return res.status(200).json(admins);
});

const updateAdmin = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty" });
  }
};

const removeUser = asyncHandler(async (req, res) => {
  //delete an Admin from the database
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty" });
  }
  // Check if 'Username' is present in the request body
  if (!req.body["Username"] || req.body["Username"].trim() === "") {
    return res
      .status(400)
      .json({ message: "Missing Username in the request body" });
  }
  const { Username } = req.body;

  const username = await infoGetter.getUsername(req, res);

  await Promise.all([
    adminModel.deleteOne({ Username: username }),
    patientModel.deleteOne({ Username: username }),
    doctorModel.deleteOne({ Username: username }),
  ]);
  return res.status(201).json(Username + "'s account has been Deleted!");
});

const getDoctorsReg = async (req, res) => {
  const doctors = await doctorModel.find({
    status: "pending",
  });

  return res.status(200).json({ data: doctors });
};

const getPackages = asyncHandler(async (req, res) => {
  try {
    const packages = await packageModel.find();
    return res.status(200).json({ data: packages });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
});

const addPackage = async (req, res) => {
  try {
    const requiredVariables = [
      "name",
      "price",
      "sessionDiscount",
      "medicineDiscount",
      "familyDiscount",
    ];

    for (const variable of requiredVariables) {
      if (!req.body[variable]) {
        return res
          .status(400)
          .json({ message: `Please fill the missing fields` });
      }
    }
    const { name, price, sessionDiscount, medicineDiscount, familyDiscount } =
      req.body;
    if ((await packageModel.findOne({ name: name })) === null) {
      const newPackage = new packageModel({
        name,
        price,
        sessionDiscount,
        medicineDiscount,
        familyDiscount,
      });
      await newPackage.save();
      return res.status(201).json({
        message: `Package created successfully!`,
      });
    } else {
      console.log("Package already exists");
      return res.status(400).json({ message: "Package name already exists" });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const removePackage = async (req, res) => {
  try {
    const { packageName } = req.params;
    const caseInsensitiveNameQuery = {
      name: { $regex: new RegExp(`^${packageName}$`, "i") },
    };

    const deletedPackage = await packageModel.findOneAndDelete(
      caseInsensitiveNameQuery
    );

    if (deletedPackage) {
      return res.status(200).json(`${packageName} has been deleted`);
    } else {
      return res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Sever Error" });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { name, price, sessionDiscount, medicineDiscount, familyDiscount } =
      req.body;
    const updateFields = {};

    if (price !== undefined && price !== "") {
      updateFields.price = price;
    }

    if (sessionDiscount !== undefined && sessionDiscount !== "") {
      updateFields.sessionDiscount = sessionDiscount;
    }

    if (medicineDiscount !== undefined && medicineDiscount !== "") {
      updateFields.medicineDiscount = medicineDiscount;
    }

    if (familyDiscount !== undefined && familyDiscount !== "") {
      updateFields.familyDiscount = familyDiscount;
    }

    const updatedPackage = await packageModel.findOneAndUpdate(
      { name: name },
      { $set: updateFields },
      { new: true }
    );

    if (updatedPackage) {
      return res.status(200).json({
        message: "Package has been updated!",
      });
    } else {
      return res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Sever Error" });
  }
};

const changePassword = async (req, res) => {
  const { adminUsername } = req.params;
  const { password } = req.body;
  try {
    const admin = await adminModel.findOne({ username: adminUsername });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin.password = hashedPassword;
    await admin.save();

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
};

const rejectDoctorRequest = async (req, res) => {
  const { doctorUsername } = req.params;
  try {
    await validateDoctor(doctorUsername, res);
    await doctorModel.deleteOne({ username: doctorUsername });
    return res
      .status(201)
      .json({ message: "Doctor request rejected and record deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const acceptDoctorRequest = async (req, res) => {
  const { doctorUsername } = req.params;
  try {
    const doctor = await validateDoctor(doctorUsername, res);
    doctor.status = "contract";
    await doctor.save();
    return res
      .status(201)
      .json({ message: "doctor status updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  removeUser,
  getDoctorsReg,
  addPackage,
  removePackage,
  updatePackage,
  getPackages,
  changePassword,
  acceptDoctorRequest,
  rejectDoctorRequest,
};
