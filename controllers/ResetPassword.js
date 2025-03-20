const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Admin = require("../models/Administrator");
const nodeMailer = require("nodemailer");

function generateRandomNumber() {
  const val = Math.floor(100000 + Math.random() * 999999);
  return val;
}

exports.resetPassword = async (req, res) => {
  const { username } = req.body;
  let category = null;
  const user =
    (await Patient.findOne({ username: username })) ||
    (await Doctor.findOne({ username: username })) ||
    (await Admin.findOne({ username: username }));
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  let name = "";
  if (user.Name) {
    name = user.Name;
  } else {
    name = user.firstName + " " + user.lastName;
  }
  const emailTo = user.email;

  const num = generateRandomNumber();

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "mamghany10@gmail.com",
      pass: "dahv ghdn iiwx pdmb",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const response = transporter.sendMail(
    {
      from: "mamghany10@gmail.com",
      to: emailTo,
      subject: "CodeMedics Clinic, Verify your account",
      text:
        "Hello, " +
        name +
        "!\n\n" +
        "Your OTP is: " +
        num +
        "\n\n" +
        "Best regards,\n" +
        "El7a2ny Clinic",
    },
    (err, info) => {
      console.log(err);
      return info.accepted;
    }
  );
  if (await Patient.findOne({ username: username })) {
    category = "patients";
  } else if (await Doctor.findOne({ username: username })) {
    category = "doctors";
  } else if (await Admin.findOne({ username: username })) {
    category = "admins";
  }
  res
    .status(200)
    .json({ message: "OTP sent successfully", OTP: num, category });
};
