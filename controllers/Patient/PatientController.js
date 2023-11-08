const patientModel = require('../../models/Patient');
const getUsername = require('../../config/infoGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../../models/FamilyMember');
const schedule = require('node-schedule');


const createPatient = asyncHandler(async (req, res) => {
    //create a Patient in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'NationalID', 'Email', 'DateOfBirth', 'Gender', 'MobileNumber', 'EmergencyContactName', 'EmergencyContactNumber'];

    for (const variable of requiredVariables) {
        console.log(req.body[variable]);
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }
    // If all required variables are present, proceed with creating an admin
    const {
        FirstName,
        LastName,
        Username,
        Password,
        Email,
        NationalID,
        DateOfBirth,
        Gender,
        MobileNumber,
        EmergencyContactName,
        EmergencyContactNumber
    } = req.body;
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    if (await getUsername.getUsername(req, res) === '') {
        const newPatient = new patientModel({
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                Password: hashedPassword,
                Email: Email,
                NationalID: NationalID,
                DateOfBirth: DateOfBirth,
                Number: MobileNumber,
                Gender: Gender,
                EmergencyContacts: {
                    EmergencyContactName: EmergencyContactName, EmergencyContactNumber: EmergencyContactNumber
                }
            })
        ;
        await newPatient.save();
        return res.status(201).json("Patient created successfully!");

    } else {
        return res.status(400).json({message: "Username already exists"});
    }
});
const viewPatients = asyncHandler(async (req, res) => {
    try{
    const patients = await patientModel.find();
    res.status(200).json(patients);
    }catch(e){
        res.status(400).json({message: e.message});
    }
});
const viewPatientRegister = asyncHandler(async (req, res) => {
    res.render('PatientViews/RegisterPatient');
});


const healthPackageSubscription = asyncHandler(async (req, res) => {

    const patient = await patientModel.findOne({Username: process.env.Username});
    if (patient && patient.HealthPackage.status === "Unsubscribed") {
        patient.HealthPackage.status = "Subscribed";
        patient.HealthPackage.date = Date.now();
        const familyMembers = await patient.populate('FamilyMember').exec();

        for (const member of familyMembers) {
            const patientFamilyMember = await patientModel.findOne({NationalID: member.NationalID});
            if (patientFamilyMember) {
                patientFamilyMember.HealthPackage.status = "Subscribed";
                patientFamilyMember.HealthPackage.date = Date.now();
                await patientFamilyMember.save();
            }
        }
        await patient.save();
        
        //schedule a job to check if the subscription is overdue
        const rule = new schedule.RecurrenceRule();
        rule.date = new Date(Date.now()).getDay();
        const job = schedule.scheduleJob(rule, async function(){
            if(patient.HealthPackage.status === "Subscribed"){
        
                if(patient.Wallet >= patientModel.calculatePackageCost(patient)){
                    patient.Wallet -= patientModel.calculatePackageCost(patient);
                    patient.HealthPackage.status = "Subscribed";
                    patient.HealthPackage.date = Date.now();
                    await patient.save();
                    // TODO(nour): add notification
                } else {
                    patient.HealthPackage.status = "Overdue";
                    // TODO(nour): add notification
                    await patient.save();
                }
    
            }
        });

        res.status(200).json({message: "Health Package Subscription Successful!"});
    } else if(patient) {
        res.status(400).json({message: "Patient already subscribed to health package!"});
    } else {
        res.status(400).json({message: "Patient not found!"});
    }
    
});

const healthPackageUnsubscription = asyncHandler(async (req, res) => {
    
        const patient = await patientModel.findOne({Username: process.env.Username});
        if (patient && patient.HealthPackage.status !== "Unsubscribed") {
            patient.HealthPackage.status = "Cancelled";
            const familyMembers = await patient.populate('FamilyMember').exec();

            for (const member of familyMembers) {
                const patientFamilyMember = await patientModel.findOne({NationalID: member.NationalID});
                if (patientFamilyMember) {
                    patientFamilyMember.HealthPackage.status = "Cancelled";
                    await patientFamilyMember.save();
                }
            }

            await patient.save();
            res.status(200).json({message: "Health Package Unsubscription Successful!"});
        } else if(patient) {
            res.status(400).json({message: "Patient already unsubscribed to health package!"});
        } else {
            res.status(400).json({message: "Patient not found!"});
        }
        
    });

const viewHealthPackage = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({Username: process.env.Username});
    if (patient) {
        res.status(200).json(patient.HealthPackage);
    } else {
        res.status(400).json({message: "Patient not found!"});
    }
});

const calculateHealthPackageCost = patient => {};

module.exports = {createPatient, viewPatientRegister , viewPatients};