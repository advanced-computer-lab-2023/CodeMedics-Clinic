/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient-related operations
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Create a new patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created
 */

/**
 * @swagger
 * /patients/{username}:
 *   get:
 *     summary: Get a specific patient
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient username
 *     responses:
 *       200:
 *         description: A patient object
 *   patch:
 *     summary: Update a patient's information
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated patient object
 */

/**
 * @swagger
 * /patients/{username}/password:
 *   patch:
 *     summary: Update a patient's password
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient username
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
 * /patients/{username}/appointments:
 *   get:
 *     summary: Get a patient's appointments
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient username
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by appointment status
 *     responses:
 *       200:
 *         description: List of appointments
 *   post:
 *     summary: Pay for an appointment
 *     tags: [Patient]
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
 *             properties:
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful
 */

/**
 * @swagger
 * /patients/{username}/appointments/{appointmentId}/cancel:
 *   patch:
 *     summary: Cancel a patient appointment
 *     tags: [Patient]
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
 * /patients/{username}/appointments/{appointmentId}:
 *   patch:
 *     summary: Update a patient appointment
 *     tags: [Patient]
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
 *         description: Updated appointment
 */

/**
 * @swagger
 * /patients/{username}/health-packages:
 *   get:
 *     summary: Get available health packages for a patient
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of health packages
 *   post:
 *     summary: Pay for a health package
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: packageName
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
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health package purchased
 */

/**
 * @swagger
 * /patients/{username}/health-packages/subscription:
 *   delete:
 *     summary: Unsubscribe from health package
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Unsubscribed
 */

/**
 * @swagger
 * /patients/{username}/family-members:
 *   get:
 *     summary: Get family members with and without accounts
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Family members grouped
 *   post:
 *     summary: Add a family member with an account
 *     tags: [Patient]
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
 *         description: Family member added
 */

/**
 * @swagger
 * /patients/{username}/family-members-no-account:
 *   get:
 *     summary: Get family members without accounts
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of family members without accounts
 *   post:
 *     summary: Add a family member without an account
 *     tags: [Patient]
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
 *         description: Family member added
 */

/**
 * @swagger
 * /patients/{username}/family-members/{familyMemberUsername}:
 *   delete:
 *     summary: Remove a family member with an account
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyMemberUsername
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Family member removed
 */

/**
 * @swagger
 * /patients/{username}/family-members-no-account/{familyMemberId}:
 *   delete:
 *     summary: Remove a family member without an account
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyMemberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Family member removed
 */

/**
 * @swagger
 * /patients/{username}/health-records:
 *   get:
 *     summary: Get patient health records
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of health records
 *   post:
 *     summary: Upload a health record document
 *     tags: [Patient]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: document
 *         type: file
 *         required: true
 *     requestBody:
 *       required: true
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
 *         description: Document uploaded
 */

/**
 * @swagger
 * /patients/{username}/health-records/{documentId}:
 *   delete:
 *     summary: Delete a health record document
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Document deleted
 */

/**
 * @swagger
 * /patients/{username}/doctors:
 *   get:
 *     summary: Get doctors with patient's appointments
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors
 *   
 * /patients/{username}/doctors/{doctorUsername}:
 *   get:
 *     summary: Get doctor details
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor object
 *
 * /patients/{username}/doctors/{doctorUsername}/appointments:
 *   get:
 *     summary: Get doctor's appointments for patient
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorUsername
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of appointments
 */

/**
 * @swagger
 * /patients/{username}/prescriptions:
 *   get:
 *     summary: Get patient prescriptions
 *     tags: [Patient]
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
 *     summary: Download prescription PDF
 *     tags: [Patient]
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
 *               prescription:
 *                 type: object
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *
 * /patients/{username}/prescriptions/{prescriptionId}:
 *   patch:
 *     summary: Update a prescription
 *     tags: [Patient]
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
 *         description: Prescription updated
 */

/**
 * @swagger
 * /patients/{username}/notifications:
 *   get:
 *     summary: Get patient notifications
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 */

/**
 * @swagger
 * /patients/{username}/chats:
 *   get:
 *     summary: Get patient chats
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chats
 */