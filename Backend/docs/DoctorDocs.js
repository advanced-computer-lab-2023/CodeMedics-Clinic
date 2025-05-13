/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor management and operations
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of doctors
 *
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctor]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nationalIdFile:
 *                 type: string
 *                 format: binary
 *               medicalDegreeFile:
 *                 type: string
 *                 format: binary
 *               medicalLicenseFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Doctor created
 */

/**
 * @swagger
 * /doctors/{username}:
 *   get:
 *     summary: Get doctor by username
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor data
 *
 *   patch:
 *     summary: Update doctor info
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated doctor
 */

/**
 * @swagger
 * /doctors/{username}/password:
 *   patch:
 *     summary: Update doctor password
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */

/**
 * @swagger
 * /doctors/{username}/patients:
 *   get:
 *     summary: Get patients of a doctor
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of patients
 */

/**
 * @swagger
 * /doctors/{username}/appointments:
 *   get:
 *     summary: Get doctor's appointments
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of appointments
 *
 *   post:
 *     summary: Add a new appointment
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Appointment created
 */

/**
 * @swagger
 * /doctors/{username}/appointments/{appointmentId}:
 *   patch:
 *     summary: Update an appointment
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Appointment updated
 */

/**
 * @swagger
 * /doctors/{username}/appointments/{appointmentId}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */

/**
 * @swagger
 * /doctors/{username}/appointments/{appointmentId}/complete:
 *   patch:
 *     summary: Mark appointment as complete
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment marked as complete
 */

/**
 * @swagger
 * /doctors/{username}/appointments/{appointmentId}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 */

/**
 * @swagger
 * /doctors/{username}/prescriptions:
 *   get:
 *     summary: Get doctor's prescriptions
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of prescriptions
 *
 *   post:
 *     summary: Add a new prescription
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Prescription created
 */

/**
 * @swagger
 * /doctors/{username}/prescriptions/{prescriptionId}/drugs:
 *   post:
 *     summary: Add a medicine to a prescription
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Medicine added
 */

/**
 * @swagger
 * /doctors/{username}/prescriptions/{prescriptionId}/drugs/{drugName}:
 *   delete:
 *     summary: Remove a medicine from a prescription
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: drugName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine removed
 */

/**
 * @swagger
 * /doctors/{username}/prescriptions/{prescriptionId}:
 *   patch:
 *     summary: Update a prescription
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prescription updated
 */

/**
 * @swagger
 * /doctors/{username}/prescriptions/{prescriptionId}/download:
 *   post:
 *     summary: Download a prescription
 *     tags: [Doctor]
 *     responses:
 *       201:
 *         description: Prescription downloaded
 */

/**
 * @swagger
 * /doctors/{username}/patients/{patientUsername}/health-records:
 *   get:
 *     summary: Get patient's health records
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of health records
 *
 *   post:
 *     summary: Add a new health record
 *     tags: [Doctor]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Health record added
 */

/**
 * @swagger
 * /doctors/{username}/chats:
 *   get:
 *     summary: Get doctor's chats
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of chats
 */

/**
 * @swagger
 * /doctors/{username}/chats/{chatId}/messages:
 *   get:
 *     summary: Get messages in a chat
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of messages
 *
 *   post:
 *     summary: Send a message in a chat
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */

/**
 * @swagger
 * /doctors/{username}/notifications:
 *   get:
 *     summary: Get doctor's notifications
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of notifications
 */
