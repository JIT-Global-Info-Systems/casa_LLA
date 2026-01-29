const express = require("express");
const router = express.Router();
const stageController = require("../controllers/stageController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * Admin-only middleware can be added if needed
 */
router.post("/", verifyToken, stageController.createStage);
router.get("/", verifyToken, stageController.getAllStages);
router.get("/:id", verifyToken, stageController.getStageById);
router.put("/:id", verifyToken, stageController.updateStage);

module.exports = router;
