const Mediator = require("../models/Mediator.js");

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
      address: address ? (typeof address === 'string' ? JSON.parse(address) : address) : {}
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
