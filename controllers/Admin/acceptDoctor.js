
const Doctor = require('../../models/Doctor'); 

const viewDoctorApplications = async (req, res) => {
    const { Username } = req.body;
    const doctor = await Doctor.findOne({ Username: Username });
    doctor.Status = "Contract";
    await doctor.save();
    return res.status(200).json({message: 'Sent Doctor Contract'});
};

const createAndDownloadContract = (doctor) => {
  return new Promise((resolve, reject) => {
      try {
          const PDFDocument = require('pdfkit');
          const doc = new PDFDocument();

          // Load the regular font
          doc.font('./Frontend/el7a2ny-frontend/public/assets/Rubik-Light.ttf');

          //add logo
          const logoPath = './Frontend/el7a2ny-frontend/public/assets/logo.png';
          doc.image(logoPath, 450, -45, { width: 120 }).moveDown(3.5); // Adjust x, y position and width as needed

          doc.fontSize(30).fillColor('purple').text(`CodeMedics Clinic`).fillColor('black').text(`Independent Contractor Agreement`).moveDown(1.0);

          // Draw a horizontal line
          doc.moveTo(50, doc.y) // Starting point of the line
              .lineTo(doc.page.width - 50, doc.y) // Ending point of the line
              .stroke(); // Draw the line

          // Add space after the line
          doc.moveDown(1.0);

          doc.fontSize(18).fillColor('black').text(`Dr. ${doctor.FirstName} ${doctor.LastName},`).moveDown(1.0);

          doc.fontSize(17).fillColor('black').text(`Through this agreement, You acknowledge and agree to provide services through CodeMedics Clinic, adhering to terms outlined by the platform.`).moveDown(1.0);

          doc.fontSize(17).fillColor('black').text(`You will accurately report hours worked on the platform and maintain records for compensation purposes. The compensation for services shall be based on an hourly rate of:`).moveDown(1.0);

          doc.fontSize(17).fillColor('green').fontSize(24).text(`${doctor.HourlyRate} EGP`).moveDown(0.75);

          doc.fontSize(17).fillColor('black').text(`The Hourly Rate is subject to periodic review and adjustment by mutual agreement between the doctor and CodeMedics Clinic.`).moveDown(1.75);

          doc.fontSize(14).fillColor('black').text(`Chief Medical Officer`).moveDown(0.25);

          // Load the Signature font
          doc.font('./Frontend/el7a2ny-frontend/public/assets/Whisper-Regular.ttf'); 

          doc.fontSize(22).fillColor('purple').text(`Omar  Osama`).moveDown(0.5);

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


  module.exports = {
    viewDoctorApplications,
    createAndDownloadContract,
  };