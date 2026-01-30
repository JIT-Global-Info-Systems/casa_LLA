const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  callDate: {
    type: Date,
    required: false
  },
  callTime: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.models.Call || mongoose.model('Call', callSchema);
