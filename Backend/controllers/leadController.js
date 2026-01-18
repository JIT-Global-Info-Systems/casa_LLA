const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData.contactNumber || !leadData.date) {
      return res.status(400).json({
        message: "contactNumber and date are required"
      });
    }

    const lead = await Lead.create({
      ...leadData,
      leadType: leadData.leadType || "mediator",
      unit: leadData.unit || "Acre",
      transactionType: leadData.transactionType || "JV",
      sspde: leadData.sspde || "No"
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
    const updateData = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: updateData },
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
    const leads = await Lead.find({ lead_status: "pending" })
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
