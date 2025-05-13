/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and operations

 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of admins

 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Admin created successfully

 * /admins/{username}:
 *   get:
 *     summary: Get a specific admin by username
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     responses:
 *       200:
 *         description: Admin details

 *   patch:
 *     summary: Update admin details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     responses:
 *       200:
 *         description: Admin updated

 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     responses:
 *       204:
 *         description: Admin deleted

 * /admins/{username}/password:
 *   patch:
 *     summary: Update admin password
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     responses:
 *       200:
 *         description: Password updated

 * /admins/packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of packages

 *   post:
 *     summary: Create a new package
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Package created

 * /admins/packages/{packageName}:
 *   patch:
 *     summary: Update a package
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: packageName
 *         required: true
 *     responses:
 *       200:
 *         description: Package updated

 *   delete:
 *     summary: Delete a package
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: packageName
 *         required: true
 *     responses:
 *       204:
 *         description: Package deleted

 * /admins/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of doctors

 * /admins/doctors/applications:
 *   get:
 *     summary: Get doctor applications
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of applications

 * /admins/doctors/{doctorUsername}:
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *     responses:
 *       204:
 *         description: Doctor deleted

 * /admins/doctors/{doctorUsername}/accept:
 *   patch:
 *     summary: Accept a doctor application
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *     responses:
 *       200:
 *         description: Doctor accepted

 * /admins/doctors/{doctorUsername}/reject:
 *   patch:
 *     summary: Reject a doctor application
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *     responses:
 *       200:
 *         description: Doctor rejected

 * /admins/doctors/{doctorUsername}/applications:
 *   patch:
 *     summary: Update a doctor application
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *     responses:
 *       200:
 *         description: Application updated

 * /admins/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of patients

 * /admins/patients/{patientUsername}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: patientUsername
 *         required: true
 *     responses:
 *       204:
 *         description: Patient deleted

 * /admins/doctors/{doctorUsername}/download-contract:
 *   post:
 *     summary: Download a doctor's contract as PDF
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *     responses:
 *       200:
 *         description: PDF downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
