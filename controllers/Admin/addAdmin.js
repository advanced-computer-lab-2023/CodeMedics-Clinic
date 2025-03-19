const Admin = require("../../models/Administrator");
const Doctor = require("../../models/Doctor");
const Patient = require("../../models/Patient");
const bcrypt = require("bcryptjs");

const addAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const usernameExists =
      (await Admin.findOne({ username })) ||
      (await Doctor.findOne({ username })) ||
      (await Patient.findOne({ username }));

    if (usernameExists) {
      return res.status(400).json({ message: "This username already exists." });
    }

    const emailExists =
      (await Admin.findOne({ email })) ||
      (await Doctor.findOne({ email })) ||
      (await Patient.findOne({ email }));

    if (emailExists) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
      isCreator: false,
    });

    await newAdmin.save();
    return res.status(201).json({ message: "Admin Created Successfully" });
  } catch (error) {
    console.error("Error in addAdmin:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = addAdmin;
