const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.post("/create", leadController.createLead);
router.put("/update/:leadId", leadController.updateLead);
router.delete("/delete/:leadId", leadController.softDeleteLead);
router.get("/all", leadController.getAllLeads);
router.get("/approved", leadController.getApprovedLeads);

module.exports = router;
