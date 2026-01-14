import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// Create lead
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leads
router.get("/", async (req, res) => {
  const leads = await Lead.find()
    .populate("createdByMediatorId")
    .populate("assignedTo");

  res.json(leads);
});

// Move lead to next step
router.put("/:id/move", async (req, res) => {
  try {
    const { nextStep, nextRole, assignedTo } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        currentStep: nextStep,
        currentRole: nextRole,
        assignedTo
      },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
