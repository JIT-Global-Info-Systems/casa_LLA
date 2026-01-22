const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  phone_number: {
    type: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  resetPasswordOtp: {
    type: String,
    select: false
  },
  
  resetPasswordOtpExpires: {
    type: Date,
    select: false
  },
  
  resetPasswordToken: {
    type: String,
    select: false
  },
  
  resetPasswordExpires: {
    type: Date,
    select: false
  },

  updated_at: {
    type: Date
  }

});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;