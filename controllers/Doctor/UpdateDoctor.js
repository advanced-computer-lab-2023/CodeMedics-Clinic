const Doctor = require('../../models/Doctor');

exports.updateDoctor = async (req, res) => {
   const {Username, Email, HourlyRate, Affiliation } = req.body;
   const doctor = await Doctor.findOne({Username});
   if(doctor == null){
      return res.status(404).json({message: 'Doctor does not exist'});
   }
   if(Email != null){  // check if the email already exists
      const exists = await Doctor.findOne({Email});
      if(exists){
         return res.status(400).json({message: 'Email already exists'});
      }
      doctor.Email = Email;
   }
   if(HourlyRate != null){
      doctor.HourlyRate = HourlyRate;
   }
   if(Affiliation != null){
      doctor.Affiliation = Affiliation;
   }
   try{
      const updatedDoctor = await doctor.save();
      res.status(200).json({message: 'Doctor updated successfully' , data: updatedDoctor});
   }
   catch(e){
      res.status(400).json({message: e.message});
   }
};
