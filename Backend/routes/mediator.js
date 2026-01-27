const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const mediatorController = require("../controllers/mediatorController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post(
  "/create",
  upload.fields([
    { name: "pan_upload", maxCount: 1 },
    { name: "aadhar_upload", maxCount: 1 }
  ]),
  verifyToken,
  mediatorController.createMediator
);

router.put("/update/:mediatorId", verifyToken, mediatorController.updateMediator);
router.delete("/delete/:mediatorId", verifyToken, mediatorController.deleteMediator);
router.get("/all", verifyToken, mediatorController.getAllMediators);

module.exports = router;
