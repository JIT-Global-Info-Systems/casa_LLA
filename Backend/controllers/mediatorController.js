const Mediator = require("../models/mediator");

exports.createMediator = async (req, res) => {
  try {
    // Parse JSON data from form-data field 'data' or fallback to req.body for backward compatibility
    const jsonData = req.body.data ? JSON.parse(req.body.data) : req.body;
    
    const {
      name,
      email,
      phone_primary,
      phone_secondary,
      category,
      pan_number,
      aadhar_number,
      location,
      linked_executive,
      mediator_type,
      address
    } = jsonData;

    if (!req.files?.pan_upload || !req.files?.aadhar_upload) {
      return res.status(400).json({
        message: "PAN and Aadhar images are required"
      });
    }

    const existingMediator = await Mediator.findOne({ email });
    if (existingMediator) {
      return res.status(409).json({
        message: "Mediator with this email already exists"
      });
    }

        const mediator = await Mediator.create({
      name,
      email,
      phone_primary,
      phone_secondary,
      category,
      pan_number,
      aadhar_number,
      pan_upload: req.files.pan_upload[0].path,
      aadhar_upload: req.files.aadhar_upload[0].path,
      location,
      linked_executive,
      mediator_type,
      address,
      created_by: req.user.user_id
    });

    return res.status(201).json({
      message: "Mediator created successfully",
      data: mediator
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



const fs = require("fs");
const path = require("path");


exports.updateMediator = async (req, res) => {
  try {
    const { mediatorId } = req.params;

    const mediator = await Mediator.findById(mediatorId);
    if (!mediator) {
      return res.status(404).json({
        message: "Mediator not found"
      });
    }

    // Handle PAN upload update
    if (req.files?.pan_upload) {
      if (mediator.pan_upload && fs.existsSync(mediator.pan_upload)) {
        fs.unlinkSync(mediator.pan_upload);
      }
      mediator.pan_upload = req.files.pan_upload[0].path;
    }

    // Handle Aadhar upload update
    if (req.files?.aadhar_upload) {
      if (mediator.aadhar_upload && fs.existsSync(mediator.aadhar_upload)) {
        fs.unlinkSync(mediator.aadhar_upload);
      }
      mediator.aadhar_upload = req.files.aadhar_upload[0].path;
    }

    // Update other fields
    const editableFields = [
      "name",
      "email",
      "phone_primary",
      "phone_secondary",
      "category",
      "pan_number",
      "aadhar_number",
      "location",
      "linked_executive",
      "mediator_type",
      "status"
    ];

    editableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        mediator[field] = req.body[field];
      }
    });

    // Address update (JSON string)
    if (req.body.address) {
      mediator.address = JSON.parse(req.body.address);
    }

    // Update updated_by and updated_at fields
    mediator.updated_by = req.user.user_id;
    mediator.updated_at = new Date();

    await mediator.save();

    return res.status(200).json({
      message: "Mediator updated successfully",
      data: mediator
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.softDeleteMediator = async (req, res) => {
  try {
    const { mediatorId } = req.params;

    const mediator = await Mediator.findById(mediatorId);
    if (!mediator) {
      return res.status(404).json({
        message: "Mediator not found"
      });
    }

    if (mediator.status === "inactive") {
      return res.status(400).json({
        message: "Mediator already inactive"
      });
    }

    mediator.status = "inactive";
    await mediator.save();

    return res.status(200).json({
      message: "Mediator soft deleted successfully",
      data: mediator
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllMediators = async (req, res) => {
  try {
    const mediators = await Mediator.find({ status: "active" })
      .sort({ created_at: -1 });

    return res.status(200).json({
      count: mediators.length,
      data: mediators
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
