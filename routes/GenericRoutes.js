const express = require("express");
const router = express.Router();

// ==========================
// Controllers
// ==========================
const LoginController = require("../functions/Login.js");
const { resetPassword } = require("../functions/ResetPassword.js");
const {
  createPaymentIntent,
} = require("../functions/CreatePaymentIntent.js");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Payment
 *     description: Payment processing endpoints
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", LoginController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", LoginController.logout);

/**
 * @swagger
 * /resetPassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid request
 */
router.post("/resetPassword", resetPassword);

/**
 * @swagger
 * /payment/payment-intent:
 *   post:
 *     summary: Create a Stripe payment intent
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment intent created
 *       400:
 *         description: Error creating payment intent
 */
router.post("/payment/payment-intent", createPaymentIntent);

module.exports = router;
