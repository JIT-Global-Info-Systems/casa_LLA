const Stage = require("../models/Stage");

/**
 * CREATE Stage
 */
exports.createStage = async (req, res) => {
  try {
    const { stage_name } = req.body;

    if (!stage_name) {
      return res.status(400).json({ message: "Stage name is required" });
    }

    const exists = await Stage.findOne({ stage_name });
    if (exists) {
      return res.status(409).json({ message: "Stage already exists" });
    }

    const stage = await Stage.create({
      stage_name,
      created_by: req.user.user_id
    });

    res.status(201).json({
      message: "Stage created successfully",
      data: stage
    });
    
  } catch (error) {
    console.error("Create Stage Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * GET All Stages
 */
exports.getAllStages = async (req, res) => {
  try {
    const stages = await Stage.find().sort({ stage_id: 1 });

    res.status(200).json({
      count: stages.length,
      data: stages
    });
  } catch (error) {
    console.error("Create Stage Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * GET Stage by ID
 */
exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);

    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    res.status(200).json({ data: stage });
  } catch (error) {
    console.error("Create Stage Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * UPDATE Stage
 */
exports.updateStage = async (req, res) => {
  try {
    const { stage_name } = req.body;

    const stage = await Stage.findById(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    if (stage_name) {
      const duplicate = await Stage.findOne({
        stage_name,
        _id: { $ne: stage._id }
      });

      if (duplicate) {
        return res.status(409).json({ message: "Stage name already exists" });
      }

      stage.stage_name = stage_name;
    }

    stage.updated_by = req.user.user_id;
    stage.updated_at = new Date();

    await stage.save();

    res.status(200).json({
      message: "Stage updated successfully",
      data: stage
    });
  } catch (error) {
    console.error("Create Stage Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
