const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Lead = require("../models/Lead").default;
const LeadHistory = require("../models/LeadHistory");
const Call = require("../models/Call");

// Helper function to calculate yields
const calculateYields = (leadData, userId) => {
  const yields = [];
  
  // OSR calculation - handle nested object
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
  
  // TNEB calculation - handle nested object
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
  
  // Local Body calculation - handle nested object
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

exports.createLead = async (req, res) => {
  console.log("🔥 createLead function called!");
  
  try {

    // 🔹 Parse JSON sent as text

    console.log("DEBUG: Raw req.body:", JSON.stringify(req.body, null, 2));

    const leadData =

      typeof req.body.data === "string"

        ? JSON.parse(req.body.data)

        : req.body;

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

    // Calculate yields if yield data is provided
    console.log("DEBUG: leadData received:", JSON.stringify(leadData, null, 2));
    console.log("DEBUG: req.body:", JSON.stringify(req.body, null, 2));
    
    // Check for yield data in both leadData and req.body (for form-data)
    const osrData = leadData.osr || req.body.osr;
    const tnebData = leadData.tneb || req.body.tneb;
    const localBodyData = leadData.localBody || req.body.localBody;
    
    console.log("DEBUG: osrData:", osrData);
    console.log("DEBUG: tnebData:", tnebData);
    console.log("DEBUG: localBodyData:", localBodyData);
    
    // Create a combined data object for yield calculation
    const yieldData = {
      ...leadData,
      osr: osrData ? (typeof osrData === 'string' ? JSON.parse(osrData) : osrData) : undefined,
      tneb: tnebData ? (typeof tnebData === 'string' ? JSON.parse(tnebData) : tnebData) : undefined,
      localBody: localBodyData ? (typeof localBodyData === 'string' ? JSON.parse(localBodyData) : localBodyData) : undefined
    };
    
    const calculatedYields = calculateYields(yieldData, createdBy);
    console.log("DEBUG: calculatedYields:", JSON.stringify(calculatedYields, null, 2));
    console.log("DEBUG: calculatedYields length:", calculatedYields.length);

    const lead = await Lead.create({

      ...restLeadData,

      checkListPage: formattedCheckListPage,

      competitorAnalysis: formattedCompetitorAnalysis,

      lead_status: lead_status,

      lead_stage: lead_stage,

      currentRole: currentRole, // Add currentRole to the lead

      created_by: createdBy,

      yields: calculatedYields // Add calculated yields

    });

    console.log("DEBUG: Lead created with yields:", JSON.stringify(lead.yields, null, 2));
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



    return res.status(201).json({

      message: "Lead created successfully",

      data: {
        ...lead.toObject(),
        yields: lead.yields || [] // Ensure yields field is always included
      }

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
    // Check if user is authenticated
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        message: "Please sign in to continue"
      });
    }

    const { leadId } = req.params;
    
    // Parse request body if it's sent as string
    const updateData = typeof req.body.data === "string" 
      ? JSON.parse(req.body.data) 
      : req.body;

    // Calculate yields if yield-related fields are present
    const calculatedYields = calculateYields(updateData, req.user.user_id);

    // Find and update the lead
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { 
        ...updateData, 
        yields: calculatedYields,
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

    return res.status(200).json({
      message: "Lead updated successfully",
      data: lead
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



    return res.status(200).json({

      success: true,

      data: {

        ...lead.toObject(),

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
