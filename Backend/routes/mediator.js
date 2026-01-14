const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createMediator, updateMediator } = require("../controllers/MediatorController");

router.post(
  "/create",
  upload.fields([
    { name: "pan_upload", maxCount: 1 },
    { name: "aadhar_upload", maxCount: 1 }
  ]),
  createMediator
);

router.put("/update/:mediatorId", updateMediator);

module.exports = router;
