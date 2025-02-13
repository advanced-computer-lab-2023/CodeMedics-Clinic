const stripe = require("stripe")(process.env.SECRET_KEY);
const { validatePatient, validatePackage } = require("../../utils/validator");

const payPackageWithWallet = async (patientUsername, packageName, res) => {
  try {
    const price = getPackagePrice(packageName);
    const patient = await validatePatient(patientUsername, res);
    if (patient.wallet < price) {
      return res.status(402).json({ message: "Insufficient funds" });
    }
    patient.wallet -= price;
    await patient.save();

    res.status(204).json({ message: "Payment Succeeded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getDiscountAmountForHealthPackage(packageName) {
  if (packageName == "Free") {
    return 0;
  } else if (packageName == "Silver") {
    return 0.1;
  } else if (packageName == "Gold") {
    return 0.15;
  } else if (packageName == "Platinum") {
    return 0.2;
  } else {
    console.error("Invalid package");
  }
}

const payHealthPackage = async (req, res) => {
  const { patientUsername, packageName } = req.params;
  const { paymentMethod } = req.body;
  const discount = getDiscountAmountForHealthPackage(packageName);
  const package = validatePackage(packageName, res);
  const amount = package.price * (1 - discount);
  if (paymentMethod == "Wallet") {
    payPackageWithWallet(patientUsername, packageName, res);
  } else if (paymentMethod == "Card") {
    const paymentIntent = await stripe.paymentIntents
      .create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      })
      .catch((err) => console.log(err));
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(400).json({ message: "Invalid payment method" });
  }
};

module.exports = { payHealthPackage };
