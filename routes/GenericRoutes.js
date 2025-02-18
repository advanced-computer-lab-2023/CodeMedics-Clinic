const express = require("express");
const router = express.Router();
const Login = require("../controllers/Login.js");
const { resetPassword } = require("../controllers/ResetPassword.js");
const { getMe } = require("../controllers/GetMe.js");
const Appointment = require("../models/Appointment.js");
const Doctor = require("../models/Doctor.js");
const Package = require("../models/Package.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/getMe", getMe);

router.post("/login", (req, res) => {
  Login.login(req, res).then();
});

router.post("/logout", (req, res) => {
  Login.logout(req, res).then();
});

router.post("/resetPassword", resetPassword);

router.post("/payment/payment-intent", async (req, res) => {
  const { card, appointmentId, packageName, currency } = req.body;
  console.log("in the payment intent", req.body);

  let amount;
  if (appointmentId) {
    const appointment = await Appointment.findOne({ _id: appointmentId });
    const doctor = await Doctor.findOne({
      username: appointment.doctorUsername,
    });
    amount = (appointment.endHour - appointment.startHour) * doctor.hourlyRate;
  } else {
    const package = await Package.findOne({ name: packageName });
    console.log("package", package);
    amount = package.price;
  }

  console.log("amount", amount);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.status(200).json({ data: paymentIntent.client_secret });
});

module.exports = router;
