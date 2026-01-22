const Access = require("../models/access");

exports.createOrUpdateAccess = async (req, res) => {
  try {
    const { role, page_names } = req.body;

    if (!role || !Array.isArray(page_names)) {
      return res.status(400).json({
        message: "Role and page_names array are required"
      });
    }

    const access = await Access.findOneAndUpdate(
      { role },
      { page_names },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Access saved successfully",
      data: access
    });

  } catch (error) {
    console.error("Create/Update Access Error:", error);
    return res.status(500).json({
      message: "Failed to save access",
      error: error.message
    });
  }
};

exports.getAccessByRole = async (req, res) => {
  try {
    // Always fetch all access records
    const allAccess = await Access.find({}).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: allAccess.length,
      message: "All access records retrieved successfully",
      data: allAccess
    });
  } catch (error) {
    console.error("Get Access Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve access",
      error: error.message
    });
  }
};
