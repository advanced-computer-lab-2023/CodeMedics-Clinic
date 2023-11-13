const Admin = require('../../models/Administrator'); 
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');

const addAdmin = async (req, res) => {
    const { Username, Password } = req.body;
    console.log("addAdmin");
    console.log(Username, Password);
    const admin = await Admin.findOne({Username: Username });
    if(admin){
        return res.status(400).json({message: 'Admin already exists.'});
    }
    const temp1 = await Doctor.findOne({Username: Username });
    if(temp1){
        return res.status(400).json({message: 'Doctor already exists.'});
    }
    const temp2 = await Patient.findOne({Username: Username });
    if(temp2){
        return res.status(400).json({message: 'Patient already exists.'});
    }
    const newAdmin = new Admin({
        Username: Username,
        Password: Password,
        isCreator: false
    });
    await newAdmin.save();
    return res.status(200).json({message: 'Admin Created Successfully'});
};

module.exports = addAdmin;