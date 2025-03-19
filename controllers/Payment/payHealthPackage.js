const { validatePatient, validatePackage } = require("../../utils/validator");

const addPackage = async (patient, package) => {
  console.log(
    "pay health package",
    patient,
    patient.wallet,
    package
  );
  patient.healthPackage = package;
  await patient.save();
};

const payPackageWithWallet = async (patient, price, package, res) => {
  try {
    if (patient.wallet < price) {
      return res.status(402).json({ message: "Insufficient funds" });
    }
    patient.wallet -= price;

    addPackage(patient, package);

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
  const patient = await validatePatient(patientUsername, res);
  const package = await validatePackage(packageName, res);
  const price = package.price * (1 - discount);
  if (paymentMethod == "Wallet") {
    payPackageWithWallet(patient, price, package, res);
  } else if (paymentMethod == "Card") {
    addPackage(patient, package);
  } else {
    res.status(400).json({ message: "Invalid payment method" });
  }
};

module.exports = { payHealthPackage };
