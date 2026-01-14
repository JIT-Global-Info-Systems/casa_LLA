const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.post("/create", leadController.createLead);
router.put("/update/:leadId", leadController.updateLead);

module.exports = router;
