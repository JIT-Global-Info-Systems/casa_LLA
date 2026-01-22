const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Authentication routes
router.post("/login", authController.login);

// Password reset flow
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

// Protected routes (require authentication)
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;