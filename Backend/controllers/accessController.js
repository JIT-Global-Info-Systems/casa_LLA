const Access = require("../models/Access");

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
    const { role } = req.params;

    const access = await Access.findOne({ role });

    if (!access) {
      return res.status(404).json({
        message: "Access not found for the specified role"
      });
    }

    return res.status(200).json({
      message: "Access retrieved successfully",
      data: access
    });

  } catch (error) {
    console.error("Get Access Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve access",
      error: error.message
    });
  }
};
