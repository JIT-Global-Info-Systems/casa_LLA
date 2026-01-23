const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  created_by: String,
  created_at: { type: Date, default: Date.now },

  updated_by: String,
  updated_at: Date
});

// One active type per user (logical constraint)
TypeSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Type", TypeSchema);
