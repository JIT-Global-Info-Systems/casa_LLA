const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const upload = require("../middleware/uploadMiddleware");

router.post("/create",upload.fields([
    { name: "fmb_sketch", maxCount: 1 },
    { name: "patta_chitta", maxCount: 1 }
  ]), leadController.createLead);
router.put("/update/:leadId", leadController.updateLead);
router.delete("/delete/:leadId", leadController.softDeleteLead);
router.get("/all", leadController.getAllLeads);
router.get("/approved", leadController.getApprovedLeads);
router.get("/:leadId", leadController.getLeadById);

module.exports = router;
