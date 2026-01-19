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
  },
  
  
  
  calls: [{
    userId: {
      type: String,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      required: true
    }
  }],

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

module.exports = mongoose.model("Lead", leadSchema);
