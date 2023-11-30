const Patient = require('../../models/Patient');
const FamilyMember = require('../../models/FamilyMember');
const {getUsername} = require('../../config/infoGetter');

exports.addFamilyMember = async (req, res) => {
   const Username = await getUsername(req, res);
   const {familyMemberEmail, relation} = req.body;
   try{
      const patient = await Patient.findOne({Username});
      if(patient == null){
         return res.status(404).json({message: 'Patient does not exist'});
      }
      const exists = await Patient.findOne({Email: familyMemberEmail}) || await Patient.findOne({Number: familyMemberEmail});
      if(exists == null){  
         return res.status(400).json({message: 'Family member does not exist'});
      }
      if(exists._id.toString() == patient._id.toString()){
         return res.status(400).json({message: 'You cannot add yourself as a family member'});
      }
      if(exists.Linked != undefined){
         return res.status(400).json({message: 'Family member already linked to another account'});
      }
      if(patient.FamilyMembers.some(el => el.id.toString() == exists._id.toString())){
         return res.status(400).json({message: 'Family member already added'});
      }
      patient.FamilyMembers.push({id:exists._id, relation:relation});
      exists.Linked = patient._id;
      await patient.save();
      await exists.save();
      res.status(200).json({message: 'Family member added successfully'});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};

exports.addFamilyMemberNoAccount = async (req, res) => {
   const Username = await getUsername(req, res);
   const {Name, NationalId, Gender, DateOfBirth, Relationship} = req.body;

   try{
      const familyMember = new FamilyMember({Name, NationalID: NationalId, Gender, DateOfBirth, Relationship});
      const savedFamilyMember = await familyMember.save();
      const me = await Patient.findOne({Username});
      me.FamilyMembersNoAccount.push(savedFamilyMember._id);
      await me.save();
      return res.status(200).json({message: 'Family member added successfully'});
   }
   catch(e){
      return res.status(400).json({message: e.message});
   };
};

exports.removeFamilyMemberNoAccount = async (req, res) => {
   const Username = await getUsername(req, res);
   const {familyMemberId} = req.body;
   try{
      const me = await Patient.findOne({Username});
      me.FamilyMembersNoAccount = me.FamilyMembersNoAccount.filter(member => member.toString() != familyMemberId);
      await me.save();
      return res.status(200).json({message: 'Family member removed successfully'});
   }
   catch(e){
      return res.status(400).json({message: e.message});
   };
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
         const familyMember = await Patient.findOne({_id: patient.FamilyMembers[i].id});
         familyMembers.push({familyMember: familyMember, relation: patient.FamilyMembers[i].relation});
      }

      const familyMembersNoAccount = [];
      for(let i=0; i<patient.FamilyMembersNoAccount.length; i++){
         const familyMemberNoAccount = await FamilyMember.findOne({_id: patient.FamilyMembersNoAccount[i]});
         familyMembersNoAccount.push(familyMemberNoAccount);
      }
      res.status(200).json({message: 'Family members fetched successfully' , familyMembers, familyMembersNoAccount});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};

exports.removeFamilyMember = async (req, res) => {
   const Username = await getUsername(req, res);
   const patient = await Patient.findOne({Username});
   if(patient == null){
      return res.status(404).json({message: 'Patient does not exist'});
   }
   try{
      const {familyMemberId} = req.body;
      if(!patient.FamilyMembers.some(el => el.id.toString() == familyMemberId)){
         return res.status(400).json({message: 'Family member does not exist'});
      }

      patient.FamilyMembers = patient.FamilyMembers.filter(member => member.id.toString() != familyMemberId);

      await patient.save();

      res.status(200).json({message: 'Family members fetched successfully'});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};
