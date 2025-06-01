const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// ==========================
// Controllers
// ==========================
const LoginController = require("../functions/Login.js");
const { resetPassword } = require("../functions/ResetPassword.js");
const {
  createPaymentIntent,
} = require("../functions/CreatePaymentIntent.js");

// ==========================
// Rate Limiter
// ==========================
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// ==========================
// Routes
// ==========================
router.post("/login", LoginController.login);
router.post("/logout", LoginController.logout);
router.post("/resetPassword", resetPasswordLimiter, resetPassword);
router.post("/payment/payment-intent", createPaymentIntent);

module.exports = router;
