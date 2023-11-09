const adminModel = require('../../models/Administrator.js');
const doctorModel = require('../../models/Doctor.js');
const patientModel = require('../../models/Patient.js');
const packageModel = require('../../models/Package.js');
const infoGetter = require('../../config/infoGetter.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const createAdmin = asyncHandler(async (req, res) => {
    //create an admin in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }
    const requiredVariables = ['Name', 'Username', 'Password', 'Email'];

    for (const variable of requiredVariables) {
        console.log(req.body[variable]);
        if (!req.body[variable] && (variable === 'Username' || variable === 'Password')) {
            return res.status(400).json({ message: `Missing ${variable} in the request body` });
        }
    }
    // If all required variables are present, proceed with creating an admin
    const { Name, Username, Password, Email } = req.body;
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newAdmin = new adminModel({ Name, Username, Password: hashedPassword, Email });
    await newAdmin.save();
    const token = createToken(Username);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(201).json("Admin created successfully!");
});

const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await adminModel.find(); // Assuming adminModel is your Mongoose model

    if (admins.length === 0) {
        return res.status(404).json({ message: 'No admins found' });
    }

    return res.status(200).json(admins);
});


const updateAdmin = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }
}

const removeUser = asyncHandler(async (req, res) => {
    //delete an Admin from the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json("Request body is empty");
    }
    // Check if 'Username' is present in the request body
    if (!req.body['Username'] || req.body['Username'].trim() === '') {
        return res.status(400).json("Missing Username in the request body");
    }
    const { Username } = req.body;
   
    const username = await infoGetter.getUsername(req, res);

    await Promise.all([
        adminModel.deleteOne({ Username: username }),
        patientModel.deleteOne({ Username: username }),
        doctorModel.deleteOne({ Username: username })
    ]);
    return res.status(201).json(Username + "'s account has been Deleted!")
});


const getDoctorsReg = asyncHandler(async (req, res) => {
    const Username = req.body.Username;

    const doctors = await doctorModel.find({ Username: Username, Status: "Pending" });

    if (doctors.length === 0) {
        return res.status(404).json("No doctor applications found");
    }

    return res.status(200).json(doctors);


});

const getPackages = asyncHandler(async (req, res) => {
    try {
        const packages = await packageModel.find();
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

const addPackage = async (req, res) => {
    //add a package to the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }
    const requiredVariables = ['Name', 'Price', 'SessionDiscount', 'MedicineDiscount', 'FamilyDiscount'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({ message: `Missing ${variable} in the request body` });
        }

    }
    const { Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount } = req.body;
    if (await packageModel.findOne({ Name: Name }) === null) {
        const newPackage = new packageModel({ Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount });
        try {
            await newPackage.save();
            return res.status(201).json({message: '${Name} Package created successfully!'});
        } catch (error) {
            return res.status(409).json({ message: error.message });
        }
    } else {
        console.log("Package already exists");
        return res.status(400).json({ message: "Package already exists" });
    }
}

const removePackage = async (req, res) => {
    // delete a package from the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }

    // Check if 'Name' is present in the request body
    if (!req.body['Name'] || req.body['Name'].trim() === '') {
        return res.status(400).json({ message: 'Missing Name in the request body' });
    }

    const { Name } = req.body;
    const caseInsensitiveNameQuery = { Name: { $regex: new RegExp(`^${Name}$`, 'i') } };

    try {
        const deletedPackage = await packageModel.findOneAndDelete(caseInsensitiveNameQuery);

        if (deletedPackage) {
            return res.status(200).json(`${Name} has been deleted`);
        } else {
            return res.status(404).json("Package not found in the database!");
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting package' });
    }
};


const updatePackage = async (req, res) => {
    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }

    // Check if 'Name' is present in the request body
    if (!req.body['Name']) {
        return res.status(400).json({ message: 'Missing Name in the request body' });
    }

    const { Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount } = req.body;

    // Check which variables (besides Name) exist in the request body
    const updateFields = {};

    if (Price !== undefined) {
        updateFields.Price = Price;
    }

    if (SessionDiscount !== undefined) {
        updateFields.SessionDiscount = SessionDiscount;
    }

    if (MedicineDiscount !== undefined) {
        updateFields.MedicineDiscount = MedicineDiscount;
    }

    if (FamilyDiscount !== undefined) {
        updateFields.FamilyDiscount = FamilyDiscount;
    }

    try {
        const updatedPackage = await packageModel.findOneAndUpdate(
            { Name: Name },
            { $set: updateFields },
            { new: true }
        );

        if (updatedPackage) {
            return res.status(200).json(Name + " has been updated!");
        } else {
            return res.status(404).json("Package not found in the database!");
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating package' });
    }
};


module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    removeUser,
    getDoctorsReg,
    addPackage,
    removePackage,
    updatePackage,
    getPackages
};