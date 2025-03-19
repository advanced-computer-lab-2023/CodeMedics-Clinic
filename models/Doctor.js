const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Please enter a Date of Birth"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Please enter an hourly rate"],
    },
    affiliation: {
      type: String,
      required: [true, "Please enter an affiliation"],
    },
    degree: {
      type: String,
      required: [true, "Please enter a degree"],
    },
    status: {
      type: String,
      enum: ["approved", "pending", "contract", "rejected"],
      default: "Pending",
      required: false,
    },
    speciality: {
      type: String,
      required: [true, "Please enter a specialty"],
    },
    patients: {
      type: [String],
      required: false,
    },
    wallet: {
      type: Number,
      default: 0,
      required: false,
    },
    socketId: { type: String, required: false },
    idDocument: { type: String },
    medicalDegree: { type: String },
    medicalLicense: { type: String },
    messages: {
      type: [
        {
          sender: String,
          content: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema, "Doctors");
module.exports = Doctor;
