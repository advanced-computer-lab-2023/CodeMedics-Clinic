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
// Rate Limiting
// ==========================
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many login attempts from this IP, please try again later.",
});

// ==========================
// Routes
// ==========================
router.post("/login", loginRateLimiter, LoginController.login);
router.post("/logout", LoginController.logout);
router.post("/resetPassword", resetPassword);
router.post("/payment/payment-intent", createPaymentIntent);

module.exports = router;
