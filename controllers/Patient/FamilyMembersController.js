const Patient = require('../../models/Patient');
const FamilyMember = require('../../models/FamilyMember');
const {getUsername} = require('../../config/infoGetter');

exports.addFamilyMember = async (req, res) => {
   const Username = await getUsername(req, res);
   const {familyMemberUsername} = req.body;
   try{
      const patient = await Patient.findOne({Username});
      if(patient == null){
         return res.status(404).json({message: 'Patient does not exist'});
      }
      const exists = await Patient.findOne({familyMemberUsername});
      if(exists == null){
         return res.status(400).json({message: 'Family member does not exist'});
      }
      patient.FamilyMembers.push(exists._id);
      const updatedPatient = await patient.save();
      res.status(200).json({message: 'Family member added successfully' , data: updatedPatient});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};

exports.viewFamilyMembers = async (req, res) => {
   const Username = await getUsername(req, res);
   const patient = await Patient.findOne({Username});
   if(patient == null){
      return res.status(404).json({message: 'Patient does not exist'});
   }
   try{
      const familyMembers = [];
      for(let i=0; i<patient.FamilyMembers.length; i++){
         const familyMember = await Patient.findOne({_id: patient.FamilyMembers[i]});
         familyMembers.push(familyMember);
      }
      res.status(200).json({message: 'Family members fetched successfully' , data: familyMembers});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};
