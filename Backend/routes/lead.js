const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const upload = require("../middleware/uploadMiddleware");
 
const { verifyToken } = require("../middleware/authMiddleware");
 
router.post("/create",verifyToken,upload.fields([
    { name: "fmb_sketch", maxCount: 1 },
    { name: "patta_chitta", maxCount: 1 }
  ]), verifyToken, leadController.createLead);
router.put("/update/:leadId",verifyToken, upload.fields([
  { name: "fmb_sketch", maxCount: 1 },
  { name: "patta_chitta", maxCount: 1 }
]), verifyToken, leadController.updateLead);
router.delete("/delete/:leadId", verifyToken, leadController.deleteLead);
router.get("/pending", verifyToken, leadController.getPendingLeads);
router.get("/all", verifyToken, leadController.getAllLeads);
router.get("/approved", verifyToken, leadController.getApprovedLeads);
router.get("/purchased", verifyToken, leadController.getPurchasedLeads);
router.get("/:leadId", verifyToken, leadController.getLeadById);
 
// Get all calls (optionally filtered by leadId)
router.get("/calls/all", verifyToken, leadController.getAllCalls);
 
module.exports = router;
 
 