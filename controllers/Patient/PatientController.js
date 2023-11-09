const patientModel = require('../../models/Patient');
const {getUsername} = require('../../config/infoGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../../models/FamilyMember');
const schedule = require('node-schedule');
const jwt = require('jsonwebtoken');


const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const createPatient = asyncHandler(async (req, res) => {
    //create a Patient in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'Gender', 'MobileNumber', 'EmergencyContactName', 'EmergencyContactNumber'];

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
        DateOfBirth,
        Gender,
        MobileNumber,
        EmergencyContactName,
        EmergencyContactNumber
    } = req.body;
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newPatient = new patientModel({
            FirstName: FirstName,
            LastName: LastName,
            Username: Username,
            Password: hashedPassword,
            Email: Email,
            DateOfBirth: DateOfBirth,
            Number: MobileNumber,
            Gender: Gender,
            EmergencyContacts: {
                EmergencyContactName: EmergencyContactName, EmergencyContactNumber: EmergencyContactNumber
            }
        })
    ;
    await newPatient.save();
    const token = createToken(Username);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(201).json("Patient created successfully!");
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

    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    if (patient && patient.HealthPackage.status === "Unsubscribed") {
        patient.HealthPackage.status = "Subscribed1";
        patient.HealthPackage.date = Date.now();
        patient.HealthPackage.date.setFullYear(patient.HealthPackage.date.getFullYear() + 1);
        patient.HealthPackage.membership = req.body.membership;
        for(const member of patient.FamilyMembers){
            const familyMember = await patientModel.findOne({_id: member});
            if(familyMember && familyMember.HealthPackage.status === "Unsubscribed"){
                familyMember.HealthPackage.status = "Subscribed2";
                familyMember.HealthPackage.date = Date.now();
                familyMember.HealthPackage.date.setFullYear(familyMember.HealthPackage.date.getFullYear() + 1);
                familyMember.HealthPackage.membership = req.body.membership;
                await familyMember.save();
            }
        }
        await patient.save();
        
        //schedule a job to check if the subscription is overdue
        const jobInterval = new Date(Date.now());
        jobInterval.setFullYear(jobInterval.getFullYear() + 1);
        schedule.scheduleJob(jobInterval, async function(){
            if(patient.HealthPackage.status === "Subscribed1"){
                
                patient.HealthPackage.status = "Unsubscribed";
                patient.HealthPackage.membership = "Free";
                
                for(const member of patient.FamilyMembers){
                    const familyMember = await patientModel.findOne({_id: member});
                    if(familyMember && familyMember.HealthPackage.status === "Subscribed2"){
                        familyMember.HealthPackage.status = "Unsubscribed";
                        familyMember.HealthPackage.membership = "Free";
                        
                        await familyMember.save();
                    }
                }

                await patient.save();
    
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
    
        const patient = await patientModel.findOne({Username: await getUsername(req, res)});
        if (patient && patient.HealthPackage.status !== "Unsubscribed") {
            if(patient.HealthPackage.status === "Subscribed1"){
                for (const member of patient.FamilyMembers) {
                    const patientFamilyMember = await patientModel.findOne({_id: member});
                    if (patientFamilyMember && patientFamilyMember.HealthPackage.status === "Subscribed2") {
                        patientFamilyMember.HealthPackage.status = "Unsubscribed";
                        await patientFamilyMember.save();
                    }
                }
            }
            patient.HealthPackage.status = "Unsubscribed";
            patient.HealthPackage.membership = "Free";
            patient.HealthPackage.date = Date.now();

            await patient.save();
            res.status(200).json({message: "Health Package Unsubscription Successful!"});
        } else if(patient) {
            res.status(400).json({message: "Patient already unsubscribed to health package!"});
        } else {
            res.status(400).json({message: "Patient not found!"});
        }
        
    });

const viewHealthPackage = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    if (patient) {
        res.status(200).json(patient.HealthPackage);
    } else {
        res.status(400).json({message: "Patient not found!"});
    }
});

module.exports = {createPatient, viewPatientRegister, healthPackageSubscription, healthPackageUnsubscription, viewHealthPackage , viewPatients};