const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  leadType: {
    type: String,
    default: "mediator"
  },

  contactNumber: {
    type: String,
    required: true
  },

  mediatorName: {
    type: String
  },

  mediatorId: {
    type: String
  },

  date: {
    type: Date,
    required: true
  },

  location: {
    type: String
  },

  landName: {
    type: String
  },

  sourceCategory: {
    type: String
  },

  source: {
    type: String
  },

  zone: {
    type: String
  },

  extent: {
    type: String
  },

  unit: {
    type: String,
    default: "Acre"
  },

  propertyType: {
    type: String
  },

  fsi: {
    type: String
  },

  asp: {
    type: String
  },

  revenue: {
    type: String
  },

  transactionType: {
    type: String,
    default: "JV"
  },

  rate: {
    type: String
  },

  builderShare: {
    type: String
  },

  refundable: {
    type: String
  },

  nonRefundable: {
    type: String
  },

  landmark: {
    type: String
  },

  frontage: {
    type: String
  },

  roadWidth: {
    type: String
  },

  sspde: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  remark: {
    type: String
  },
  
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  lead_status: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", leadSchema);
