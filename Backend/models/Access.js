const mongoose = require("mongoose");

const AccessSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  page_names: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model("Access", AccessSchema);
