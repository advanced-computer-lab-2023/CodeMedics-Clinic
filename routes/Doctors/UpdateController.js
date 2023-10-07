const Doctor = require('../../models/Doctor');

exports.updateDoctor = async (req, res) => {
   const user = res.locals.token;
   if(user.type != 'Doctor')
            return res.status(401).json({message: 'Unauthorized'});
   const {id} = user;
   const { Email, HourlyRate, Affiliation } = req.body;
   const doctor = await Doctor.findById(id);
   if(doctor == null){
      return res.status(404).json({message: 'Doctor not found'});
   }
   if(Email != null){  // check if the email already exists
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
