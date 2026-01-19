const mongoose = require('mongoose');
const Lead = require("../models/Lead");

// exports.createLead = async (req, res) => {
//   try {
//     const leadData = req.body;

//     if (!leadData.contactNumber || !leadData.date) {
//       return res.status(400).json({
//         message: "contactNumber and date are required"
//       });
//     }

//     // Check if a lead with the same contact number already exists
//     const existingLead = await Lead.findOne({ contactNumber: leadData.contactNumber });
//     if (existingLead) {
//       return res.status(400).json({
//         message: "A lead with this contact number already exists",
//         existingLeadId: existingLead._id
//       });
//     }

//     const { userId, note, role, competitorAnalysis = [], checkListPage = [], ...restLeadData } = leadData;
    

//         // Format checklist page
//     const formattedCheckListPage = Array.isArray(checkListPage)
//       ? checkListPage.map(item => ({
//           landLocation: item.landLocation || "",
//           landExtent: item.landExtent || "",
//           landZone: item.landZone || "",
//           classificationOfLand: item.classificationOfLand || "",
//           googlePin: item.googlePin || "",
//           approachRoadWidth: item.approachRoadWidth || "",
//           ebLine: item.ebLine || "",
//           soilType: item.soilType || "",
//           quarryCrusher: item.quarryCrusher || "",
//           sellingPrice: item.sellingPrice || "",
//           guidelineValue: item.guidelineValue || "",
//           locationSellingPrice: item.locationSellingPrice || "",
//           marketingPrice: item.marketingPrice || "",

//           fmbSketchPath: item.fmbSketchPath || "",
//           pattaChittaPath: item.pattaChittaPath || "",

//           roadWidth: item.roadWidth || "",
//           govtLandAcquisition: item.govtLandAcquisition || "",
//           railwayTrackNoc: item.railwayTrackNoc || "",
//           bankIssues: item.bankIssues || "",
//           dumpyardQuarryCheck: item.dumpyardQuarryCheck || "",
//           waterbodyNearby: item.waterbodyNearby || "",
//           nearbyHtLine: item.nearbyHtLine || "",
//           templeLand: item.templeLand || "",
//           futureGovtProjects: item.futureGovtProjects || "",
//           farmLand: item.farmLand || "",
//           totalSaleableArea: item.totalSaleableArea || "",
//           landCleaning: item.landCleaning || "",
//           subDivision: item.subDivision || "",
//           soilTest: item.soilTest || "",
//           waterList: item.waterList || "",
//           ownerName: item.ownerName || "",
//           consultantName: item.consultantName || "",
//           notes: item.notes || "",

//           projects: item.projects || "",
//           googleLocation: item.googleLocation || ""
//         }))
//       : [];
//     // Format competitor analysis data
//     const formattedCompetitorAnalysis = Array.isArray(competitorAnalysis) 
//       ? competitorAnalysis.map(comp => ({
//           developerName: comp.developerName || '',
//           projectName: comp.projectName || '',
//           productType: comp.productType || '',
//           location: comp.location || '',
//           plotUnitSize: comp.plotUnitSize || '',
//           landExtent: comp.landExtent || '',
//           priceRange: comp.priceRange || '',
//           approxPrice: comp.approxPrice || '',
//           approxPriceCent: comp.approxPriceCent || '',
//           totalPlotsUnits: comp.totalPlotsUnits || '',
//           keyAmenities: Array.isArray(comp.keyAmenities) ? comp.keyAmenities : [],
//           uspPositioning: comp.uspPositioning || '',
//           timestamp: new Date()
//         }))
//       : [];
    
//     const lead = await Lead.create({
//       ...restLeadData,
//       leadType: restLeadData.leadType || "mediator",
//       unit: restLeadData.unit || "Acre",
//       transactionType: restLeadData.transactionType || "JV",
//       sspde: restLeadData.sspde || "No",
//       lead_status: "PENDINGG",
//       calls: userId ? [{
//         userId: userId,
//         note: note || "Initial lead created",
//         role: role,
//         timestamp: new Date()
//       }] : [],
//       checkListPage: formattedCheckListPage,
//       competitorAnalysis: formattedCompetitorAnalysis
//     });

//     return res.status(201).json({
//       message: "Lead created successfully",
//       data: lead
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

exports.createLead = async (req, res) => {
  try {
    // 🔹 Parse JSON sent as text
    const leadData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body;

    if (!leadData.contactNumber || !leadData.date) {
      return res.status(400).json({
        message: "contactNumber and date are required"
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
      competitorAnalysis = [],
      checkListPage = [],
      ...restLeadData
    } = leadData;

    // 📂 file paths
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
    const lead = await Lead.create({
      ...restLeadData,
      checkListPage: formattedCheckListPage,
      competitorAnalysis: formattedCompetitorAnalysis,
      lead_status: "PENDING",
      calls: userId
        ? [{
            userId,
            note: note || "Initial lead created",
            role,
            timestamp: new Date()
          }]
        : []
    });

    return res.status(201).json({
      message: "Lead created successfully",
      data: lead
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { userId, note, notes, role, competitorAnalysis, checkListPage, ...updateData } = req.body;

    const update = { ...updateData }; //test
    
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
    
    // If notes is being updated, add a call entry
    if (notes !== undefined) {
      // update.notes = notes;
      update.$push.calls = {
        userId: userId || 'system',
        note:  notes,
        role: role,
        timestamp: new Date()
      };
    }
    
    // If a new note is provided, add it to calls
    if (note && userId) {
      update.$push.calls = {
        userId,
        note,
        role,
        timestamp: new Date()
      };
    }

    // If no $push operations were set, remove the empty $push
    if (Object.keys(update.$push).length === 0) {
      delete update.$push;
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      update,
      { new: true, runValidators: true }
    );

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
      message: "Server error",
      error: error.message
    });
  }
};

exports.softDeleteLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    if (lead.status === "inactive") {
      return res.status(400).json({
        message: "Lead already inactive"
      });
    }

    lead.status = "inactive";
    await lead.save();

    return res.status(200).json({
      message: "Lead soft deleted successfully",
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ lead_status: "PENDING" })
      .sort({ created_at: -1 });

    return res.status(200).json({
      count: leads.length,
      data: leads
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.getApprovedLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      lead_status: "APPROVED",
      status: "active"
    }).sort({ created_at: -1 });

    return res.status(200).json({
      message: "Approved leads fetched successfully",
      count: leads.length,
      data: leads
    });

  } catch (error) {
    console.error("Get Approved Leads Error:", error);
    return res.status(500).json({
      message: "Failed to fetch approved leads",
      error: error.message
    });
  }
};

exports.getPurchasedLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      lead_status: "PURCHASED",
      status: "active"
    }).sort({ created_at: -1 });

    return res.status(200).json({
      message: "Purchased leads fetched successfully",
      count: leads.length,
      data: leads
    });

  } catch (error) {
    console.error("Get Purchased Leads Error:", error);
    return res.status(500).json({
      message: "Failed to fetch purchased leads",
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
        message: 'Invalid lead ID format'
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
