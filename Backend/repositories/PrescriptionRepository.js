const Prescription = require("../../models/Prescription");

exports.validatePrescription = async (prescriptionId) => {
  const prescription = await this.getPrescription(prescriptionId);
  if (!prescription) {
    const error = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }
  return prescription;
};

exports.getPrescription = async (prescriptionId) => {
  const prescription = await Prescription.findById(prescriptionId);
  return prescription;
};

exports.getPrescriptions = async (query = {}) => {
  const prescriptions = await Prescription.find(query);
  return prescriptions;
};

exports.addPrescription = async (prescriptionData) => {
  const prescription = new Prescription(prescriptionData);
  await prescription.save();
  return prescription;
};

exports.updatePrescription = async (prescriptionId, prescriptionData) => {
  const prescription = await Prescription.findByIdAndUpdate(
    prescriptionId,
    { $set: prescriptionData },
    {
      new: true,
    }
  );
  return prescription;
};

exports.addMedicineToPrescription = async (
  prescriptionId,
  drugName,
  dosage
) => {
  const prescription = await this.getPrescription(prescriptionId);
  const medicineData = { drugName, dosage };
  let found = false;
  for (const drug of prescription.drug) {
    if (drug.drugName == drugName) {
      drug.dosage = dosage;
      found = true;
      break;
    }
  }
  if (!found) prescription.drug.push(medicineData);
  await prescription.save();
  return prescription;
};

exports.removeMedicineFromPrescription = async (prescriptionId, drugName) => {
  const prescription = await this.getPrescription(prescriptionId);
  prescription.drug = prescription.drug.filter(
    (drug) => drug.drugName !== drugName
  );
  await prescription.save();
  return prescription;
};

exports.createAndDownloadPDF = (prescription) => {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument();
      console.log(prescription);
      // Load the regular font
      doc.font("./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf");

      doc
        .fontSize(30)
        .fillColor("black")
        .text(`Dr. ${prescription.doctorUsername}`)
        .moveDown(1.0);

      doc
        .fontSize(16)
        .fillColor("black")
        .text(
          `Tessen Street, New Cairo,                                    Clinic Hours:`
        )
        .moveDown(0.5);
      doc
        .fontSize(16)
        .fillColor("black")
        .text(
          `Cairo, 11835                                                            MWF: 8:00 - 15:00`
        )
        .moveDown(1.0);

      // Draw a horizontal line
      doc
        .moveTo(50, doc.y) // Starting point of the line
        .lineTo(doc.page.width - 50, doc.y) // Ending point of the line
        .stroke(); // Draw the line

      //add logo
      const logoPath = "./Frontend/el7a2ny-frontend/public/assets/logo.png";
      doc.image(logoPath, 450, -45, { width: 120 }); // Adjust x, y position and width as needed

      // Add prescription details
      doc.fontSize(16).fillColor("black").text().moveDown(1.0);
      doc
        .fontSize(16)
        .fillColor("black")
        .text(`Patient: ${prescription.patientUsername}`)
        .moveDown(0.75);
      doc
        .fontSize(16)
        .fillColor("black")
        .text(`Status: ${prescription.filled ? "filled" : "unfilled"}`);
      doc.moveDown(1.5);

      // Load the Drug font
      doc.font("./Frontend/el7a2ny-frontend/public/assets/Whisper-Regular.ttf");

      prescription.drug.forEach((drug, index) => {
        doc
          .fontSize(20)
          .fillColor("black")
          .text(`Drug ${index + 1}:`, { underline: true })
          .moveDown(0.5);
        doc
          .fontSize(20)
          .fillColor("black")
          .text(`Name:`, { continued: true })
          .fillColor("#5D3FD3")
          .fontSize(24)
          .text(`  ${drug.drugName}`)
          .moveDown(0.25);
        doc
          .fontSize(20)
          .fillColor("black")
          .text(`Dosage:`, { continued: true })
          .fillColor("#5D3FD3")
          .fontSize(24)
          .text(`  ${drug.dosage}`)
          .moveDown(0.25);
        doc.moveDown(1);
      });

      // Load the regular font
      doc.font("./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf");

      doc
        .fontSize(16)
        .fillColor("black")
        .text(`Date: ${prescription.date}`, 410, 700)
        .moveDown(0.5);

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
