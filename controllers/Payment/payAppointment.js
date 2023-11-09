const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const stripe = require("stripe")(process.env.SECRET_KEY);


function getDiscountAmountForAppointments(package){
    if(package == "Free"){
        return 0;
    }
    else if(package == "Silver"){
        return 0.4;
    }
    else if(package == "Gold"){
        return 0.6;
    }
    else if(package == "Platinum"){
        return 0.8;
    }
    else{
        console.error("Invalid package");
    }
}

const payAppointment = async(req, res) =>{
    const {patientId, appointmentId, paymentMethod} = req.body;
    
    const patient = await Patient.findById(patientId);
    if(!patient){
        res.status.json({message : "Patient not found"});
    }

    const appointment = await Appointment.findById(appointmentId);
    if(!appointment){
        res.status.json({message : "Appointment not found"});
    }

    const doctor = await Doctor.findOne({Username: appointment.doctorUsername})
    console.log(patient, doctor, appointment, patient.HealthPackage, patient.HealthPackage.membership);
    const discount = getDiscountAmountForAppointments(patient.HealthPackage.membership);
    const duration = appointment.endHour - appointment.startHour;
    const amount = duration * doctor.HourlyRate * (1 - discount);

    if(paymentMethod == "Wallet"){
        if(patient.Wallet < amount){
            res.status(200).json({message : "Insufficient funds"});
        }
        else{
            console.log(patient.Wallet, patient.Wallet - 100, amount);
            patient.Wallet -= amount;
            await patient.save();
            appointment.status = "upcoming";
            console.log(patient.Wallet);
            await appointment.save();
            doctor.Wallet += amount;
            await doctor.save();
            res.status(200).json({message : "Appointment has been scheduled successfully"});
        }
    }
    else if(paymentMethod == "Card"){
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            automatic_payment_methods: {
                enabled: true
            }
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
          });
    }
    else{
        res.status(404).json({message : "Invalid payment method"});
    }
}

module.exports = {payAppointment};
