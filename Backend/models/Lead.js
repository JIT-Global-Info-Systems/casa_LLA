import mongoose from "mongoose";

const leadCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const LeadCounter = mongoose.models.LeadCounter || mongoose.model('LeadCounter', leadCounterSchema);

const leadSchema = new mongoose.Schema({
  lead_id: {
    type: Number,
    unique: true
  },
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

  area: {
    type: String
  },

  yield: {
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
  
  currentRole: {
    type: String,
    default: 'user' // Default role can be set based on your requirements
  },
  
  lead_stage: {
    type: String,
    default: "new"
  },
  created_at: {
    type: Date,
    default: Date.now
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
  

  competitorAnalysis: [{
    developerName: {
      type: String
    },
    projectName: {
      type: String
    },
    productType: {
      type: String
    },
    location: {
      type: String
    },
    plotUnitSize: {
      type: String
    },
    landExtent: {
      type: String
    },
    priceRange: {
      type: String
    },
    approxPrice: {
      type: String
    },
    approxPriceCent: {
      type: String
    },
    totalPlotsUnits: {
      type: String
    },
    keyAmenities: {
      type: [String]
    },
    uspPositioning: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  checkListPage: [{
  landLocation: { type: String },
  landExtent: { type: String },
  landZone: { type: String },
  classificationOfLand: { type: String },
  googlePin: { type: String },
  approachRoadWidth: { type: String },
  ebLine: { type: String },
  soilType: { type: String },
  quarryCrusher: { type: String },
  sellingPrice: { type: String },
  guidelineValue: { type: String },
  locationSellingPrice: { type: String },
  marketingPrice: { type: String },

  // File paths
  fmbSketchPath: { type: String },
  pattaChittaPath: { type: String },

  roadWidth: { type: String },
  govtLandAcquisition: { type: String },
  railwayTrackNoc: { type: String },
  bankIssues: { type: String },
  dumpyardQuarryCheck: { type: String },
  waterbodyNearby: { type: String },
  nearbyHtLine: { type: String },
  templeLand: { type: String },
  futureGovtProjects: { type: String },
  farmLand: { type: String },
  totalSaleableArea: { type: String },
  landCleaning: { type: String },
  subDivision: { type: String },
  soilTest: { type: String },
  waterList: { type: String },
  ownerName: { type: String },
  consultantName: { type: String },
  notes: { type: String },

  projects: { type: String },
  googleLocation: { type: String }
}]

});

// Pre-save hook to auto-increment lead_id
leadSchema.pre('save', async function() {
  if (this.isNew) {
    try {
      const counter = await LeadCounter.findOneAndUpdate(
        { _id: 'lead_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.lead_id = counter.seq;
    } catch (error) {
      // If there's an error, we'll just log it and continue
      // The save will fail if lead_id is required but not set
      console.error('Error incrementing lead counter:', error);
    }
  }
});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
