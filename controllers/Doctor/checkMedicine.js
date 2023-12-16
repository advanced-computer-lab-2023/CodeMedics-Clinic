const Medicine = require('../../models/Medicine');

exports.checkMedicine = async (req, res) => {
  try {
    const { medicineName } = req.body;
    console.log('Received request to check medicine:', medicineName);
    const medicine = await Medicine.findOne({ name: medicineName });

    if (!medicine) {
      return res.status(404).json({
        exists: false,
        message: `Medicine ${medicineName} not found in the Pharmacy.`,
      });
    }
    if (medicine.archived) {
      return res.status(404).json({
        exists: false,
        message: `Medicine ${medicineName} is not available.`,
      });
    }
    if (medicine.availableQuantity === 0) {
      return res.status(404).json({
        exists: false,
        message: `Medicine ${medicineName} is out of stock.`,
      });
    }

    return res.status(200).json({
      exists: true,
      message: `Medicine ${medicineName} found in the Pharmacy.`,
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      exists: false,
      message: `Internal server error for medicine ${medicineName}`,
      error: error.message,
    });
  }
};
