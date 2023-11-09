const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Package = require('../../models/Package');
const stripe = require("stripe")(process.env.SECRET_KEY);


function getDiscountAmountForHealthPackage(package){
    if(package == "Free"){
        return 0;
    }
    else if(package == "Silver"){
        return 0.1;
    }
    else if(package == "Gold"){
        return 0.15;
    }
    else if(package == "Platinum"){
        return 0.2;
    }
    else{
        console.error("Invalid package");
    }
}

const payHealthPackage = async(req, res) =>{
    const {patientId, packageName, paymentMethod} = req.body;
    
    const patient = await Patient.findById(patientId);
    if(!patient){
        res.status.json({message : "Patient not found"});
    }

    const discount = getDiscountAmountForHealthPackage(patient.HealthPackage.Name);
    const package = await Package.find({Name : packageName});
    const amount = package.Price * (1 - discount);

    if(paymentMethod == "Wallet"){
        if(patient.Wallet < amount){
            res.status.json({message : "Insufficient funds"});
        }
        else{
            patient.Wallet -= amount;
            patient.HealthPackage.Price = package.Price;
            await patient.save();
            res.status.json({message : "Health Pacakge has been purchased successfully"});
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
        res.status.json({message : "Invalid payment method"});
    }
}

module.exports = {payHealthPackage};
