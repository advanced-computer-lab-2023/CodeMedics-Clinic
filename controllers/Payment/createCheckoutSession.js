const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Package = require('../../models/Appointment');
const stripe = require("stripe")(process.env.SECRET_KEY);


const createCheckoutSession = async(req, res) =>{
    const items = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        success_url: 'http://localhost:'+process.env.PORT+'/success',
        cancel_url: 'http://localhost:'+process.env.PORT+'/cancel',
    }).catch(err => console.log(err));

    res.redirect(303, session.url);
}

module.exports = {createCheckoutSession};
