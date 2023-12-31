const mongoose = require('mongoose');
const Prescription = require('./Prescription');
const Cart = require('./Cart');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    FirstName: {
        type: String,
        required: [true, 'Please enter a first name']
    },
    LastName: {
        type: String,
        required: [true, 'Please enter a last name']
    },
    Username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    Password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    Email: {
        type: String,
        required: [true, 'Please enter an email']
    },
    DateOfBirth: {
        type: String,
        required: true
    },
    Number: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true,
    },
    Prescriptions: {
        type: [Prescription.schema],
        required: false
    },
    EmergencyContact: {
        type: {
            Name: String,
            Number: String,
            Relation: String
        },
        required: false
    },
    Package: {
        type: String,
        default: 'Free',
        required: false
    },
    FamilyMembers: {
        type: [{ relation: String, id: Schema.Types.ObjectId }],
        ref: 'Patient',
    },
    FamilyMembersNoAccount: {
        type: [Schema.Types.ObjectId],
        ref: 'FamilyMember'
    },
    Appointments: {
        type: [String],
        required: false
    },
    Linked: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Patient'
    },
    Cart :{
        type: Cart.schema,
        required: false
    },
    HealthPackage: {
        type: {
            membership: String, // Free, Silver, Gold, Platinum
            Price: Number,
            status: String,
            discount: Number,
            date: Date,
            discountEndDate: Date,
        },
        default: {
            membership: "Free",
            Price: 0,
            discount: 0,
            status: "Inactive",
            date: null,
            discountEndDate: null,
        },
        required: false
    },
    Wallet: {
        type: Number,
        default: 0,
        required: false
    },
    HealthRecords: [{ //for medical history and doctor notes
        filename: String,
        originalname: String,
        uploadedBy: String,
    }],
    Messages: {
        type: [{
            sender: String,
            content: String,
            timestamp: { type: Date, default: Date.now },
        }],
        default: [],
        required: false,
    },
    SocketID: { type: String, required: false },

}, { timestamps: true });


const Patient = mongoose.model('Patient', patientSchema, 'Patients');
module.exports = Patient;