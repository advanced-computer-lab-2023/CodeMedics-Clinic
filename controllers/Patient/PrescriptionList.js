const express = require("express");
const router = express.Router();
const Prescription = require("../../models/Prescription");
const patientSchema = require("../../models/Patient"); // Adjust the path according to your project structure
const PDFDocument = require("pdfkit");
const Patient = require("../../models/Patient");
const Medicine = require("../../models/Medicine");
const fs = require("fs");
const Cart = require("../../models/Cart");

exports.filterPrescriptions = async (req, res) => {
  try {
    const { userName, year, month, day, doctor, filledStatus } = req.query;

    let query = { Patient: userName };

    if (year || month || day) {
      if (year && month && day) {
        // If year, month, and day are provided, search for prescriptions on that specific day.
        startDate = new Date(year, month - 1, day + 1);
        endDate = new Date(year, month - 1, day + 2);
      } else if (year && month) {
        // If year and month are provided, search for prescriptions in that month.
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 1);
      } else if (year) {
        // If only year is provided, search for prescriptions in that year.
        startDate = new Date(year, 0, 1);
        endDate = new Date(year + 1, 0, 1);
      } else {
        res
          .status(400)
          .json({ message: "Invalid input. Provide at least a year." });
        return;
      }

      const startDatePart = startDate.toISOString().split("T")[0];
      const endDatePart = endDate.toISOString().split("T")[0];

      query.Date = { $gte: startDatePart, $lt: endDatePart };
    }

    if (doctor) {
      // Add doctor filter
      query.Doctor = doctor;
    }

    if (filledStatus !== undefined) {
      // Add filled status filter
      query.filled = filledStatus;
    }

    const prescriptions = await Prescription.find(query);

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const { patientUsername } = req.params;

    const prescriptions = await Prescription.find({
      patientUsername,
    });

    res.status(200).json({ data: prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadPrescription = async (req, res) => {
  try {
    const prescription = req.body.prescription;
    const pdfBuffer = await this.createAndDownloadPDF(prescription);

    // Send the PDF buffer as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Prescription_${prescription._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

exports.getPrescriptions1 = async (req, res) => {
  try {
    const username = req.query.username;

    // Use patientUsername to find prescriptions for this patient
    const prescriptions = await Prescription.find({
      Patient: username,
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addPrescription = async (req, res) => {
  try {
    const { drugs, patientUsername, doctorUsername, date } = req.body;

    const prescription = new Prescription({
      patientUsername,
      doctorUsername,
      date,
      drug: drugs,
      filled: false,
    });

    await prescription.save();

    res.status(204).json({ message: "Prescription added successfully" });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(400).json({ message: e.message });
  }
};

exports.deletePrescriptionsByUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the patient by their username
    const patient = await patientSchema.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get the patient's prescriptions
    const prescriptions = patient.Prescriptions;

    // Remove prescriptions from the Prescription collection
    await Prescription.deleteMany({ _id: { $in: prescriptions } });

    // Clear the prescriptions from the patient's record
    patient.Prescriptions = [];

    // Save the updated patient record
    await patient.save();

    return res
      .status(200)
      .json({ message: "Prescriptions deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
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

exports.fillPrescription = async (req, res) => {
  try {
    const { patientUsername, prescriptionId } = req.params;
    const patient = await Patient.findOne({ username: patientUsername });
    var cart = patient.Cart;
    if (!cart) {
      cart = new Cart();
      cart.PatientId = patient._id;
      cart.items = [];
      patient.Cart = cart;
      await patient.save();
    }
    const items = patient.Cart.items;
    if (!items) {
      items = [];
    }
    const prescription = await Prescription.findOne({ _id: prescriptionId });
    const meds = prescription.drug;
    for (let i = 0; i < meds.length; i++) {
      const drug = meds[i].drugName;
      var dosage = meds[i].dosage;
      const fetchDrug = await Medicine.findOne({ name: drug });
      dosage = Math.min(dosage, fetchDrug.availableQuantity);
      if (dosage > 0) {
        const price = dosage * fetchDrug.price;
        items.push({
          medicineId: fetchDrug._id,
          quantity: dosage,
          price: price,
        });
      }
    }
    prescription.filled = true;
    patient.Cart.items = items;
    await prescription.save();
    await patient.save();
    return res
      .status(204)
      .json({ message: "Prescription Filled Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Problem Occured While Filling Prescription" });
  }
};
