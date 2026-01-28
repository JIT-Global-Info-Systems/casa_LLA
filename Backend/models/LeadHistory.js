const mongoose = require('mongoose');

const leadHistorySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  currentRole: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.LeadHistory || mongoose.model('LeadHistory', leadHistorySchema);
