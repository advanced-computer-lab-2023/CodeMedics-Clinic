const Doctor = require("../../models/Doctor");
const { validateDoctor } = require("../../utils/validator");

exports.updateDoctor = async (req, res) => {
  try {
    console.log(req.params);
    const { doctorUsername } = req.params;
    const {
      firstName,
      lastName,
      email,
      hourlyRate,
      affiliation,
      dateOfBirth,
      speciality,
      degree,
      password,
    } = req.body;
    const doctor = await validateDoctor(doctorUsername, res);
    console.log("updating", req.body);
    if (email != null) {
      const exists = await Doctor.findOne({ email });
      if (exists && exists.username !== doctorUsername) {
         return res.status(400).json({ message: "Email already exists" });
       }
      doctor.email = email;
    }

    if (hourlyRate != null) {
      if (Number(hourlyRate) <= 0) {
        return res
          .status(400)
          .json({ message: "Hourly Rate should be positive" });
      }
      doctor.hourlyRate = hourlyRate;
    }

    if (firstName != null) {
      doctor.firstName = firstName;
    }

    if (lastName != null) {
      doctor.lastName = lastName;
    }

    if (affiliation != null) {
      doctor.affiliation = affiliation;
    }

    if (dateOfBirth != null) {
      doctor.dateOfBirth = dateOfBirth;
    }

    if (speciality != null) {
      doctor.speciality = speciality;
    }

    if (degree != null) {
      doctor.degree = degree;
    }

    if (password != null) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      doctor.password = hashedPassword;
    }

    await doctor.save();
    res.status(201).json({ message: "Doctor updated successfully" });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Internal Server Error, please try later" });
  }
};
