const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Lead = require("../models/Lead").default;
const LeadHistory = require("../models/LeadHistory");
const Call = require("../models/Call");
const { calculateLeadYield } = require("../utils/leadYieldCalculator");

// Helper function to calculate yields
// const calculateYields = (leadData, userId) => {
//   const yields = [];
  
//   // OSR calculation - handle nested object
//   if (leadData.osr && leadData.osr.siteArea && leadData.osr.percentage) {
//     const calculatedRoadArea = (leadData.osr.siteArea * leadData.osr.percentage) / 100;
//     const calculatedYield = leadData.osr.siteArea - calculatedRoadArea;
    
//     yields.push({
//       type: 'OSR',
//       siteArea: leadData.osr.siteArea,
//       manualRoadArea: leadData.osr.manualRoadArea || 0,
//       percentage: leadData.osr.percentage,
//       calculatedRoadArea,
//       calculatedYield,
//       calculatedBy: userId,
//       timestamp: new Date()
//     });
//   }
  
//   // TNEB calculation - handle nested object
//   if (leadData.tneb && leadData.tneb.siteArea && leadData.tneb.percentage) {
//     const calculatedRoadArea = (leadData.tneb.siteArea * leadData.tneb.percentage) / 100;
//     const calculatedYield = leadData.tneb.siteArea - calculatedRoadArea;
    
//     yields.push({
//       type: 'TNEB',
//       siteArea: leadData.tneb.siteArea,
//       manualRoadArea: leadData.tneb.manualRoadArea || 0,
//       percentage: leadData.tneb.percentage,
//       calculatedRoadArea,
//       calculatedYield,
//       calculatedBy: userId,
//       timestamp: new Date()
//     });
//   }
  
//   // Local Body calculation - handle nested object
//   if (leadData.localBody && leadData.localBody.siteArea && leadData.localBody.percentage) {
//     const calculatedRoadArea = (leadData.localBody.siteArea * leadData.localBody.percentage) / 100;
//     const calculatedYield = leadData.localBody.siteArea - calculatedRoadArea;
    
//     yields.push({
//       type: 'Local Body',
//       siteArea: leadData.localBody.siteArea,
//       manualRoadArea: leadData.localBody.manualRoadArea || 0,
//       percentage: leadData.localBody.percentage,
//       calculatedRoadArea,
//       calculatedYield,
//       calculatedBy: userId,
//       timestamp: new Date()
//     });
//   }
  
//   return yields;
// };

