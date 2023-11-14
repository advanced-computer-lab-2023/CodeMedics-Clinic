const patientModel = require('../../models/Patient');
const adminModel = require('../../models/Administrator');
const doctorModel = require('../../models/Doctor');
const packageModel = require('../../models/Package');
const {getUsername} = require('../../config/infoGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../../models/FamilyMember');
const schedule = require('node-schedule');
const jwt = require('jsonwebtoken');

function getDiscountAmountForHealthPackage(package){
    if(package == "Free"){
        return 0;
    }
    else if(package == "Silver"){
        return 0.1;
    }
    else if(package == "Gold"){
        return 0.15;
    }
    else if(package == "Platinum"){
        return 0.2;
    }
    else{
        console.error("Invalid package");
    }
}

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
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'Gender', 'Number', 'EmergencyContactName', 'EmergencyContactNumber'];

    for (const variable of requiredVariables) {
        console.log(req.body[variable]);
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }
    // If all required variables are present, proceed with creating the patient
    const {
        FirstName,
        LastName,
        Username,
        Password,
        Email,
        DateOfBirth,
        Gender,
        Number,
        EmergencyContactName,
        EmergencyContactNumber,
        EmergencyContactRelation
    } = req.body;

    //check if the username is already taken
    const existingUser = await adminModel.findOne({ Username: Username }) || await doctorModel.findOne({ Username: Username }) || await patientModel.findOne({ Username: Username });
    if (existingUser) {
        return res.status(400).json({message: 'Username already taken'});
    }

    //check if the email is already taken
    const existingEmail = await adminModel.findOne({ Email: Email }) || await doctorModel.findOne({ Email: Email }) || await patientModel.findOne({ Email: Email });
    if (existingEmail) {
        return res.status(400).json({message: 'Email already taken'});
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    //check if the username is already taken

    const newPatient = new patientModel({
            FirstName: FirstName,
            LastName: LastName,
            Username: Username,
            Password: hashedPassword,
            Email: Email,
            DateOfBirth: DateOfBirth,
            Number: Number,
            Gender: Gender,
            EmergencyContact: {
                Name: EmergencyContactName, Number: EmergencyContactNumber, Relation: EmergencyContactRelation
            }
        })
    ;
    await newPatient.save();
    const token = createToken(Username);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(200).json("Patient created successfully!");
});

const viewPatients = asyncHandler(async (req, res) => {
    try{
    const patients = await patientModel.find();
    return res.status(200).json(patients);
    }catch(e){
        return res.status(400).json({message: e.message});
    }
});
const viewPatientRegister = asyncHandler(async (req, res) => {
    return res.render('PatientViews/RegisterPatient');
});


const healthPackageSubscription = asyncHandler(async (req, res) => {

    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    const {membership} = req.body;
    if (patient && patient.HealthPackage.membership !== membership) {
        patient.HealthPackage.membership = membership;
        patient.HealthPackage.date = Date.now();
        patient.HealthPackage.date.setFullYear(patient.HealthPackage.date.getFullYear() + 1);
        patient.HealthPackage.status = "Active";
        for(const member of patient.FamilyMembers){
            const familyMember = await patientModel.findOne({_id: member.id});
            if(familyMember){
                familyMember.HealthPackage.discount = getDiscountAmountForHealthPackage(membership);
                familyMember.HealthPackage.discountEndDate = Date.now();
                familyMember.HealthPackage.discountEndDate.setFullYear(familyMember.HealthPackage.date.getFullYear() + 1);
                await familyMember.save();
            }
        }
        await patient.save();

        return res.status(200).json({message: "Health Package Subscription Successful!"});
    } else if(patient) {
        return res.status(400).json({message: "Patient already subscribed to health package!"});
    } else {
        return res.status(400).json({message: "Patient not found!"});
    }
    
});

const healthPackageUnsubscription = asyncHandler(async (req, res) => {
    
        const patient = await patientModel.findOne({Username: await getUsername(req, res)});
        if (patient && patient.HealthPackage.membership !== "Free") {
            patient.HealthPackage.status = "EndDateCancelled";
            await patient.save();
            return res.status(200).json({message: "Health Package Unsubscription Successful!"});
        } else if(patient) {
            return res.status(400).json({message: "Patient already unsubscribed to health package!"});
        } else {
            return res.status(400).json({message: "Patient not found!"});
        }
        
    });

const viewHealthPackage = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    if (patient) {
        return res.status(200).json(patient.HealthPackage);
    } else {
        return res.status(400).json({message: "Patient not found!"});
    }
});



const changePassword = async (req, res) => {
    const {username, currentPassword, newPassword } = req.body;
    console.log(username , newPassword);
    try {
        // Fetch the doctor's current data from the database using their username
        const user = await patientModel.findOne({ Username: username }) || await doctorModel.findOne({Username: username}) || await adminModel.findOne({Username: username});

        if (!user) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // // Verify if the current password matches the one in the database
        // const passwordMatch = await bcrypt.compare(currentPassword, patient.Password);

        // if (!passwordMatch) {
        //     return res.status(400).json({ error: 'Current password is incorrect' });
        // }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the doctor's password in the database
        user.Password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMe = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    if (patient) {
        return res.status(200).json(patient);
    } else {
        return res.status(400).json({message: "Patient not found!"});
    }
});

const updateMe = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({Username: await getUsername(req, res)});
    if (patient) {
        const {FirstName, LastName, Email, Number, DateOfBirth, EmergencyContact, Password} = req.body;
        if(Password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);
            patient.Password = hashedPassword;
        }
        patient.FirstName = FirstName;
        patient.LastName = LastName;
        patient.Email = Email;
        patient.Number = Number;
        patient.EmergencyContact = EmergencyContact;
        patient.DateOfBirth = DateOfBirth;
        await patient.save();
        return res.status(200).json({message: "Patient details updated successfully!"});
    } else {
        return res.status(400).json({message: "Patient not found!"});
    }
});

const getAvailablePackages = asyncHandler(async (req, res) => {
    const packages = await packageModel.find();
    if (packages) {
        return res.status(200).json(packages);
    } else {
        return res.status(400).json({message: "packages model is empty!"});
    }
});

const getPackage = asyncHandler(async (req, res) => {
    const {packageName} = req.query;
    const package = await packageModel.findOne({Name: packageName});
    if (package) {
        return res.status(200).json(package);
    } else {
        return res.status(400).json({message: "package not found!"});
    }
});

module.exports = {getPackage, getAvailablePackages, updateMe, getMe, changePassword, createPatient, viewPatientRegister, healthPackageSubscription, healthPackageUnsubscription, viewHealthPackage , viewPatients};
