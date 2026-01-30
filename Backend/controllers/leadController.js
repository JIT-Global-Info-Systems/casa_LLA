const mongoose = require('mongoose');

// const Lead = require("../models/Lead");

const Lead = require("../models/Lead").default;

const LeadHistory = require("../models/LeadHistory");

const Call = require("../models/Call");





exports.createLead = async (req, res) => {

  try {

    // 🔹 Parse JSON sent as text

    const leadData =

      typeof req.body.data === "string"

        ? JSON.parse(req.body.data)

        : req.body;



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

      currentRole , // Default to 'user' if not provided

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

    const lead = await Lead.create({

      ...restLeadData,

      checkListPage: formattedCheckListPage,

      competitorAnalysis: formattedCompetitorAnalysis,

      lead_status: lead_status ,

      lead_stage: lead_stage,

      currentRole: currentRole, // Add currentRole to the lead

      created_by: createdBy

    });

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

      data: lead

    });



  } catch (error) {

    return res.status(500).json({

      message: "Could not create lead. Please try again.",

      error: error.message

    });

  }

};



exports.updateLead = async (req, res) => {

  try {

    // Check if user is authenticated

    if (!req.user || !req.user.user_id) {

      return res.status(401).json({

        message: "Please sign in to continue"

      });

    }



    const { leadId } = req.params;

    const { userId, note, notes, role, currentRole, assignedTo, competitorAnalysis, checkListPage, callDate, callTime, ...updateData } = req.body;



    const update = {

      ...updateData,

      updated_by: req.user.user_id, // Set updated_by with user ID from JWT token

      updated_at: new Date(), // Set updated_at timestamp

    };



    // Handle currentRole array if provided

    if (currentRole !== undefined) {

      console.log("Raw currentRole:", currentRole, "Type:", typeof currentRole);

      let parsedCurrentRole = currentRole;

      if (typeof currentRole === 'string') {

        try {

          parsedCurrentRole = JSON.parse(currentRole);

          console.log("Parsed currentRole:", parsedCurrentRole);

        } catch (e) {

          console.error("Error parsing currentRole string:", e);

          return res.status(400).json({ message: "Invalid format for currentRole" });

        }

      }



      if (Array.isArray(parsedCurrentRole)) {

        update.currentRole = parsedCurrentRole;

      } else if (typeof parsedCurrentRole === 'object' && parsedCurrentRole !== null) {

        // If single object is provided, wrap it in array

        update.currentRole = [parsedCurrentRole];

      }

      console.log("Final update.currentRole:", update.currentRole);

    }



    // Handle assignedTo array if provided

    if (assignedTo !== undefined) {

      console.log("Raw assignedTo:", assignedTo, "Type:", typeof assignedTo);

      let parsedAssignedTo = assignedTo;

      if (typeof assignedTo === 'string') {

        try {

          parsedAssignedTo = JSON.parse(assignedTo);

          console.log("Parsed assignedTo:", parsedAssignedTo);

        } catch (e) {

          console.error("Error parsing assignedTo string:", e);

          return res.status(400).json({ message: "Invalid format for assignedTo" });

        }

      }



      if (Array.isArray(parsedAssignedTo)) {

        update.assignedTo = parsedAssignedTo;

      } else if (typeof parsedAssignedTo === 'object' && parsedAssignedTo !== null) {

        // If single object is provided, wrap it in array

        update.assignedTo = [parsedAssignedTo];

      }

      console.log("Final update.assignedTo:", update.assignedTo);

    }



    // Initialize $push if not already set

    update.$push = update.$push || {};



    // If competitorAnalysis is provided, format and update it

    if (competitorAnalysis !== undefined) {

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



      update.competitorAnalysis = formattedCompetitorAnalysis;

    }



    // If checkListPage is provided, format and update it

    if (checkListPage !== undefined) {

      // Get file paths if files were uploaded

      const fmbSketchPath = req.files?.fmb_sketch?.[0]?.path || '';

      const pattaChittaPath = req.files?.patta_chitta?.[0]?.path || '';



      const formattedCheckListPage = Array.isArray(checkListPage)

        ? checkListPage.map(item => ({

            ...item,

            ...(fmbSketchPath && { fmbSketchPath }),

            ...(pattaChittaPath && { pattaChittaPath })

          }))

        : [];



      update.checkListPage = formattedCheckListPage;

    }



    // If notes is being updated, create a new call record

    if (notes !== undefined) {

      const updateData = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

      const { callDate, callTime } = updateData;

      

      // Create call timestamp from provided date and time, or use current date/time as fallback

      let callTimestamp = new Date();

      if (callDate) {

        // If callTime is provided, combine with callDate, otherwise use callDate alone

        const dateTimeString = callTime ? `${callDate}T${callTime}` : callDate;

        callTimestamp = new Date(dateTimeString);

        

        // If invalid date, fallback to current date/time

        if (isNaN(callTimestamp.getTime())) {

          callTimestamp = new Date();

        }

      }

      

      await Call.create({

        leadId: leadId,

        userId: userId || 'system',

        name: updateData.name || req.user?.name || 'System',

        role: currentRole || 'system',

        note: notes,

        created_by: req.user?.user_id || 'system',

        created_at: callTimestamp,

        callDate: callDate || null,

        callTime: callTime || null

      });

    }



    // If a new note is provided, create a new call record

    if (note && userId) {

      const updateData = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

      const { callDate, callTime } = updateData;

      

      // Create call timestamp from provided date and time, or use current date/time as fallback

      let callTimestamp = new Date();

      if (callDate) {

        const dateTimeString = callTime ? `${callDate}T${callTime}` : callDate;

        callTimestamp = new Date(dateTimeString);

        if (isNaN(callTimestamp.getTime())) {

          callTimestamp = new Date();

        }

      }

      

      await Call.create({

        leadId: leadId,

        userId,

        name: updateData.name || req.user?.name || 'Unknown User',

        role: currentRole || 'user',

        note: note,

        created_by: req.user?.user_id || 'system',

        created_at: callTimestamp,

        callDate: callDate || null,

        callTime: callTime || null

      });

    }



    // If no $push operations were set, remove the empty $push

    if (update.$push && Object.keys(update.$push).length === 0) {

      delete update.$push;

    }



    // Track changes to currentRole and assignedTo in LeadHistory

    if (update.currentRole || update.assignedTo) {

      console.log("Tracking changes for LeadHistory. update.currentRole:", update.currentRole, "update.assignedTo:", update.assignedTo);

      const existingLead = await Lead.findById(leadId);



      if (existingLead) {

        // Create a new history entry if either field is being updated

        const historyEntry = {

          leadId: existingLead._id,

          currentRole: update.currentRole || existingLead.currentRole || [],

          assignedTo: update.assignedTo || existingLead.assignedTo || [],

          createdBy: req.user.user_id

        };



        await LeadHistory.create(historyEntry);

      }

    }



    console.log("Final update object before database update:", JSON.stringify(update, null, 2));



    // Use direct MongoDB collection update to bypass Mongoose schema issues

    const collection = Lead.collection;

    

    const updateOperation = { 

      $set: {

        updated_by: req.user.user_id,

        updated_at: new Date(),

        currentRole: update.currentRole || [],

        assignedTo: update.assignedTo || []

      }

    };



    // Add other fields from updateData

    Object.keys(updateData).forEach(key => {

      if (key !== 'currentRole' && key !== 'assignedTo') {

        updateOperation.$set[key] = updateData[key];

      }

    });



    // Handle competitorAnalysis if present

    if (update.competitorAnalysis) {

      updateOperation.$set.competitorAnalysis = update.competitorAnalysis;

    }



    // Handle checkListPage if present

    if (update.checkListPage) {

      updateOperation.$set.checkListPage = update.checkListPage;

    }



    console.log("Final update operation:", JSON.stringify(updateOperation, null, 2));



    const result = await collection.updateOne(

      { _id: leadId },

      updateOperation

    );



    // Get the updated document

    const updatedLead = await Lead.findById(leadId);



    if (!updatedLead) {

      return res.status(404).json({

        message: "Lead not found"

      });

    }



    return res.status(200).json({

      message: "Lead updated successfully",

      data: updatedLead

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
