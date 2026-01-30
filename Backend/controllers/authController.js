const bcrypt = require("bcrypt");
const User = require("../models/User");
const Access = require("../models/Access");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");
const { sendPasswordResetOtp } = require("../utils/mail");
const crypto = require('crypto');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password"
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password"
      });
    }

    // 3️⃣ Check status
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact support."
      });
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password"
      });
    }

    // 5️⃣ Get access details for the user's role
    const accessDetails = await Access.findOne({ role: user.role });
    
    // 6️⃣ Check if it's first login
    const isFirstLogin = user.firstLogin;

    // 7️⃣ Generate JWT
    const token = generateToken(user);

    // 8️⃣ Send response
    res.status(200).json({
      message: "Welcome back",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        firstLogin: isFirstLogin
      },
      access: accessDetails ? accessDetails.access : []
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Could not sign in. Please try again.",
      error: error.message
    });
  }
};

// Generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    // For security reasons, don't reveal if email doesn't exist
    if (user) {
      // Generate OTP and set expiry (10 minutes from now)
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Save OTP and expiry to user
      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = otpExpiry;
      await user.save({ validateBeforeSave: false });
      
      // Send OTP to user's email
      await sendPasswordResetOtp(user.email, user.name, otp);
    }
    
    // Always return success to prevent email enumeration
    res.status(200).json({
      success: true,
      message: "If this email is registered, you will receive a verification code shortly"
    });
    
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not process your request. Please try again."
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and verification code"
      });
    }

    // Find user by email and check OTP
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification code is incorrect or has expired"
      });
    }

    // Generate a one-time token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token and save to user
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiry (1 hour from now)
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    
    // Clear the OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Verification successful",
      resetToken
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not verify code. Please try again."
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your new password"
      });
    }

    // Hash the token to find the user
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by reset token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one."
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not reset password. Please try again.",
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.user_id; // Changed from req.user._id to req.user.user_id

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter both your current and new password"
      });
    }

    // Find user by ID
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and set firstLogin to false
    user.password = hashedPassword;
    user.firstLogin = false;
    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not change password. Please try again.",
      error: error.message
    });
  }
};