exports.createLead = async (req, res) => {
  console.log("🔥 createLead function called!");
  
  try {

    // 🔹 Parse JSON sent as text (from body or from form-data "data" field)
    console.log("DEBUG: Raw req.body:", JSON.stringify(req.body, null, 2));

    let leadData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data || "{}")
        : req.body;

    // When form-data is used, merge other body keys into leadData so currentRole, osr, tneb, yields, contactNumber, etc. are available
    if (req.body && typeof req.body === "object" && req.body.data !== undefined) {
      Object.keys(req.body).forEach((key) => {
        if (key === "data") return;
        const raw = req.body[key];
        if (raw === undefined) return;
        try {
          leadData[key] =
            typeof raw === "string" &&
            (raw.trim().startsWith("{") || raw.trim().startsWith("["))
              ? JSON.parse(raw)
              : raw;
        } catch (e) {
          leadData[key] = raw;
        }
      });
    }

    console.log("DEBUG: Parsed leadData:", JSON.stringify(leadData, null, 2));



    // Get user ID from JWT token

    if (!req.user || !req.user.user_id) {

      return res.status(401).json({

        message: "Please sign in to continue"

      });

    }

    const createdBy = req.user.user_id;



    if (!leadData.contactNumber || !leadData.date) {

      return res.status(400).json({

        message: "Contact number and date are required"

      });

    }



    const existingLead = await Lead.findOne({

      contactNumber: leadData.contactNumber

    });



    if (existingLead) {

      return res.status(400).json({

        message: "A lead with this contact number already exists",

        existingLeadId: existingLead._id

      });

    }



    const {

      userId,

      note,

      role,

      currentRole, // Default to 'user' if not provided

      competitorAnalysis = [],

      checkListPage = [],

      lead_status,

      lead_stage,

      yield_data,

      ...restLeadData

    } = leadData;



    // file paths

    const fmbSketchPath =

      req.files?.fmb_sketch?.[0]?.path || "";



    const pattaChittaPath =

      req.files?.patta_chitta?.[0]?.path || "";



    // 🧾 checklist

    const formattedCheckListPage = Array.isArray(checkListPage)

      ? checkListPage.map(item => ({

        ...item,

        fmbSketchPath,

        pattaChittaPath

      }))

      : [];

    const formattedCompetitorAnalysis = Array.isArray(competitorAnalysis)

      ? competitorAnalysis.map(comp => ({

        developerName: comp.developerName || '',

        projectName: comp.projectName || '',

        productType: comp.productType || '',

        location: comp.location || '',

        plotUnitSize: comp.plotUnitSize || '',

        landExtent: comp.landExtent || '',

        priceRange: comp.priceRange || '',

        approxPrice: comp.approxPrice || '',

        approxPriceCent: comp.approxPriceCent || '',

        totalPlotsUnits: comp.totalPlotsUnits || '',

        keyAmenities: Array.isArray(comp.keyAmenities) ? comp.keyAmenities : [],

        uspPositioning: comp.uspPositioning || '',

        timestamp: new Date()

      }))

      : [];

    // Create the lead first

    console.log("DEBUG: About to create lead with lead_status:", lead_status);
    console.log("DEBUG: About to create lead with lead_stage:", lead_stage);

    // Build yield input from leadData (support nested objects and form-data JSON strings)
    const parseField = (v) => {
      if (v == null) return undefined;
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          // If it's an object or array, return the parsed version
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
          }
        } catch (e) {
          // Not a JSON string, return original string
        }
      }
      return v;
    };
    const parsedSiteArea = parseField(leadData.siteArea);
    const yieldInput = {
      area: parseField(leadData.area) || parsedSiteArea || {
        value: leadData.areaValue ?? leadData.area_value ?? parsedSiteArea?.value ?? (leadData.roadArea?.siteArea),
        unit: leadData.areaUnit ?? leadData.area_unit ?? parsedSiteArea?.unit ?? "cents"
      },
      channel: parseField(leadData.channel) || {},
      gasLine: parseField(leadData.gasLine) || {},
      htTowerLine: parseField(leadData.htTowerLine) || {},
      river: parseField(leadData.river) || {},
      lake: parseField(leadData.lake) || {},
      railwayBoundary: parseField(leadData.railwayBoundary) || {},
      burialGround: parseField(leadData.burialGround) || {},
      highway: parseField(leadData.highway) || {},
      roadArea: parseField(leadData.roadArea) || {},
      osr: parseField(leadData.osr) || null,
      tneb: parseField(leadData.tneb) || {},
      localBody: parseField(leadData.localBody) || {}
    };

    const yieldCalculationResult = calculateLeadYield(yieldInput);
    const yieldCalculationToStore = {
      ...yieldCalculationResult,
      calculatedAt: new Date(),
      calculatedBy: createdBy
    };
    // Plain object so Mongoose persists Mixed field reliably
    const yieldCalculationPlain = JSON.parse(JSON.stringify(yieldCalculationToStore));

    // Enhanced yield calculation to store all input fields
    const calculateEnhancedYields = (leadData, userId) => {
      const yields = [];
      
      // Store all yield calculation input fields as a comprehensive yield record
      const yieldRecord = {
        type: 'Comprehensive Yield Calculation',
        // Area information
        areaValue: parsedSiteArea?.value || leadData.siteArea?.value || leadData.area?.value || leadData.area_value,
        areaUnit: parsedSiteArea?.unit || leadData.siteArea?.unit || leadData.areaUnit || leadData.area_unit || 'cents',
        
        // Deduction fields
        channel: leadData.channel || {},
        gasLine: leadData.gasLine || {},
        htTowerLine: leadData.htTowerLine || {},
        river: leadData.river || {},
        lake: leadData.lake || {},
        railwayBoundary: leadData.railwayBoundary || {},
        burialGround: leadData.burialGround || {},
        highway: leadData.highway || {},
        roadArea: leadData.roadArea || {},
        
        // Percentage-based deductions
        osr: leadData.osr || null,
        tneb: leadData.tneb || {},
        localBody: leadData.localBody || {},
        
        // Store the calculation results
        yieldCalculation: yieldCalculationResult,
        
        calculatedBy: userId,
        timestamp: new Date()
      };
      
      yields.push(yieldRecord);
      
      // Also keep the existing individual OSR, TNEB, Local Body calculations
      if (leadData.osr && leadData.osr.siteArea && leadData.osr.percentage) {
        const calculatedRoadArea = (leadData.osr.siteArea * leadData.osr.percentage) / 100;
        const calculatedYield = leadData.osr.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'OSR',
          siteArea: leadData.osr.siteArea,
          manualRoadArea: leadData.osr.manualRoadArea || 0,
          percentage: leadData.osr.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      if (leadData.tneb && leadData.tneb.siteArea && leadData.tneb.percentage) {
        const calculatedRoadArea = (leadData.tneb.siteArea * leadData.tneb.percentage) / 100;
        const calculatedYield = leadData.tneb.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'TNEB',
          siteArea: leadData.tneb.siteArea,
          manualRoadArea: leadData.tneb.manualRoadArea || 0,
          percentage: leadData.tneb.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      if (leadData.localBody && leadData.localBody.siteArea && leadData.localBody.percentage) {
        const calculatedRoadArea = (leadData.localBody.siteArea * leadData.localBody.percentage) / 100;
        const calculatedYield = leadData.localBody.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'Local Body',
          siteArea: leadData.localBody.siteArea,
          manualRoadArea: leadData.localBody.manualRoadArea || 0,
          percentage: leadData.localBody.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      return yields;
    };

    const calculatedYields = calculateEnhancedYields(leadData, createdBy);
    
    // Use provided yields or calculated ones
    const yieldsToStore = Array.isArray(leadData.yields) && leadData.yields.length > 0
      ? leadData.yields.map(y => ({
          type: y.type || "Unknown",
          siteArea: y.siteArea,
          manualRoadArea: y.manualRoadArea,
          percentage: y.percentage,
          calculatedRoadArea: y.calculatedRoadArea,
          calculatedYield: y.calculatedYield,
          calculatedBy: y.calculatedBy || createdBy,
          timestamp: y.timestamp ? new Date(y.timestamp) : new Date()
        }))
      : calculatedYields;

    const createPayload = {
      ...restLeadData,
      checkListPage: formattedCheckListPage,
      competitorAnalysis: formattedCompetitorAnalysis,
      lead_status: lead_status,
      lead_stage: lead_stage,
      currentRole: currentRole,
      created_by: createdBy,
      // yields: yieldsToStore,
      yieldCalculation: yieldCalculationPlain
    };
    const lead = await Lead.create(createPayload);

    console.log("DEBUG: Lead created with yields:", JSON.stringify(lead.yields, null, 2));
    console.log("DEBUG: Lead created with yieldCalculation:", lead.yieldCalculation ? "present" : "missing");
    console.log("DEBUG: Lead created with lead_status:", lead.lead_status);
    console.log("DEBUG: Lead created with lead_stage:", lead.lead_stage);



    // Create call record if userId is provided

    if (userId) {

      await Call.create({

        leadId: lead._id,

        userId,

        name: leadData.name || 'Unknown User', // Get name from leadData

        role: role || 'user',

        note: note || "Initial lead created",

        location: leadData.location,

        created_by: createdBy

      });

    }



    const leadObj = lead.toObject();
    const { yields, ...leadDataWithoutYields } = leadObj;
    const responseData = {
      ...leadDataWithoutYields,
      yieldCalculation: leadObj.yieldCalculation != null ? leadObj.yieldCalculation : yieldCalculationToStore
    };
    return res.status(201).json({
      message: "Lead created successfully",
      data: responseData
    });



  } catch (error) {

    return res.status(500).json({

      message: "Could not create lead. Please try again.",

      error: error.message

    });

  }

};

// Update lead function with yield calculation
exports.updateLead = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        message: "Please sign in to continue"
      });
    }

    const { leadId } = req.params;

    let updateData = typeof req.body.data === "string"
      ? JSON.parse(req.body.data || "{}")
      : req.body;

    if (req.body && typeof req.body === "object" && req.body.data !== undefined) {
      Object.keys(req.body).forEach((key) => {
        if (key === "data") return;
        const raw = req.body[key];
        if (raw === undefined) return;
        try {
          updateData[key] =
            typeof raw === "string" &&
            (raw.trim().startsWith("{") || raw.trim().startsWith("["))
              ? JSON.parse(raw)
              : raw;
        } catch (e) {
          updateData[key] = raw;
        }
      });
    }

    const parseField = (v) => {
      if (v == null) return undefined;
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          // If it's an object or array, return the parsed version
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
          }
        } catch (e) {
          // Not a JSON string, return original string
        }
      }
      return v;
    };
    const parsedSiteArea = parseField(updateData.siteArea);
    const yieldInput = {
      area: parseField(updateData.area) || parsedSiteArea || {
        value: updateData.areaValue ?? updateData.area_value ?? parsedSiteArea?.value ?? (updateData.roadArea?.siteArea),
        unit: updateData.areaUnit ?? updateData.area_unit ?? parsedSiteArea?.unit ?? "cents"
      },
      channel: parseField(updateData.channel) || {},
      gasLine: parseField(updateData.gasLine) || {},
      htTowerLine: parseField(updateData.htTowerLine) || {},
      river: parseField(updateData.river) || {},
      lake: parseField(updateData.lake) || {},
      railwayBoundary: parseField(updateData.railwayBoundary) || {},
      burialGround: parseField(updateData.burialGround) || {},
      highway: parseField(updateData.highway) || {},
      roadArea: parseField(updateData.roadArea) || {},
      osr: parseField(updateData.osr) || null,
      tneb: parseField(updateData.tneb) || {},
      localBody: parseField(updateData.localBody) || {}
    };
    const yieldCalculationResult = calculateLeadYield(yieldInput);
    const yieldCalculationToStore = {
      ...yieldCalculationResult,
      calculatedAt: new Date(),
      calculatedBy: req.user.user_id
    };
    const yieldCalculationPlain = JSON.parse(JSON.stringify(yieldCalculationToStore));

    // Enhanced yield calculation to store all input fields
    const calculateEnhancedYields = (leadData, userId) => {
      const yields = [];
      
      // Store all yield calculation input fields as a comprehensive yield record
      const yieldRecord = {
        type: 'Comprehensive Yield Calculation',
        // Area information
        areaValue: parsedSiteArea?.value || updateData.siteArea?.value || updateData.area?.value || updateData.area_value,
        areaUnit: parsedSiteArea?.unit || updateData.siteArea?.unit || updateData.areaUnit || updateData.area_unit || 'cents',
        
        // Deduction fields
        channel: updateData.channel || {},
        gasLine: updateData.gasLine || {},
        htTowerLine: updateData.htTowerLine || {},
        river: updateData.river || {},
        lake: updateData.lake || {},
        railwayBoundary: updateData.railwayBoundary || {},
        burialGround: updateData.burialGround || {},
        highway: updateData.highway || {},
        roadArea: updateData.roadArea || {},
        
        // Percentage-based deductions
        osr: updateData.osr || null,
        tneb: updateData.tneb || {},
        localBody: updateData.localBody || {},
        
        // Store the calculation results
        yieldCalculation: yieldCalculationResult,
        
        calculatedBy: userId,
        timestamp: new Date()
      };
      
      yields.push(yieldRecord);
      
      // Also keep the existing individual OSR, TNEB, Local Body calculations
      if (updateData.osr && updateData.osr.siteArea && updateData.osr.percentage) {
        const calculatedRoadArea = (updateData.osr.siteArea * updateData.osr.percentage) / 100;
        const calculatedYield = updateData.osr.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'OSR',
          siteArea: updateData.osr.siteArea,
          manualRoadArea: updateData.osr.manualRoadArea || 0,
          percentage: updateData.osr.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      if (updateData.tneb && updateData.tneb.siteArea && updateData.tneb.percentage) {
        const calculatedRoadArea = (updateData.tneb.siteArea * updateData.tneb.percentage) / 100;
        const calculatedYield = updateData.tneb.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'TNEB',
          siteArea: updateData.tneb.siteArea,
          manualRoadArea: updateData.tneb.manualRoadArea || 0,
          percentage: updateData.tneb.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      if (updateData.localBody && updateData.localBody.siteArea && updateData.localBody.percentage) {
        const calculatedRoadArea = (updateData.localBody.siteArea * updateData.localBody.percentage) / 100;
        const calculatedYield = updateData.localBody.siteArea - calculatedRoadArea;
        
        yields.push({
          type: 'Local Body',
          siteArea: updateData.localBody.siteArea,
          manualRoadArea: updateData.localBody.manualRoadArea || 0,
          percentage: updateData.localBody.percentage,
          calculatedRoadArea,
          calculatedYield,
          calculatedBy: userId,
          timestamp: new Date()
        });
      }
      
      return yields;
    };

    const calculatedYields = calculateEnhancedYields(updateData, req.user.user_id);

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        ...updateData,
        yields: calculatedYields,
        yieldCalculation: yieldCalculationPlain,
        updated_by: req.user.user_id,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    const leadObj = lead.toObject();
    const { yields, ...leadDataWithoutYields } = leadObj;
    return res.status(200).json({
      message: "Lead updated successfully",
      data: {
        ...leadDataWithoutYields,
        yieldCalculation: leadObj.yieldCalculation || null
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Could not update lead. Please try again.",
      error: error.message
    });
  }
};


exports.deleteLead = async (req, res) => {

  try {

    const { leadId } = req.params;



    const lead = await Lead.findById(leadId);



    if (!lead) {

      return res.status(404).json({

        message: "Lead not found"

      });

    }



    // Store the lead data for response before deletion

    const deletedLeadData = lead.toObject();



    // Permanently delete the lead

    await Lead.findByIdAndDelete(leadId);



    return res.status(200).json({

      message: "Lead deleted permanently",

      data: deletedLeadData

    });

  } catch (error) {

    return res.status(500).json({

      message: "Could not delete lead. Please try again.",

      error: error.message

    });

  }

};



exports.getAllLeads = async (req, res) => {

  try {

    const { location, userId } = req.query;

    const query = {};



    if (location) {

      query.location = { $regex: new RegExp(`^${location}$`, 'i') };

    }



    const leads = await Lead.find(query)

      .sort({ created_at: -1 });

 if (userId) {

      // Get lead IDs from LeadHistory where user is assignedTo

      const assignedLeadIds = await LeadHistory.find({

        'assignedTo.user_id': userId

      }).distinct('leadId');

      

      // Query for leads created by user OR assigned to user via LeadHistory

      query.$or = [

        { created_by: userId },

        { _id: { $in: assignedLeadIds } }

      ];

    }

    return res.status(200).json({

      count: leads.length,

      data: leads

    });

  } catch (error) {

    return res.status(500).json({
      message: "Could not load leads. Please try again.",

      error: error.message
    });

  }

};



exports.getPendingLeads = async (req, res) => {

  try {

    const { location, userId } = req.query;

    let query = {

      lead_status: { $nin: ["APPROVED", "PURCHASED", "Purchased", "Approved"] }

    };



    if (location) {

      query.location = { $regex: new RegExp(`^${location}$`, 'i') };

    }

    // If userId is provided, filter leads created by user or assigned to user
    if (userId) {
      // Get lead IDs from LeadHistory where user is assignedTo

      const assignedLeadIds = await LeadHistory.find({
        'assignedTo.user_id': userId
      }).distinct('leadId');


      // Query for leads created by user OR assigned to user via LeadHistory
      query.$or = [
        { created_by: userId },
        { _id: { $in: assignedLeadIds } }
      ];
    }


    const leads = await Lead.find(query)
      .sort({ created_at: -1 });


    return res.status(200).json({
      count: leads.length,
      data: leads
    });

  } catch (error) {

    return res.status(500).json({

      message: "Could not load leads. Please try again.",

      error: error.message

    });

  }

};

// check update

exports.getApprovedLeads = async (req, res) => {

  try {

    const { location, userId } = req.query;

    const query = {
      lead_status: "Approved",
      status: "active"

    };



    if (location) {

      query.location = { $regex: new RegExp(`^${location}$`, 'i') };

    }

     if (userId) {

      // Get lead IDs from LeadHistory where user is assignedTo

      const assignedLeadIds = await LeadHistory.find({

        'assignedTo.user_id': userId

      }).distinct('leadId');

      

      // Query for leads created by user OR assigned to user via LeadHistory

      query.$or = [

        { created_by: userId },

        { _id: { $in: assignedLeadIds } }

      ];

    }
    const leads = await Lead.find(query)
    // .sort({ created_at: -1 });
    console.log('leads :>> ', leads);
    return res.status(200).json({

      message: "Approved leads loaded successfully",

      count: leads.length,

      data: leads

    });



  } catch (error) {

    console.error("Get Approved Leads Error:", error);

    return res.status(500).json({

      message: "Could not load approved leads. Please try again.",

      error: error.message

    });

  }

};



exports.getPurchasedLeads = async (req, res) => {

  try {

    const { location, userId } = req.query;

    const query = {
      lead_status: "Purchased",
      status: "active"

    };



    if (location) {

      query.location = { $regex: new RegExp(`^${location}$`, 'i') };

    }

     if (userId) {

      // Get lead IDs from LeadHistory where user is assignedTo

      const assignedLeadIds = await LeadHistory.find({

        'assignedTo.user_id': userId

      }).distinct('leadId');

      

      // Query for leads created by user OR assigned to user via LeadHistory

      query.$or = [

        { created_by: userId },

        { _id: { $in: assignedLeadIds } }

      ];

    }

    const leads = await Lead.find(query).sort({ created_at: -1 });



    return res.status(200).json({

      message: "Purchased leads loaded successfully",

      count: leads.length,

      data: leads

    });



  } catch (error) {

    console.error("Get Purchased Leads Error:", error);

    return res.status(500).json({

      message: "Could not load purchased leads. Please try again.",

      error: error.message

    });

  }

};



exports.getLeadById = async (req, res) => {

  try {

    const { leadId } = req.params;



    if (!mongoose.Types.ObjectId.isValid(leadId)) {

      return res.status(400).json({

        success: false,

        message: 'Invalid lead ID'

      });

    }



    // Find the lead, history, and calls in parallel

    const [lead, history, calls] = await Promise.all([

      Lead.findById(leadId),

      LeadHistory.find({ leadId }).sort({ createdAt: -1 }),

      Call.find({ leadId }).sort({ createdAt: -1 })

    ]);



    if (!lead) {

      return res.status(404).json({

        success: false,

        message: 'Lead not found'

      });

    }



    const leadObj = lead.toObject();
    const { yields, ...leadDataWithoutYields } = leadObj;
    return res.status(200).json({

      success: true,

      data: {

        ...leadDataWithoutYields,

        yieldCalculation: leadObj.yieldCalculation || null,

        history: history || [],

        calls: calls || []

      }

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: 'Could not load lead details. Please try again.',

      error: error.message

    });

  }

};



// Get all calls with optional leadId filter

exports.getAllCalls = async (req, res) => {

  try {

    const { leadId, location } = req.query;

    const query = {};



    if (leadId) {

      if (!mongoose.Types.ObjectId.isValid(leadId)) {

        return res.status(400).json({

          success: false,

          message: 'Invalid lead ID'

        });

      }

      query.leadId = leadId;

    }



    if (location) {

      query.location = { $regex: new RegExp(location, 'i') };

    }



    const calls = await Call.find(query)

      .populate({

        path: 'leadId',

        select: '_id lead_id name contactNumber',

        model: 'Lead'

      })

      .populate('created_by', 'name email')

      .sort({ createdAt: -1 });



    return res.status(200).json({

      success: true,

      count: calls.length,

      data: calls
      //lead controller
    });

  } catch (error) {

    console.error('Error fetching calls:', error);

    return res.status(500).json({

      success: false,

      message: 'Could not load calls. Please try again.',

      error: error.message

    });

  }

};
