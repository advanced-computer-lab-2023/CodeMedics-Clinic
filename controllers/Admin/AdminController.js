const adminModel = require('../../models/Administrator.js');
const doctorModel = require('../../models/Doctor.js');
const patientModel = require('../../models/Patient.js');
const packageModel = require('../../models/Package.js');
const getUsername = require('../../config/usernameGetter.js');

const createAdmin = async (req, res) => {
    //create an admin in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['Name', 'Username', 'Password', 'Email'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }

    // If all required variables are present, proceed with creating an admin
    const {Name, Username, Password, Email} = req.body;

    if (await getUsername.get(req, res) === '') {
        const newAdmin = new adminModel({Name, Username, Password, Email});
        try {
            await newAdmin.save();
            return res.status(201).json("Admin created successfully!");
        } catch (error) {
            return res.status(409).json({message: error.message});
        }
    } else {
        return res.status(400).json({message: "Username already exists"});
    }


}

const getAllAdmins = async (req, res) => {
//get all admins from the database
}


const updateAdmin = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
}

const removeAdmin = async (req, res) => {
    //delete an Admin from the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    // Check if 'Username' is present in the request body
    if (!req.body['Username'] || req.body['Username'].trim() === '') {
        return res.status(400).json({message: 'Missing Username in the request body'});
    }
    const {Username} = req.body;
    if (await getUsername.get(req, res) === '') {
        return res.status(404).json("User not found in database!");
    } else {
        const username = await getUsername.get(req, res);
        try {
            await Promise.all([
                adminModel.deleteOne({Username: username}),
                patientModel.deleteOne({Username: username}),
                doctorModel.deleteOne({Username: username})
            ]);
            return res.status(201).json(Username + "'s account has been Deleted!")
        } catch (error) {
            return res.status(500).json({message: 'Error deleting user'});
        }
    }
}
const getAllDoctorsApps = async (req, res) => {
    //get all doctors applications from the database

}
const addPackage = async (req, res) => {
    //add a package to the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['Name', 'Price', 'SessionDiscount', 'MedicineDiscount', 'FamilyDiscount'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }

    }
    const {Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount} = req.body;
    if (await packageModel.findOne({Name: Name}) === null) {
        const newPackage = new packageModel({Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount});
        try {
            await newPackage.save();
            return res.status(201).json("Package created successfully!");
        } catch (error) {
            return res.status(409).json({message: error.message});
        }
    } else {
        return res.status(400).json({message: "Package already exists"});
    }
}

const removePackage = async (req, res) => {
    // delete a package from the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }

    // Check if 'Name' is present in the request body
    if (!req.body['Name'] || req.body['Name'].trim() === '') {
        return res.status(400).json({message: 'Missing Name in the request body'});
    }

    const {Name} = req.body;
    const caseInsensitiveNameQuery = {Name: {$regex: new RegExp(Name, 'i')}};

    if (await packageModel.findOne(caseInsensitiveNameQuery) !== null) {
        try {
            await packageModel.deleteOne(caseInsensitiveNameQuery);
            return res.status(201).json(Name + " has been Deleted!");
        } catch (error) {
            return res.status(500).json({message: 'Error deleting package'});
        }
    } else {
        return res.status(404).json("Package not found in the database!");
    }
};

const updatePackage = async (req, res) => {
    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }

    // Check if 'Name' is present in the request body
    if (!req.body['Name']) {
        return res.status(400).json({message: 'Missing Name in the request body'});
    }

    const {Name, Price, SessionDiscount, MedicineDiscount, FamilyDiscount} = req.body;

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
            {Name: Name},
            {$set: updateFields},
            {new: true}
        );

        if (updatedPackage) {
            return res.status(200).json(Name + " has been updated!");
        } else {
            return res.status(404).json("Package not found in the database!");
        }
    } catch (error) {
        return res.status(500).json({message: 'Error updating package'});
    }
};


module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    removeAdmin,
    getAllDoctorsApps,
    addPackage,
    removePackage,
    updatePackage
};