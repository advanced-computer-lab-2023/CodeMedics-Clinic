const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription');
const patientSchema = require('../../models/Patient'); // Adjust the path according to your project structure
const { getUsername } = require('../../config/infoGetter');
const PDFDocument = require('pdfkit');
const fs = require('fs');


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
        res.status(400).json({ error: 'Invalid input. Provide at least a year.' });
        return;
      }

      const startDatePart = startDate.toISOString().split('T')[0];
      const endDatePart = endDate.toISOString().split('T')[0];

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
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all prescriptions for a patient
exports.getPrescriptions = async (req, res) => {
  try {
    const Username = await getUsername(req, res);
    
    const prescriptions = await Prescription.find({ 
      Patient: Username 
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// add prescription
exports.addPrescription = async (req, res) => {
  try {
    const { Drugs, Patient, Doctor, Date } = req.body;

    // Create a new prescription
    const prescription = new Prescription({
      Patient,
      Doctor,
      Date,
      Drug: Drugs,
      filled: false,
    });

    // Save the prescription
    const savedPrescription = await prescription.save();

    // Find the patient and update their Prescriptions array
    const patient = await patientSchema.findOne({ Username: Patient });
    if (patient) {
      patient.Prescriptions.push(savedPrescription); // Push the new prescription to the patient's Prescriptions array
      await patient.save(); // Save the updated patient record
    }

    res.status(200).json({ message: 'Prescription added successfully' });
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePrescriptionsByUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the patient by their username
    const patient = await patientSchema.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get the patient's prescriptions
    const prescriptions = patient.Prescriptions;

    // Remove prescriptions from the Prescription collection
    await Prescription.deleteMany({ _id: { $in: prescriptions } });

    // Clear the prescriptions from the patient's record
    patient.Prescriptions = [];

    // Save the updated patient record
    await patient.save();

    return res.status(200).json({ message: 'Prescriptions deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.createAndDownloadPDF = (prescription) => {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();

      // Load the regular font
      doc.font('./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf'); 
      
      doc.fontSize(30).fillColor('black').text(`Dr. ${prescription.Doctor}`).moveDown(1.0);
      
      doc.fontSize(16).fillColor('black').text(`Tessen Street, New Cairo,                                    Clinic Hours:`).moveDown(0.5);
      doc.fontSize(16).fillColor('black').text(`Cairo, 11835                                                            MWF: 8:00 - 15:00`).moveDown(1.0);
      
      // Draw a horizontal line
      doc.moveTo(50, doc.y) // Starting point of the line
      .lineTo(doc.page.width - 50, doc.y) // Ending point of the line
      .stroke(); // Draw the line
      
      //add logo
      const logoPath = './Frontend/el7a2ny-frontend/public/assets/logo.png';
      doc.image(logoPath, 450, -45, { width: 120 }); // Adjust x, y position and width as needed
      
      
      // Add prescription details
      doc.fontSize(16).fillColor('black').text().moveDown(1.0);
      doc.fontSize(16).fillColor('black').text(`Patient: ${prescription.Patient}`).moveDown(0.75);
      doc.fontSize(16).fillColor('black').text(`Status: ${prescription.filled ? 'filled' : 'unfilled'}`);
      doc.moveDown(1.5);
      
      
      // Load the Drug font
      doc.font('./Frontend/el7a2ny-frontend/public/assets/Whisper-Regular.ttf'); 
      
      prescription.Drug.forEach((drug, index) => {
        doc.fontSize(20).fillColor('black').text(`Drug ${index + 1}:`, { underline: true }).moveDown(0.5);
        doc.fontSize(20).fillColor('black').text(`Name:`, { continued: true }).fillColor('#5D3FD3').fontSize(24).text(`  ${drug.drugName}`).moveDown(0.25);
        doc.fontSize(20).fillColor('black').text(`Dosage:`, { continued: true }).fillColor('#5D3FD3').fontSize(24).text(`  ${drug.dosage}`).moveDown(0.25);
        doc.moveDown(1);
      });
      
     
      // Load the regular font
      doc.font('./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf'); 
      
      doc.fontSize(16).fillColor('black').text(`Date: ${prescription.Date}`, 410, 700 ).moveDown(0.5);
      
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};



// exports.getPrescriptionsByDate = async (req, res) => {
//   try {
//     const { userName, year, month, day } = req.body;

//     let startDate, endDate;
//     console.log(year);
//     console.log(month);
//     console.log(day);

//     if (year && month && day) {
//       // If year, month, and day are provided, search for prescriptions on that specific day.
//       startDate = new Date(year, month - 1, day + 1);
//       endDate = new Date(year, month - 1, day + 2);
//     } else if (year && month) {
//       // If year and month are provided, search for prescriptions in that month.
//       startDate = new Date(year, month - 1, 1);
//       endDate = new Date(year, month, 1);
//     } else if (year) {
//       // If only year is provided, search for prescriptions in that year.
//       startDate = new Date(year, 0, 1);
//       endDate = new Date(year + 1, 0, 1);
//     } else {
//       res.status(400).json({ error: 'Invalid input. Provide at least a year.' });
//       return;
//     }

//     console.log(startDate);

//     const startDatePart = startDate.toISOString().split('T')[0];
//     const endDatePart = endDate.toISOString().split('T')[0];
//     console.log(startDatePart);
//     console.log(endDatePart);

//     const prescriptions = await Prescription.find({
//       Patient: userName,
//       Date: { $gte: startDatePart, $lt: endDatePart },
//     });

//     res.status(200).json(prescriptions);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };





// // Filter prescriptions by doctor
// exports.getPrescriptionsByDoctor = async (req, res) => {
//   try {
//     const { userName, doctor } = req.body;

//     const prescriptions = await Prescription.find({ 
//       Patient: userName, 
//       Doctor: doctor 
//     });

//     res.status(200).json(prescriptions);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Filter prescriptions by filled status (true or false)
// exports.getPrescriptionsByStatus = async (req, res) => {
//   try {
//     const { userName ,filledStatus } = req.body;
    
//     const prescriptions = await Prescription.find({ 
//       Patient: userName, 
//       filled: filledStatus 
//     });

//     res.status(200).json(prescriptions);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };


