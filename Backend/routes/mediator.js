import express from "express";
import Mediator from "../models/Mediator.js";

const router = express.Router();

// Create mediator
router.post("/", async (req, res) => {
  try {
    const mediator = await Mediator.create(req.body);
    res.json(mediator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all mediators
router.get("/", async (req, res) => {
  const data = await Mediator.find();
  res.json(data);
});

export default router;
