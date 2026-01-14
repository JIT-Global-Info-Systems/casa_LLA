const mongoose = require("mongoose");

const mediatorSchema = new mongoose.Schema({
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

  phone_primary: {
    type: String,
    required: true
  },

  phone_secondary: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  pan_number: {
    type: String,
    required: true
  },

  aadhar_number: {
    type: String,
    required: true
  },

  pan_upload: {
    type: String,
    required: true
  },

  aadhar_upload: {
    type: String,
    required: true
  },

  location: {
    type: String
  },

  linked_executive: {
    type: String
  },

  mediator_type: {
    type: String,
    // enum: ["office", "individual"],
    required: true
  },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Mediator", mediatorSchema);
