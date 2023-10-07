const Patient = require('../../models/Patient');
const FamilyMember = require('../../models/FamilyMember');

exports.addFamilyMember = async (req, res) => {
   const user = res.locals.user;
   if(user.type != 'Patient'){
      return res.status(401).json({message: 'Unauthorized'});
   }
   const {id} = user;
   const familyMember = FamilyMember.create(req.body);
   const patient = await Patient.findById(id);
   try{
      patient.FamilyMembers.push(familyMember._id);
      const updatedPatient = await patient.save();
      res.status(200).json({message: 'Family member added successfully' , data: updatedPatient});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};

exports.viewFamilyMembers = async (req, res) => {
   const user = res.locals.user;
   if(user.type != 'Patient'){
      return res.status(401).json({message: 'Unauthorized'});
   }
   const {id} = user;
   const patient = await Patient.findById(id);
   try{
      const familyMembers = await FamilyMember.find({_id: {$in: patient.FamilyMembers}});
      res.status(200).json({message: 'Family members fetched successfully' , data: familyMembers});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};
