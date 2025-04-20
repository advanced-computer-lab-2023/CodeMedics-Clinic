const bcrypt = require("bcryptjs");
const Doctor = require("../../models/Doctor");

exports.validateDoctor = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

exports.getDoctors = async (query = {}) => {
  const doctors = await Doctor.find(query);
  return doctors;
};

exports.getDoctor = async (doctorUsername) => {
  const doctor = await Doctor.findOne({ username: doctorUsername });
  return doctor;
};

exports.getDoctorByEmail = async (doctorEmail) => {
  const doctor = await Doctor.findOne({ email: doctorEmail });
  return doctor;
};

exports.getDoctorApplications = async () => {
  const doctors = await Doctor.find({ status: "pending" });
  return doctors;
};

exports.createDoctor = async (doctorData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(doctorData.password, salt);
  const doctor = new Doctor({
    ...doctorData,
    password: hashedPassword,
  });
  await doctor.save();
  return doctor;
};

exports.updateDoctor = async (doctorUsername, doctorData) => {
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: doctorData },
    { new: true }
  );
  return doctor;
};

exports.updateDoctorPassword = async (doctorUsername, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return doctor;
};

exports.generateContract = async (doctor) => {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument();

      // Load the regular font
      doc.font("./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf");

      //add logo
      const logoPath = "./Frontend/el7a2ny-frontend/public/assets/logo.png";
      doc.image(logoPath, 450, -45, { width: 120 }).moveDown(3.5); // Adjust x, y position and width as needed

      doc
        .fontSize(30)
        .fillColor("purple")
        .text(`CodeMedics Clinic`)
        .fillColor("black")
        .text(`Independent Contractor Agreement`)
        .moveDown(1.0);

      // Draw a horizontal line
      doc
        .moveTo(50, doc.y) // Starting point of the line
        .lineTo(doc.page.width - 50, doc.y) // Ending point of the line
        .stroke(); // Draw the line

      // Add space after the line
      doc.moveDown(1.0);

      doc
        .fontSize(18)
        .fillColor("black")
        .text(`Dr. ${doctor.firstName} ${doctor.lastName},`)
        .moveDown(1.0);

      doc
        .fontSize(17)
        .fillColor("black")
        .text(
          `Through this agreement, You acknowledge and agree to provide services through CodeMedics Clinic, adhering to terms outlined by the platform.`
        )
        .moveDown(1.0);

      doc
        .fontSize(17)
        .fillColor("black")
        .text(
          `You will accurately report hours worked on the platform and maintain records for compensation purposes. The compensation for services shall be based on an hourly rate of:`
        )
        .moveDown(1.0);

      doc
        .fontSize(17)
        .fillColor("green")
        .fontSize(24)
        .text(`${doctor.hourlyRate} EGP`)
        .moveDown(0.75);

      doc
        .fontSize(17)
        .fillColor("black")
        .text(
          `The Hourly Rate is subject to periodic review and adjustment by mutual agreement between the doctor and CodeMedics Clinic.`
        )
        .moveDown(1.75);

      doc
        .fontSize(14)
        .fillColor("black")
        .text(`Chief Medical Officer`)
        .moveDown(0.25);

      // Load the Signature font
      doc.font("./Frontend/el7a2ny-frontend/public/assets/Whisper-Regular.ttf");

      doc.fontSize(22).fillColor("purple").text(`Omar  Osama`).moveDown(0.5);

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteDoctor = async (doctorUsername) => {
  const deletedDoctor = await Doctor.findOneAndDelete({
    username: doctorUsername,
  });
  return deletedDoctor;
};

exports.getPatients = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const patients = doctor.patients;
  return patients;
};

exports.getHealthRecords = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const healthRecords = doctor.healthRecords;
  return healthRecords;
};

exports.getChats = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const chats = doctor.chats;
  return chats;
};

exports.getNotifications = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const notifications = doctor.messages;
  return notifications;
};
