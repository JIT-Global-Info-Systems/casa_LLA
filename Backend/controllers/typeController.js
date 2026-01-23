const Type = require("../models/Type");
const User = require("../models/User");

exports.createType = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.user_id;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const user = await User.findOne({ _id: userId, status: "active" });
    if (!user) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    // Allow users to have multiple active types

    const newType = new Type({
      userId,
      type,
      created_by: req.user.user_id
    });

    await newType.save();

    return res.status(201).json({
      message: "Type assigned successfully",
      data: newType
    });

  } catch (error) {
    console.error("Create Type Error:", error);
    return res.status(500).json({
      message: "Failed to create type",
      error: error.message
    });
  }
};


exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.find({ status: "active" })
      .populate("userId", "name email role");

    return res.status(200).json({
      message: "Types fetched successfully",
      count: types.length,
      data: types
    });

  } catch (error) {
    console.error("Get Types Error:", error);
    return res.status(500).json({
      message: "Failed to fetch types",
      error: error.message
    });
  }
};


exports.updateType = async (req, res) => {
  try {
    const { type_id } = req.params;
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const existingType = await Type.findOne({
      _id: type_id,
      status: "active"
    });

    if (!existingType) {
      return res.status(404).json({ message: "Type not found" });
    }

    existingType.type = type;
    existingType.updated_by = req.user.user_id;
    existingType.updated_at = new Date();

    await existingType.save();

    return res.status(200).json({
      message: "Type updated successfully",
      data: existingType
    });

  } catch (error) {
    console.error("Update Type Error:", error);
    return res.status(500).json({
      message: "Failed to update type",
      error: error.message
    });
  }
};


exports.deleteType = async (req, res) => {
  try {
    const { type_id } = req.params;

    const deletedType = await Type.findByIdAndDelete(type_id);

    if (!deletedType) {
      return res.status(404).json({
        message: "Type not found"
      });
    }

    return res.status(200).json({
      message: "Type deleted permanently"
    });

  } catch (error) {
    console.error("Hard Delete Type Error:", error);
    return res.status(500).json({
      message: "Failed to delete type",
      error: error.message
    });
  }
};
