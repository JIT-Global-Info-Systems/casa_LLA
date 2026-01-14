const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    zone: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: true }
);

const regionSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      trim: true
    },
    zones: [zoneSchema]
  },
  { _id: true }
);

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  regions: [regionSchema],
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
  updated_at: {
    type: Date
  }
});

module.exports = mongoose.model("Location", locationSchema);
