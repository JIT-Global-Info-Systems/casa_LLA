const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createMediator } = require("../controllers/MediatorController");

router.post(
  "/create",
  upload.fields([
    { name: "pan_upload", maxCount: 1 },
    { name: "aadhar_upload", maxCount: 1 }
  ]),
  createMediator
);

module.exports = router;
