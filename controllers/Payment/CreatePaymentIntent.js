const {
  validateAppointment,
  validateDoctor,
  validatePackage,
} = require("../../utils/validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { appointmentId, packageName, currency } = req.body;
  console.log("in the payment intent", req.body);

  let amount;
  if (appointmentId) {
    const appointment = await validateAppointment(appointmentId, res);
    const doctor = await validateDoctor(appointment.doctorUsername, res);
    amount = (appointment.endHour - appointment.startHour) * doctor.hourlyRate;
  } else {
    const package = await validatePackage(packageName, res);
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
};

module.exports = { createPaymentIntent };
