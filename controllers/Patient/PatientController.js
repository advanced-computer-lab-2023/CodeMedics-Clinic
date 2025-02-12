const patientModel = require("../../models/Patient");
const adminModel = require("../../models/Administrator");
const doctorModel = require("../../models/Doctor");
const packageModel = require("../../models/Package");
const appointmentModel = require("../../models/Appointment");
const { getUsername } = require("../../config/infoGetter.js");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const FamilyMember = require("../../models/FamilyMember");
const schedule = require("node-schedule");
const jwt = require("jsonwebtoken");

function getDiscountAmountForHealthPackage(package) {
  if (package == "Free") {
    return 0;
  } else if (package == "Silver") {
    return 0.1;
  } else if (package == "Gold") {
    return 0.15;
  } else if (package == "Platinum") {
    return 0.2;
  } else {
    console.error("Invalid package");
  }
}

function getPackagePrice(membership) {
  if (membership == "Silver") {
    return 3600;
  } else if (membership == "Gold") {
    return 6000;
  } else if (membership == "Platinum") {
    return 9000;
  } else {
    console.error("Invalid membership");
  }
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (username) => {
  return jwt.sign({ username }, "supersecret", {
    expiresIn: maxAge,
  });
};

const createPatient = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty" });
  }
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
    console.log(req.body[variable]);
    if (!req.body[variable]) {
      return res
        .status(400)
        .json({ message: `Missing ${variable} in the request body` });
    }
  }
  // If all required variables are present, proceed with creating the patient
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
  } = req.body;

  //check if the username is already taken
  const existingUser =
    (await adminModel.findOne({ username: username })) ||
    (await doctorModel.findOne({ username: username })) ||
    (await patientModel.findOne({ username: username }));
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  //check if the email is already taken
  const existingEmail =
    (await adminModel.findOne({ email: email })) ||
    (await doctorModel.findOne({ email: email })) ||
    (await patientModel.findOne({ email: email }));
  if (existingEmail) {
    return res.status(400).json({ message: "Email already taken" });
  }

  const salt = await bcrypt.genSalt(process.env.BCRYPT_NUMBER_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newPatient = new patientModel({
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
  await newPatient.save();
  const token = createToken(username);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  return res.status(201).json("Patient created successfully!");
});

const getPatients = asyncHandler(async (req, res) => {
  try {
    const patients = await patientModel.find();
    return res.status(200).json({ data: patients });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

const healthPackageSubscription = asyncHandler(async (req, res) => {
  const patient = await patientModel.findOne({
    Username: await getUsername(req, res),
  });
  const { membership } = req.body;
  if (patient && patient.HealthPackage.membership !== membership) {
    patient.HealthPackage.membership = membership;
    patient.HealthPackage.date = Date.now();
    patient.HealthPackage.date.setFullYear(
      patient.HealthPackage.date.getFullYear() + 1
    );
    patient.HealthPackage.status = "Active";
    for (const member of patient.FamilyMembers) {
      const familyMember = await patientModel.findOne({ _id: member.id });
      if (familyMember) {
        familyMember.HealthPackage.discount =
          getDiscountAmountForHealthPackage(membership);
        familyMember.HealthPackage.discountEndDate = Date.now();
        familyMember.HealthPackage.discountEndDate.setFullYear(
          familyMember.HealthPackage.discountEndDate.getFullYear() + 1
        );
        await familyMember.save();
      }
    }
    await patient.save();

    return res
      .status(200)
      .json({ message: "Health Package Subscription Successful!" });
  } else if (patient) {
    return res
      .status(400)
      .json({ message: "Patient already subscribed to health package!" });
  } else {
    return res.status(400).json({ message: "Patient not found!" });
  }
});

const healthPackageUnsubscription = asyncHandler(async (req, res) => {
  const patient = await patientModel.findOne({
    Username: await getUsername(req, res),
  });
  if (patient && patient.HealthPackage.membership !== "Free") {
    patient.HealthPackage.status = "EndDateCancelled";
    await patient.save();
    return res
      .status(200)
      .json({ message: "Health Package Unsubscription Successful!" });
  } else if (patient) {
    return res
      .status(400)
      .json({ message: "Patient already unsubscribed to health package!" });
  } else {
    return res.status(400).json({ message: "Patient not found!" });
  }
});

const viewHealthPackage = asyncHandler(async (req, res) => {
  const patient = await patientModel.findOne({
    Username: await getUsername(req, res),
  });
  if (patient) {
    return res.status(200).json(patient.HealthPackage);
  } else {
    return res.status(400).json({ message: "Patient not found!" });
  }
});

const getPatient = asyncHandler(async (req, res) => {
  const patientUsername  = req.params.patientUsername;
  console.log(req.params, patientUsername)
  const patient = await patientModel.findOne({ username: patientUsername });
  if (patient) {
    return res.status(200).json({ data: patient });
  } else {
    return res.status(400).json({ message: "Patient not found!" });
  }
});

const updatePatient = asyncHandler(async (req, res) => {
  const { patientUsername } = req.params;
  const patient = await patientModel.findOne({ username: patientUsername });
  if (patient) {
    const {
      firstName,
      lastName,
      email,
      number,
      dateOfBirth,
      emergencyContact,
      password,
      wallet,
    } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(process.env.BCRYPT_NUMBER_OF_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      patient.password = hashedPassword;
    }
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.email = email;
    patient.number = number;
    patient.emergencyContact = emergencyContact;
    patient.dateOfBirth = dateOfBirth;
    patient.wallet = wallet;
    await patient.save();
    return res
      .status(200)
      .json({ message: "Patient details updated successfully!" });
  } else {
    return res.status(400).json({ message: "Patient not found!" });
  }
});

const getAvailablePackages = asyncHandler(async (req, res) => {
  const packages = await packageModel.find();
  if (packages) {
    return res.status(200).json(packages);
  } else {
    return res.status(400).json({ message: "packages model is empty!" });
  }
});

const getPackage = asyncHandler(async (req, res) => {
  const { packageName } = req.query;
  const package = await packageModel.findOne({ Name: packageName });
  if (package) {
    return res.status(200).json(package);
  } else {
    return res.status(400).json({ message: "package not found!" });
  }
});

const payWithWalletPackage = async (req, res) => {
  try {
    const Username = await getUsername(req, res);
    const { membership } = req.body;
    const price = getPackagePrice(membership);
    const patient = await patientModel.findOne({ Username });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (patient.Wallet < price) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    patient.Wallet -= price;
    await patient.save();

    res.status(200).json({ message: "Payment Succeeded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  payWithWalletPackage,
  getPackage,
  getAvailablePackages,
  updatePatient,
  getPatient,
  createPatient,
  healthPackageSubscription,
  healthPackageUnsubscription,
  viewHealthPackage,
  getPatients,
};
