const Patient = require('../../models/Patient');
const FamilyMember = require('../../models/FamilyMember');

exports.addFamilyMember = async (req, res) => {
   const {Username} = req.body;
   const {Name , NationalID , Gender , DateOfBirth , Relationship} = req.body;
   const familyMember = new FamilyMember({Name , NationalID , Gender , DateOfBirth , Relationship});
   try{
      const patient = await Patient.findOne({Username});
      if(patient == null){
         return res.status(404).json({message: 'Patient does not exist'});
      }
      const exists = await FamilyMember.findOne({NationalID});
      if(exists){
         return res.status(400).json({message: 'Family member already exists'});
      }
      patient.FamilyMembers.push(familyMember._id);
      FamilyMember.create(familyMember);
      const updatedPatient = await patient.save();
      res.status(200).json({message: 'Family member added successfully' , data: updatedPatient});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};

exports.viewFamilyMembers = async (req, res) => {
   const {Username} = req.query;
   const patient = await Patient.findOne({Username});
   if(patient == null){
      return res.status(404).json({message: 'Patient does not exist'});
   }
   try{
      const familyMembers = [];
      for(let i=0; i<patient.FamilyMembers.length; i++){
         const familyMember = await FamilyMember.findOne({_id: patient.FamilyMembers[i]});
         familyMembers.push(familyMember);
      }
      res.status(200).json({message: 'Family members fetched successfully' , data: familyMembers});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};
