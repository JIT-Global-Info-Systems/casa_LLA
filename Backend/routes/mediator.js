const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const mediatorController = require("../controllers/MediatorController");

router.post(
  "/create",
  upload.fields([
    { name: "pan_upload", maxCount: 1 },
    { name: "aadhar_upload", maxCount: 1 }
  ]),
  mediatorController.createMediator
);

router.put("/update/:mediatorId", mediatorController.updateMediator);
router.delete("/delete/:mediatorId", mediatorController.softDeleteMediator);
router.get("/all", mediatorController.getAllMediators);

module.exports = router;
