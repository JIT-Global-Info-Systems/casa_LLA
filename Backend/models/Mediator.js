const mongoose = require("mongoose");

const leadCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const LeadCounter = mongoose.models.LeadCounter || mongoose.model('LeadCounter', leadCounterSchema);

const mediatorSchema = new mongoose.Schema({
  mediator_id: {
    type: Number,
    unique: true
  },

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

  created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    updated_at: {
      type: Date
    },
    
  created_at: {
    type: Date,
    default: Date.now
  }
});

mediatorSchema.pre('save', async function() {
  if (this.isNew) {
    try {
      const counter = await LeadCounter.findOneAndUpdate(
        { _id: 'mediator_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.mediator_id = counter.seq;
    } catch (error) {
      // If there's an error, we'll just log it and continue
      // The save will fail if lead_id is required but not set
      console.error('Error incrementing mediator counter:', error);
    }
  }
});

const Mediator = mongoose.model("Mediator", mediatorSchema);
module.exports = Mediator;
