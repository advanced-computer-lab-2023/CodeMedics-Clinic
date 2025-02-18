const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
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
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: {
        name: String,
        number: String,
        relation: String,
      },
      required: false,
    },
    familyMembers: {
      type: [{ relation: String, username: String }],
      ref: "Patient",
    },
    familyMembersNoAccount: {
      type: [Schema.Types.ObjectId],
      ref: "FamilyMember",
    },
    linked: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Patient",
    },
    healthPackage: {
      type: {
        name: String,
        price: Number,
        status: String,
        discount: Number,
        date: Date,
        discountEndDate: Date,
      },
      default: {
        name: "Free",
        price: 0,
        discount: 0,
        status: "Inactive",
        date: null,
        discountEndDate: null,
      },
      required: false,
    },
    wallet: {
      type: Number,
      default: 0,
      required: false,
    },
    healthRecords: [
      {
        //for medical history and doctor notes
        filename: String,
        originalname: String,
        uploadedBy: String,
      },
    ],
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
    socketId: { type: String, required: false },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema, "Patients");
module.exports = Patient;
